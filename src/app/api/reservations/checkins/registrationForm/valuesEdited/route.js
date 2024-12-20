import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    // Obtém os parâmetros da URL
    const { searchParams } = new URL(request.url);
    const PropertyID = searchParams.get("propertyID");

    // Verifica se os parâmetros estão presentes
    if (!PropertyID) {
      return new NextResponse(
        JSON.stringify({ error: "Faltam parâmetros: PropertyID" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Garantir que PropertyID seja um número inteiro
    const propertyIDInt = parseInt(PropertyID, 10);

    if (isNaN(propertyIDInt)) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Consulta ao banco de dados para obter informações sobre o servidor e a porta
    const property = await prisma.properties.findUnique({
      where: { propertyID: propertyIDInt },
      select: { propertyServer: true, propertyPort: true }
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { propertyServer, propertyPort } = property;

    // Obtém os dados do corpo da requisição
    const body = await request.json();
    console.log("Dados recebidos no backend:", body);

    // Envia valores vazios se não houver alteração
    const dataToSend = {
      email: body.email || "",
      vatNo: body.vatNo || ""
    };

    // Verifica se os campos necessários estão presentes
    if (!dataToSend.email && !dataToSend.vatNo) {
      return new NextResponse(
        JSON.stringify({ error: "Faltam dados: email ou vatNo" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    console.log("Dados a serem enviados:", dataToSend);

    // Define a URL de destino dinamicamente
    const url = `http://${propertyServer}:${propertyPort}/valuesEdited`;

    // Envia os dados para o servidor externo
    const response = await axios.post(url, dataToSend);

    console.log("Resposta da API externa:", response.data);

    return new NextResponse(
      JSON.stringify({ message: "Dados recebidos e enviados com sucesso", data: response.data }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    console.error("Erro ao processar os dados:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao processar os dados" }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
