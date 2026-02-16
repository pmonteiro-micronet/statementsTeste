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
      } catch (e) {
        console.warn('Failed to stringify requestBody:', e);
        normalized.requestBody = String(normalized.requestBody);
      }
    }
    if (typeof normalized.responseBody === 'object') {
      try {
        normalized.responseBody = JSON.stringify(normalized.responseBody);
      } catch (e) {
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
    const { id } = context.params;

    console.log("Received id:", id); // Log para verificar o id recebido

    // Passo 1: Verificar quantos registros com seen = true já existem
    const seenRecords = await prisma.requestRecords.findMany({
      where: {
        seen: true,
      },
      orderBy: {
        seenAt: 'asc', // Ordena os registros pelo campo seenAt em ordem crescente
      },
    });

    console.log("Found seen records:", seenRecords); // Log para verificar os registros encontrados

    // Passo 2: Se já existirem 6 registros com seen = true, excluir o registro com o menor seenAt
    if (seenRecords.length >= 6) {
      const oldestRecord = seenRecords[0]; // O menor valor de seenAt está no índice 0 após a ordenação
      console.log("Oldest record to delete (based on seenAt):", oldestRecord); // Log para verificar o registro a ser excluído

      await prisma.requestRecords.delete({
        where: {
          requestID: oldestRecord.requestID, // Usando requestID para excluir o registro
        },
      });
    }

    // Passo 3: Verificar se o registro com requestID existe
    const record = await prisma.requestRecords.findUnique({
      where: {
        requestID: parseInt(id), // Verifica se o ID fornecido existe no banco de dados
      },
    });

    if (!record) {
      console.error("Record not found");
      return new NextResponse(JSON.stringify({ error: "Record not found" }), { status: 404 });
    }

    // Passo 4: Atualizar o campo `seen` para true e `seenAt` para a data atual
    const response = await prisma.requestRecords.update({
      where: {
        requestID: parseInt(id),
      },
      data: {
        seen: true,
        seenAt: new Date(), // Define o campo seenAt com a data e hora atual
      },
    });

    console.log("Updated record:", response); // Log para verificar o registro atualizado
    return new NextResponse(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}