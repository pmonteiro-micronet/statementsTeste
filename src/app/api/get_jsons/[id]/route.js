import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, context) {
  const { id } = context.params;

  try {
    const response = await prisma.requestRecords.findMany({
      where: {
        requestID: parseInt(id),
      },
    });

    // Verifique se a resposta está vazia
    if (response.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ response }), { status: 200 });
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