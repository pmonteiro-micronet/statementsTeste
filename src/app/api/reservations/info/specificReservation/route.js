import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

// Função para gerar a `uniqueKey`
const generateUniqueKey = (HotelInfo, Reservation, GuestInfo) => {
  if (!HotelInfo || !Reservation || !GuestInfo) {
    throw new Error("Dados insuficientes para gerar a chave única.");
  }

  const { Tag } = HotelInfo;
  const { RoomNumber, ReservationNumber, DateCI, DateCO } = Reservation;
  const { FirstName, LastName } = GuestInfo;

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
        { status: 404 }
      );
    }

    const { propertyServer, propertyPort } = property;
    const url = `http://${propertyServer}:${propertyPort}/pp_xml_ckit_extratoconta`;

    console.log("URL para requisição:", url);

    const response = await axios.get(url, {
      params: { ResNumber, window },
    });

    console.log("Resposta recebida do endpoint:", response.data);

    const data = response.data[0];
    const { HotelInfo, Reservation, GuestInfo } = data;
    const hotelInfo = HotelInfo?.[0];
    const reservation = Reservation?.[0];
    const guestInfo = GuestInfo?.[0];

    if (!hotelInfo || !reservation || !guestInfo) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes na resposta do endpoint." },
        { status: 400 }
      );
    }

    const uniqueKey = generateUniqueKey(hotelInfo, reservation, guestInfo);
    console.log("Generated uniqueKey:", uniqueKey);

    let newRequest;
    if (await prisma.requestRecords.findFirst({ where: { uniqueKey } })) {
      console.log("Statement já existe. Atualizando...");

      newRequest = await prisma.requestRecords.update({
        where: { uniqueKey },
        data: {
          requestBody: JSON.stringify(response.data),
          requestDateTime: new Date(),
          responseStatus: "200",
          responseBody: JSON.stringify(response.data),
        },
      });

      console.log("Statement atualizado com sucesso:", newRequest);
    } else {
      console.log("Statement não encontrado. Criando novo...");

      newRequest = await prisma.requestRecords.create({
        data: {
          requestBody: JSON.stringify(response.data),
          requestType: "GET",
          requestDateTime: new Date(),
          responseStatus: "200",
          responseBody: JSON.stringify(response.data),
          propertyID: propertyIDInt,
          seen: false,
          uniqueKey,
        },
      });

      console.log("Novo statement criado:", newRequest);
    }

    // Retorna os dados necessários, incluindo o requestID
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
    console.error(
      "Erro ao enviar dados para o servidor:",
      error.response ? error.response.data : error.message
    );
    return new NextResponse(
      JSON.stringify({
        error: error.response ? error.response.data : "Erro ao enviar dados para a API" + error,
      }),
      { status: 500 }
    );
  }
}
