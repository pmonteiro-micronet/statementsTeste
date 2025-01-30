import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const userProperties = await prisma.usersProperties.findMany({
      where: {
        userID: parseInt(id),
      },
      select: {
        propertyID: true, // Retorna apenas o campo propertyID
      },
    });

    if (!userProperties || userProperties.length === 0) {
      return NextResponse.json(
        { error: "No properties found for the user." },
        { status: 404 }
      );
    }

    // Extraia apenas os IDs das propriedades
    const propertyIDs = userProperties.map((prop) => prop.propertyID);

    return NextResponse.json({ propertyIDs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user properties:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Associa uma propriedade ao usuário
export async function POST(req, { params }) {
  const userID = parseInt(params.id);
  const { propertyID, propertyTag } = await req.json();

  if (!userID || !propertyID || !propertyTag) {
      return new NextResponse(JSON.stringify({ error: "User ID, property ID, and propertyTag are required" }), { status: 400 });
  }

  try {
      const association = await prisma.usersProperties.create({
          data: { userID, propertyID, propertyTag },
      });

      return new NextResponse(JSON.stringify({ association }), { status: 201 });
  } catch (error) {
      console.error("Erro ao associar propriedade:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to associate property" }), { status: 500 });
  }
}

// DELETE: Remove a propriedade do usuário
export async function DELETE(req, { params }) {
  const userID = parseInt(params.id);
  const { propertyID } = await req.json();

  if (!userID || !propertyID) {
      return new NextResponse(JSON.stringify({ error: "User ID and property ID are required" }), { status: 400 });
  }

  try {
      await prisma.usersProperties.deleteMany({
          where: { userID, propertyID },
      });

      return new NextResponse(JSON.stringify({ message: "Property removed successfully" }), { status: 200 });
  } catch (error) {
      console.error("Erro ao remover propriedade:", error);
      return new NextResponse(JSON.stringify({ error: "Failed to remove property" }), { status: 500 });
  }
}
