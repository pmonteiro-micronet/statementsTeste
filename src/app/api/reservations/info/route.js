import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const HotelID = searchParams.get("mpehotel");
  const PropertyID = searchParams.get("propertyID");

  if (!PropertyID || !HotelID) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: HotelID ou PropertyID" }),
      { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  const propertyIDInt = parseInt(PropertyID, 10);

  if (isNaN(propertyIDInt)) {
    return new NextResponse(
      JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
      { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  try {
    const property = await prisma.properties.findUnique({
      where: { propertyID: propertyIDInt },
      select: { propertyServer: true, propertyPort: true },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
        { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    const { propertyServer, propertyPort } = property;

    const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_statementcheckouts`;
    console.log("URL para requisição:", url);

    const response = await axios.get(url, {
      params: { HotelID },
      headers: {
        Authorization:
          "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
      },
    });

    // Sempre garantir que seja um array
    const responseData = Array.isArray(response.data) ? response.data : [];

    // 🧹 1️⃣ Apagar todos os registros anteriores com este PropertyID
    await prisma.requestRecordsDepartures.deleteMany({
      where: { propertyID: propertyIDInt },
    });

    // 📝 2️⃣ Criar um novo registro
    const newRecord = await prisma.requestRecordsDepartures.create({
      data: {
        requestBody: responseData,
        requestType: "GET",
        requestDateTime: new Date(),
        responseStatus: "200",
        responseBody: JSON.stringify(responseData),
        propertyID: propertyIDInt,
      },
    });

    console.log("Novo registro salvo:", newRecord);

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
