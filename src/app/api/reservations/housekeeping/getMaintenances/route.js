import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    // Lê o body JSON
    const body = await request.json();
    const propertyID = body.propertyID;

    if (!propertyID) {
      return NextResponse.json({ error: "propertyID é obrigatório." }, { status: 400 });
    }

    const propertyIDInt = parseInt(propertyID, 10);
    if (isNaN(propertyIDInt)) {
      return NextResponse.json({ error: "propertyID inválido." }, { status: 400 });
    }

    // Buscar dados no banco
    const property = await prisma.properties.findUnique({
      where: { propertyID: propertyIDInt },
      select: { propertyServer: true, propertyPort: true, mpehotel: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Propriedade não encontrada." }, { status: 404 });
    }

    const { propertyServer, propertyPort, mpehotel } = property;
    const url = new URL(`http://${propertyServer}:${propertyPort}/gethousekeepingmaintenance`);
    url.searchParams.append("mpehotel", mpehotel);

    const response = await axios.get(url.toString(), {
      headers: {
        Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar housekeeping:", error);
    return NextResponse.json({ error: "Erro ao buscar housekeeping." }, { status: 500 });
  }
}
