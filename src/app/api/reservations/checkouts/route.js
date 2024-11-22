import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

// Para o método GET (busca por registros da data atual)
export async function GET() {
  try {
    // Buscar todos os registros na tabela
    const records = await prisma.requestRecordsReservations.findMany();

    // Processar o campo requestBody, convertendo JSON string para objeto
    const processedRecords = records
      .map(record => {
        try {
          // Parse o campo requestBody
          const data = JSON.parse(record.requestBody);
          return Array.isArray(data) ? data : [data]; // Garante que seja um array
        } catch (error) {
          console.error(`Erro ao parsear requestBody: ${record.id}`, error);
          return [];
        }
      })
      .flat(); // Combina os arrays em um único array de objetos

    // Filtrar registros pela data atual
    const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const filteredRecords = processedRecords.filter(record => record.DateCO === currentDate);

    // Retornar registros filtrados
    return new NextResponse(JSON.stringify({ response: filteredRecords }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch records" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Desconexão do Prisma
  }
}
