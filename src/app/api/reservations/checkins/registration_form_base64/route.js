import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db"; // Certifique-se de que o Prisma esteja configurado corretamente

export async function POST(request) {
  try {
    // Parse do corpo da requisição
    const body = await request.json(); // Pega o JSON enviado no corpo
    const { PropertyID, pdfBase64, fileName } = body;

    // Validação dos campos obrigatórios
    if (!PropertyID || !pdfBase64 || !fileName) {
      return new NextResponse(
        JSON.stringify({ error: "Parâmetros ausentes: PropertyID, pdfBase64 ou fileName" }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Garantir que PropertyID seja um número inteiro
    const propertyIDInt = parseInt(PropertyID, 10);
    if (isNaN(propertyIDInt)) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Consulta o banco de dados para obter propertyServer e propertyPort
    const property = await prisma.properties.findUnique({
      where: {
        propertyID: propertyIDInt,
      },
      select: {
        propertyServer: true,
        propertyPort: true,
      },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
        { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const { propertyServer, propertyPort } = property;

    // Constrói a URL dinamicamente
    const url = `http://${propertyServer}:${propertyPort}/registration_form_base64`;
    console.log("URL da requisição:", url);

    // Prepara os dados a serem enviados
    const data = {
      pdfBase64,
      fileName,
    };

    // Envia a requisição POST usando Axios
    const response = await axios.post(url, data);

    // Retorna o resultado ao cliente
    return new NextResponse(
      JSON.stringify({ message: "PDF enviado com sucesso", response: response.data }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Erro ao enviar PDF:", error.message);
    return new NextResponse(
      JSON.stringify({ error: "Erro interno ao processar a requisição", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}
