import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// Função para lidar com requisições POST
export async function POST(req) {
  console.log("Received POST request");

  let newRequest; // Definido para capturar o novo registro
  try {
    const body = await req.json(); // Ler o corpo da requisição
    
    // Extrair informações do JSON
    const { HotelInfo, Reservation, GuestInfo } = body[0];
    const hotelInfo = HotelInfo?.[0];
    const reservation = Reservation?.[0];
    const guestInfo = GuestInfo?.[0];

    // Validar que os dados necessários estão presentes
    if (!hotelInfo || !reservation || !guestInfo) {
      return NextResponse.json(
        { message: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    // Gerar a chave única
    const uniqueKey = generateUniqueKey(hotelInfo, reservation, guestInfo);
    console.log("Generated uniqueKey:", uniqueKey);

    // Verificar se existe uma propriedade com o campo propertyTag igual ao valor de Tag
    const property = await prisma.properties.findFirst({
      where: { propertyTag: hotelInfo.Tag },
    });

    if (!property) {
      // Se não encontrar a propriedade, retornar erro 404
      return NextResponse.json(
        { message: `Propriedade com Tag '${hotelInfo.Tag}' não encontrada.` },
        { status: 404 }
      );
    }

    // Verificar se já existe um registro com a mesma uniqueKey
    const existingRequest = await prisma.requestRecords.findFirst({
      where: { uniqueKey: uniqueKey },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Registro com esta chave única já existe." },
        { status: 409 }
      );
    }

    // Criar o objeto que vamos salvar em requestRecords, usando o propertyID encontrado
    newRequest = await prisma.requestRecords.create({
      data: {
        requestBody: JSON.stringify(body), // Armazena o corpo completo como JSON
        requestType: "POST",
        requestDateTime: new Date(),
        responseStatus: "201",
        responseBody: "",
        propertyID: property.propertyID, // Usar o propertyID encontrado
        seen: false,
        uniqueKey: uniqueKey, // Armazenar a chave única
      },
    });

    console.log("Data saved to DB:", newRequest);

    // Prepare a resposta a ser enviada
    const responseBody = {
      message: "Dados armazenados com sucesso",
      data: newRequest,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error("Erro ao gravar os dados:", error.message);
    console.error("Detalhes do erro:", error);

    // Se newRequest foi criado, atualize com erro
    if (newRequest) {
      await prisma.requestRecords.update({
        where: { id: newRequest.id },
        data: {
          responseStatus: "500",
          responseBody: JSON.stringify({
            message: "Erro ao gravar os dados",
            error: error.message,
          }),
        },
      });
      console.log("Erro salvo no DB para o request", newRequest.id);
    } else {
      // Caso não tenha conseguido criar newRequest, criar um novo registro de erro
      await prisma.requestRecords.create({
        data: {
          requestBody: JSON.stringify(body),
          requestType: "POST",
          requestDateTime: new Date(),
          responseStatus: "500",
          responseBody: JSON.stringify({
            message: "Erro ao gravar os dados",
            error: error.message,
          }),
          propertyID: -1,
          seen: false,
        },
      });
      console.log("Erro ao criar request. Novo erro salvo no DB.");
    }

    // Retorne o erro ao cliente
    return NextResponse.json(
      { message: "Erro ao gravar os dados", error: error.message },
      { status: 500 }
    );
  }
}

// Função para lidar com requisições GET
export async function GET() {
  try {
    const allRequests = await prisma.requestRecords.findMany();
    console.log("GET request: Retrieved all requests:", allRequests);
    return NextResponse.json({ data: allRequests }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    return NextResponse.json({ message: "Erro ao buscar os dados" }, { status: 500 });
  }
}