import { NextResponse } from 'next/server';
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Buscar todos os registros na tabela
    const records = await prisma.requestRecordsDepartures.findMany();
    console.log("Registros do banco de dados:", records);

    // Processar o campo requestBody, convertendo JSON string para objeto
    const processedRecords = records
      .map(record => {
        try {
          // Parse o campo requestBody
          const data = JSON.parse(record.requestBody);
          return Array.isArray(data) ? data : [data]; // Garante que seja um array
        } catch (error) {
          console.error(`Erro ao parsear requestBody no registro ${record.id}:`, error);
          return [];
        }
      })
      .flat(); // Combina os arrays em um único array de objetos

    console.log("Registros processados:", processedRecords);

    // Filtrar registros pela data atual
    const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const filteredRecords = processedRecords.filter(record => {
      const recordDate = record.DateCO?.split('T')[0]; // Remove o horário, se houver
      return recordDate === currentDate;
    });

    console.log("Registros filtrados por data:", filteredRecords);

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
