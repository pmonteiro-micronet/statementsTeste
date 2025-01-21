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
