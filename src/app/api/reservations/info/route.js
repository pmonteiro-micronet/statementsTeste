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
    // Verifica se já existe um pedido em processamento para este PropertyID
    const existingRequest = await prisma.requestRecordsDepartures.findFirst({
      where: {
        propertyID: propertyIDInt,
        responseStatus: "PROCESSING", // Assume que usamos esse status para identificar pedidos em andamento
      },
    });

    if (existingRequest) {
      return new NextResponse(
        JSON.stringify({ error: "Já existe um pedido em processamento para este PropertyID" }),
        { status: 409, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Marca um novo pedido como "PROCESSING" no banco de dados
    const processingRequest = await prisma.requestRecordsDepartures.create({
      data: {
        requestBody: null, // Inicialmente vazio
        requestType: "GET",
        requestDateTime: new Date(),
        responseStatus: "PROCESSING", // Status inicial
        responseBody: null,
        propertyID: propertyIDInt,
      },
    });

    try {
      // Consulta o banco de dados para encontrar o propertyServer e propertyPort com base no PropertyID
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
        throw new Error("PropertyID não encontrado no banco de dados");
      }

      const { propertyServer, propertyPort } = property;

      // Construa a URL dinamicamente com base nos dados retornados
      const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_statementcheckouts`;
      console.log("URL para requisição:", url);

      // Enviar os dados como parâmetros na query string
      const response = await axios.get(url, {
        params: { HotelID },
        headers: {
          Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
        },
      });

      // Apagar todos os registros da tabela requestRecordsDepartures antes de inserir novos dados
      await prisma.requestRecordsDepartures.deleteMany({
        where: {
          propertyID: propertyIDInt,
        },
      });

      // Salva o array de dados (reservas) como um único registro na tabela
      const newRequest = await prisma.requestRecordsDepartures.create({
        data: {
          requestBody: response.data,
          requestType: "GET",
          requestDateTime: new Date(),
          responseStatus: "200",
          responseBody: JSON.stringify(response.data),
          propertyID: propertyIDInt,
        },
      });

      console.log("Data saved to DB:", newRequest);

      // Retorna a resposta do Mock Server para o cliente
      console.log("OK: ", response);
      return new NextResponse(JSON.stringify(response.data), {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    } catch (error) {
      throw error; // Repassa o erro para o bloco catch externo
    } finally {
      // Atualiza o status do pedido para finalizado
      await prisma.requestRecordsDepartures.update({
        where: { id: processingRequest.id },
        data: { responseStatus: "COMPLETED" },
      });
    }
  } catch (error) {
    console.error(
      "Erro ao processar a requisição:",
      error.response ? error.response.data : error.message
    );
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao processar a requisição" }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}
