// app/api/properties/hotelTerms/[id]/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;

  console.log("ID recebido na API:", id);

  try {
    const response = await prisma.roomCloud.findMany({
      where: {
        propertyID: parseInt(id),
      },
    });

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