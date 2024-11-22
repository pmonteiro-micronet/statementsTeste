import { NextResponse } from "next/server";
import prisma from "@/lib/db"; 

const generateUniqueKey = (HotelInfo, Reservation, GuestInfo) => {
  if (!HotelInfo || !Reservation || !GuestInfo) {
    throw new Error("Dados insuficientes para gerar a chave única.");
  }

  const { Tag } = HotelInfo;
  const { RoomNumber, ReservationNumber, DateCI, DateCO } = Reservation;
  const { FirstName, LastName } = GuestInfo;

  return `${Tag}-${RoomNumber}-${ReservationNumber}-${DateCI}-${DateCO}-${FirstName}-${LastName}`;
};

export async function POST(req) {
  console.log("Received POST request");

  try {
    const body = await req.json(); // Parse o corpo da requisição

    // Verificar se o corpo da requisição é válido
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "O corpo da requisição deve ser um array não vazio." },
        { status: 400 }
      );
    }

    // Extraindo o primeiro objeto do array
    const requestData = body[0];

    // Extraindo propriedades e verificando a existência
    const HotelInfo = requestData.HotelInfo?.[0];
    const Reservation = requestData.Reservation?.[0];
    const GuestInfo = requestData.GuestInfo?.[0];

    if (!HotelInfo || !Reservation || !GuestInfo) {
      return NextResponse.json(
        { message: "Dados obrigatórios ausentes: HotelInfo, Reservation ou GuestInfo." },
        { status: 400 }
      );
    }

    // Gerar a chave única para identificar o pedido
    const uniqueKey = generateUniqueKey(HotelInfo, Reservation, GuestInfo);
    console.log("Generated unique key:", uniqueKey);

    // Verificar se já existe um pedido com a mesma chave única
    const existingRequest = await prisma.requestRecords.findFirst({
      where: {
        uniqueKey: uniqueKey,
      },
    });

    console.log("Existing request check:", existingRequest);
    if (existingRequest) {
      return NextResponse.json(
        { message: "Pedido com os mesmos dados já existe." },
        { status: 409 }
      );
    }

    // Buscar a propriedade no banco
    const property = await prisma.properties.findFirst({
      where: { propertyTag: HotelInfo.Tag },
    });

    console.log("Property found:", property);
    console.log("Propriedade nao encontrada: ", !property);
    if (!property) {
      return NextResponse.json(
        { message: `Propriedade com Tag '${HotelInfo.Tag}' não encontrada.` },
        { status: 404 }
      );
    }

    // Criar o registro no banco
    const newRequest = await prisma.requestRecords.create({
      data: {
        requestBody: JSON.stringify(body),
        requestType: "POST",
        requestDateTime: new Date(),
        responseStatus: "201",
        responseBody: "",
        propertyID: property.propertyID,
        seen: false,
        uniqueKey: uniqueKey,
      },
    });

    console.log("New data saved to DB:", newRequest);

    return NextResponse.json(
      { message: "Dados armazenados com sucesso.", data: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao gravar os dados:", error.message);
    console.error("Detalhes do erro:", error);

    return NextResponse.json(
      { message: "Erro ao processar a requisição.", error: error.message },
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
