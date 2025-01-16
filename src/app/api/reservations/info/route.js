import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";  // Certifique-se de que a importação está correta

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const HotelID = searchParams.get("mpehotel");  // Parâmetro HotelID para enviar na query
  const PropertyID = searchParams.get("propertyID");  // Parâmetro correto

  // Verifica se os parâmetros estão presentes
  if (!PropertyID || !HotelID) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: HotelID ou PropertyID" }),
      { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  // Garantir que PropertyID seja um número inteiro
  const propertyIDInt = parseInt(PropertyID, 10);  // Converte para inteiro, base 10

  // Verificar se a conversão foi bem-sucedida
  if (isNaN(propertyIDInt)) {
    return new NextResponse(
      JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
      { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  try {
    // Consulta o banco de dados para encontrar o propertyServer e propertyPort com base no PropertyID
    const property = await prisma.properties.findUnique({
      where: {
        propertyID: propertyIDInt,  // Passa o propertyID como número inteiro
      },
      select: {
        propertyServer: true,
        propertyPort: true,
      },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { propertyServer, propertyPort } = property;

    // Construa a URL dinamicamente com base nos dados retornados
    const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_statementcheckouts`;
    console.log("URL para requisição:", url);

    // Enviar os dados como parâmetros na query string
    const response = await axios.get(url, {
      params: { HotelID },  // Usando HotelID na requisição
    });

    // Verifica se a resposta contém dados
    if (response.data && Array.isArray(response.data)) {
      // Apagar todos os registros da tabela requestRecordsDepartures antes de inserir novos dados
      await prisma.requestRecordsDepartures.deleteMany({
        where: {
          propertyID: propertyIDInt,  // Apaga os registros relacionados ao PropertyID
        },
      });

      // Salva o array de dados (reservas) como um único registro na tabela
      const newRequest = await prisma.requestRecordsDepartures.create({
        data: {
          requestBody: response.data, // Aqui, o mesmo JSON do responseBody
          requestType: "GET", // Tipo da requisição
          requestDateTime: new Date(), // Data e hora atual
          responseStatus: "200", // Supondo sucesso inicialmente
          responseBody: JSON.stringify(response.data), // Armazena a resposta completa
          propertyID: propertyIDInt, // Usar o propertyID extraído da query
        },
      });


      console.log("Data saved to DB:", newRequest);
    }

    // Retorna a resposta do Mock Server para o cliente
    console.log("OK: ", response);
    return new NextResponse(
      JSON.stringify(response.data),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (error) {
    console.error("Erro ao enviar dados para a API:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao enviar dados para a API" }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
