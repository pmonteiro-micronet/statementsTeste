import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    // Obtém os dados do corpo da requisição
    const body = await request.json();
    console.log("Dados recebidos no backend:", body);

    // Obtém os dados do corpo da requisição
    const { profileID, propertyID, companyName, vatNo, emailAddress, country, streetAddress, zipCode, city, state } = body;

    if (!profileID || !propertyID || !companyName || !vatNo || !emailAddress || !country || !streetAddress || !zipCode || !city || !state) {
      return new NextResponse(
        JSON.stringify({ error: "Todos os campos são obrigatórios, incluindo profileID." }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Garantir que PropertyID seja um número inteiro
    const propertyIDInt = parseInt(propertyID, 10);

    if (isNaN(propertyIDInt)) {
        return new NextResponse(
          JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
          { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }
  
    // Consulta ao banco de dados para obter informações do servidor
    const property = await prisma.properties.findUnique({
        where: { propertyID: propertyIDInt },
        select: { propertyServer: true, propertyPort: true }
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "profileID não encontrado no banco de dados." }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { propertyServer, propertyPort } = property;
    const url = `http://${propertyServer}:${propertyPort}/companyVAT`;
    console.log("URL de destino:", url);

    // Dados a serem enviados para o servidor externo
    const dataToSend = {
      profileID,
      companyName,
      vatNo,
      emailAddress,
      country,
      streetAddress,
      zipCode,
      city,
      state
    };

    // Envio dos dados com token de autorização
    const response = await axios.post(url, dataToSend, {
      headers: {
        Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
        'Content-Type': 'application/json',
      },
    });

    console.log("Resposta da API externa:", response.data);

    return new NextResponse(
      JSON.stringify({ message: "Dados enviados com sucesso", data: response.data }),
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