import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const response = await prisma.roomCloudPropUsers.findMany();

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

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Request body recebido:", body);

    const { propertyID, userID } = body;

    if (!propertyID || !userID) {
      return new NextResponse(
        JSON.stringify({ error: "Some required fields are missing." }),
        { status: 400 }
      );
    }

    const updatedProperties = await prisma.roomCloudPropUsers.create({
      data: {
        propertyID,
        userID,
      },
    });

    return new NextResponse(
      JSON.stringify({
        propertyId: updatedProperties.propertyID,
        updatedProperties,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no processo:", error);
    return new NextResponse(
      JSON.stringify({
        error: error.message || "Failed to update properties.",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { propertyID, userID } = body;

    if (!propertyID || !userID) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID and userID are required." }),
        { status: 400 }
      );
    }

    const deleted = await prisma.roomCloudPropUsers.deleteMany({
      where: {
        propertyID,
        userID,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Associação removida com sucesso",
        deletedCount: deleted.count,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar associação:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Erro interno no servidor." }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
