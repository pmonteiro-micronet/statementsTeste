import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;

  const requestId = parseInt(id, 10);

  if (isNaN(requestId)) {
    return new NextResponse(JSON.stringify({ error: "Invalid requestID" }), { status: 400 });
  }

  try {
    // 1) Tenta buscar no table `requestRecords` (comportamento original)
    let record = await prisma.requestRecords.findUnique({ where: { requestID: requestId } });

    // 2) Se não existir, procura nas outras tabelas onde `requestBody` também pode estar
    const fallbackTables = [
      { model: prisma.requestRecordsInHouses, name: 'requestRecordsInHouses' },
      { model: prisma.requestRecordsArrivals, name: 'requestRecordsArrivals' },
      { model: prisma.requestRecordsDepartures, name: 'requestRecordsDepartures' },
      { model: prisma.requestRecordsReservationsOta, name: 'requestRecordsReservationsOta' },
      { model: prisma.requestRecordsHousekeeping, name: 'requestRecordsHousekeeping' },
      { model: prisma.registrationRecords, name: 'registrationRecords' },
    ];

    if (!record) {
      for (const tbl of fallbackTables) {
        try {
          const found = await tbl.model.findUnique({ where: { requestID: requestId } });
          if (found) {
            // normaliza o registro para o mesmo formato usado por `requestRecords`
            record = { ...found };
            record._sourceTable = tbl.name; // para debug
            break;
          }
        } catch (e) {
          // alguns modelos podem não ter o método findUnique por nomes diferentes - ignore o erro e continue
          console.debug(`search ${tbl.name} failed:`, e?.message || e);
        }
      }
    }

    if (!record) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    // Normalizar `requestBody` e `responseBody` para string (algumas tabelas usam JSON native)
    const normalized = { ...record };
    if (typeof normalized.requestBody === 'object') {
      try {
        normalized.requestBody = JSON.stringify(normalized.requestBody);
      } catch {
        console.warn('Failed to stringify requestBody:', e);
        normalized.requestBody = String(normalized.requestBody);
      }
    }
    if (typeof normalized.responseBody === 'object') {
      try {
        normalized.responseBody = JSON.stringify(normalized.responseBody);
      } catch {
        normalized.responseBody = String(normalized.responseBody);
      }
    }

    // garante estrutura consistente (array de um item) para compatibilidade com o front-end
    return new NextResponse(JSON.stringify({ response: [normalized] }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PATCH(request, context) {
  try {
    // No App Router, params é async
    const { params } = context;
    const { id } = await params; // 👈 use await aqui
    if (!id) {
      return new NextResponse(JSON.stringify({ error: "Missing ID" }), { status: 400 });
    }

    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid requestID" }), { status: 400 });
    }

    console.log("Received id:", requestId);

    // Passo 1: Verificar quantos registros com seen = true já existem
    const seenRecords = await prisma.requestRecords.findMany({
      where: { seen: true },
      orderBy: { seenAt: "asc" },
    });

    console.log("Found seen records:", seenRecords);

    // Passo 2: Se já existirem 6 registros, remove o mais antigo
    if (seenRecords.length >= 6) {
      const oldestRecord = seenRecords[0];
      console.log("Deleting oldest record:", oldestRecord.requestID);

      await prisma.requestRecords.delete({
        where: { requestID: oldestRecord.requestID },
      });
    }

    // Passo 3: Verifica se o registro existe
    const record = await prisma.requestRecords.findUnique({
      where: { requestID: requestId },
    });

    if (!record) {
      console.error("Record not found");
      return new NextResponse(JSON.stringify({ error: "Record not found" }), { status: 404 });
    }

    // Passo 4: Atualiza para seen = true
    const updatedRecord = await prisma.requestRecords.update({
      where: { requestID: requestId },
      data: { seen: true, seenAt: new Date() },
    });

    console.log("Updated record:", updatedRecord);

    return new NextResponse(JSON.stringify({ response: updatedRecord }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}