import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyID, vatNo } = body;

    if (!propertyID || vatNo === undefined) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID e vatNo são obrigatórios." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const propertyIDInt = parseInt(propertyID, 10);
    if (isNaN(propertyIDInt)) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID inválido." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const property = await prisma.properties.findUnique({
      where: { propertyID: propertyIDInt },
      select: { propertyServer: true, propertyPort: true }
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "Propriedade não encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const { propertyServer, propertyPort } = property;

    // Monta query string dinamicamente
    const params = new URLSearchParams();
    params.append("vatno", vatNo.toString());

    const url = `http://${propertyServer}:${propertyPort}/verifyvat?${params.toString()}`;

    const externalResponse = await axios.get(url, {
      headers: {
        Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
        "Content-Type": "application/json"
      }
    });

    console.log("URL da requisição externa:", url);

    return new NextResponse(JSON.stringify(externalResponse.data), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });

  } catch (error) {
    console.error("Erro ao buscar empresa:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao buscar empresa." }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}
