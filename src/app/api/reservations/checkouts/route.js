//app/api/reservations/checkouts
import { NextResponse } from 'next/server'; // Importa NextResponse
import prisma from "@/lib/db"; // Importa a instância do Prisma Client que você configurou

// Para o método GET (busca por registros da data atual)
export async function GET() {
    try {
      const response = await prisma.requestRecordsReservations.findMany();
  
      return new NextResponse(JSON.stringify({ response }), { status: 200 });
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

