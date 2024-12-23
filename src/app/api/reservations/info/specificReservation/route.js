import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

// Função para gerar a `uniqueKey`
const generateUniqueKey = (HotelInfo, Reservation, GuestInfo = {}) => {
  const { Tag } = HotelInfo || {};
  const { RoomNumber, ReservationNumber, DateCI, DateCO } = Reservation || {};
  const { FirstName = "Unknown", LastName = "Unknown" } = GuestInfo || {};

  return `${Tag}-${RoomNumber}-${ReservationNumber}-${DateCI}-${DateCO}-${FirstName}-${LastName}`;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ResNumber = searchParams.get("ResNo");
  const window = searchParams.get("window");
  const PropertyID = searchParams.get("propertyID");

  console.log("Dados recebidos no backend:", { ResNumber, window, PropertyID });

  if (!ResNumber || !window || !PropertyID) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: ResNumber, window ou PropertyID" }),
      { status: 400 }
    );
  }

  const propertyIDInt = parseInt(PropertyID, 10);
  if (isNaN(propertyIDInt)) {
    return new NextResponse(
      JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
      { status: 400 }
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
        { status: 404 }
      );
    }

    const { propertyServer, propertyPort } = property;
    const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_extratoconta`;

    console.log("URL para requisição:", url);

    const response = await axios.get(url, { params: { ResNumber, window } });

    // Formata a resposta recebida
    const formattedResponse = JSON.stringify(response.data, null, 2);
    console.log("Resposta formatada recebida do endpoint:", formattedResponse);

    const data = response.data[0];
    const hotelInfo = data.HotelInfo?.[0] || {};
    const reservation = data.Reservation?.[0] || {};
    const guestInfo = data.GuestInfo?.[0] || {};

    if (!hotelInfo || !reservation) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes na resposta do endpoint." },
        { status: 400 }
      );
    }

    const uniqueKey = generateUniqueKey(hotelInfo, reservation, guestInfo);
    console.log("Generated uniqueKey:", uniqueKey);

    // Verificar se já existe um registro com o mesmo uniqueKey
    const existingRequest = await prisma.requestRecords.findFirst({
      where: { uniqueKey },
    });

    let newRequest;
    if (existingRequest) {
      console.log("Statement já existe. Atualizando...");

      newRequest = await prisma.requestRecords.update({
        where: { requestID: existingRequest.requestID },
        data: {
          requestBody: formattedResponse,
          requestDateTime: new Date(),
          responseStatus: "200",
          responseBody: formattedResponse,
        },
      });

      console.log("Statement atualizado com sucesso:", newRequest);
    } else {
      console.log("Statement não encontrado. Criando novo...");

      newRequest = await prisma.requestRecords.create({
        data: {
          requestBody: formattedResponse,
          requestType: "GET",
          requestDateTime: new Date(),
          responseStatus: "200",
          responseBody: formattedResponse,
          propertyID: propertyIDInt,
          seen: false,
          uniqueKey,
        },
      });

      console.log("Novo statement criado:", newRequest);
    }

    return new NextResponse(
      JSON.stringify({
        data: {
          requestID: newRequest.requestID,
          message: "Dados salvos ou atualizados com sucesso.",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar dados para o servidor:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({
        error: error.response ? error.response.data : "Erro ao enviar dados para a API: " + error,
      }),
      { status: 500 }
    );
  }
}