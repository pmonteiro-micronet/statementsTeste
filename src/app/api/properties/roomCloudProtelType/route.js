// app/api/properties/roomCloudProtelType/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET para buscar quartos de um propertyID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const propertyID = searchParams.get("propertyID");

    if (!propertyID) {
      return NextResponse.json(
        { error: "propertyID é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar todos os quartos do propertyID
    const rooms = await prisma.property_rooms.findMany({
      where: {
        propertyId: Number(propertyID),
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    return NextResponse.json({ error: "Erro ao buscar quartos" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { propertyID, rooms } = body;

    if (!propertyID) {
      return NextResponse.json(
        { error: "propertyID obrigatório" },
        { status: 400 }
      );
    }

    // 1. apagar tudo desta property
    await prisma.property_rooms.deleteMany({
      where: { propertyId: Number(propertyID) },
    });

    // 2. recriar tudo
    if (rooms?.length) {
      await prisma.property_rooms.createMany({
        data: rooms.map((r) => ({
          propertyId: propertyID,
          roomName: r.roomName,
          roomcloudId: r.roomcloudId,
          roomcount: parseInt(r.roomcount) || 0, 
        })),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao salvar" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    await prisma.property_rooms.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao apagar:", error);
    return NextResponse.json({ error: "Erro ao apagar" }, { status: 500 });
  }
}