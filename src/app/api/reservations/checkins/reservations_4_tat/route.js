import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db"; // Certifique-se de que a importação está correta

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const HotelID = searchParams.get("mpehotel"); // Parâmetro HotelID para enviar na query
  const PropertyID = searchParams.get("propertyID"); // Parâmetro correto

  // Verifica se os parâmetros estão presentes
  if (!PropertyID || !HotelID) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: HotelID ou PropertyID" }),
      { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  // Garantir que PropertyID seja um número inteiro
  const propertyIDInt = parseInt(PropertyID, 10); // Converte para inteiro, base 10

  // Verificar se a conversão foi bem-sucedida
  if (isNaN(propertyIDInt)) {
    return new NextResponse(
      JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
      { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  try {
    // Consulta o banco de dados para encontrar o propertyServer e propertyPort com base no PropertyID
    const property = await prisma.properties.findUnique({
      where: {
        propertyID: propertyIDInt, // Passa o propertyID como número inteiro
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

    // Construa a URL dinamicamente com base nos dados retornados
    const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_statementcheckins`;
    console.log("URL para requisição:", url);

    // Enviar os dados como parâmetros na query string
    const response = await axios.get(url, {
      params: { HotelID }, // Usando HotelID na requisição
      headers: {
        Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi'
      },
    });

    // Verifica se a resposta contém dados
    const responseData = Array.isArray(response.data) ? response.data : [];

    // Busca o último registro existente na tabela com o mesmo PropertyID
    const existingRecord = await prisma.requestRecordsArrivals.findFirst({
      where: { propertyID: propertyIDInt },
      orderBy: { requestDateTime: "desc" },  // Ordena por data mais recente
    });

    if (existingRecord) {
      // Atualiza o registro existente com os dados retornados (seja vazio ou não)
      const updatedRecord = await prisma.requestRecordsArrivals.update({
        where: {
          requestID: existingRecord.requestID,  // Usa o requestID do registro existente
        },
        data: {
          requestBody: responseData,  // Atualiza o corpo com os dados retornados
          requestType: "GET",  // Tipo da requisição
          requestDateTime: new Date(),  // Data e hora da atualização
          responseStatus: "200",  // Status de resposta
          responseBody: JSON.stringify(responseData),  // Resposta completa (seja um array vazio ou com dados)
          propertyID: propertyIDInt,  // Atualiza o propertyID
        },
      });
      console.log("Registro atualizado:", updatedRecord);
    } else {
      // Caso o registro não exista, insere um novo com os dados retornados (seja vazio ou não)
      const newRequest = await prisma.requestRecordsArrivals.create({
        data: {
          requestBody: responseData,  // Corpo da requisição (array vazio ou com dados)
          requestType: "GET",  // Tipo da requisição
          requestDateTime: new Date(),  // Data e hora atual
          responseStatus: "200",  // Status de resposta
          responseBody: JSON.stringify(responseData),  // Resposta completa
          propertyID: propertyIDInt,  // Propriedade associada
        },
      });
      console.log("Novo registro inserido:", newRequest);
    }

    // Retorna a resposta do Mock Server para o cliente
    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error(
      "Erro ao enviar dados para a API:",
      error.response ? error.response.data : error.message
    );
    return new NextResponse(
      JSON.stringify({
        error: error.response
          ? error.response.data
          : "Erro ao enviar dados para a API",
      }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}

