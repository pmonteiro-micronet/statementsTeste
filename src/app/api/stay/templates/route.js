import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const response = await prisma.stayTemplates.findMany();

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