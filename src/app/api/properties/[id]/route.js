import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, context) {
  const { id } = context.params;

  try {
    const response = await prisma.properties.findMany({
      where: {
        propertyID: parseInt(id),
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