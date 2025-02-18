import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
  try {
    // Obtém os parâmetros da requisição (pode vir do client-side)
    const { searchParams } = new URL(request.url);
    const propertyID = searchParams.get("propertyID");

    if (!propertyID) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Garantir que propertyID seja um número
    const propertyIDInt = parseInt(propertyID, 10);
    if (isNaN(propertyIDInt)) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID inválido." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Buscar dados do servidor no banco de dados
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

    // Construir a URL da API externa
    const { propertyServer, propertyPort } = property;
    const url = `http://${propertyServer}:${propertyPort}/nationalities`;

    // Fazer a requisição para buscar as nacionalidades
    const response = await axios.get(url);
    console.log(response)
    const nationalities = response.data;

    // Retornar os dados como JSON
    return new NextResponse(
      JSON.stringify(nationalities),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Erro ao buscar nacionalidades:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao buscar nacionalidades." }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}
