import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para gerar uma chave única
const generateUniqueKey = (HotelInfo, Reservation, GuestInfo) => {
  const { Tag } = HotelInfo[0];
  const { RoomNumber, ReservationNumber, DateCI, DateCO } = Reservation[0];
  const { FirstName, LastName } = GuestInfo[0];
  
  return `${Tag}-${RoomNumber}-${ReservationNumber}-${DateCI}-${DateCO}-${FirstName}-${LastName}`;
};

// Função para lidar com requisições POST
export async function POST(req) {
  console.log("Received POST request");

  let newRequest; // Variável para armazenar o novo pedido
  try {
    const body = await req.json(); // Ler o corpo da requisição
    console.log("REQUEST BODY " , body);
    // Extrair os dados necessários do corpo da requisição
    const { HotelInfo, Reservation, GuestInfo } = body[0];
    const uniqueKey = generateUniqueKey(HotelInfo, Reservation, GuestInfo); // Gerar a chave única
    
    // Verificar se existe algum pedido anterior com a mesma chave única
    const existingRequest = await prisma.requestRecords.findFirst({
      where: {
        uniqueKey: uniqueKey,
      },
    });

    if (existingRequest) {
      // Se um pedido igual já existir, não salvar o novo pedido e retornar erro
      return NextResponse.json(
        { message: "Pedido com os mesmos dados já existe." },
        { status: 409 } // Status de conflito
      );
    }

    // Caso não exista um pedido com os mesmos dados, salvar o novo pedido
    const property = await prisma.properties.findFirst({
      where: { propertyTag: HotelInfo[0].Tag },
    });

    if (!property) {
      return NextResponse.json(
        { message: `Propriedade com Tag '${HotelInfo[0].Tag}' não encontrada.` },
        { status: 404 }
      );
    }

    // Criar o objeto que vamos salvar em requestRecords
    newRequest = await prisma.requestRecords.create({
      data: {
        requestBody: JSON.stringify(body), // Armazenar o corpo completo como JSON
        requestType: "POST",
        requestDateTime: new Date(),
        responseStatus: "201",
        responseBody: "",
        propertyID: property.propertyID, // Usar o propertyID encontrado
        seen: false,
        uniqueKey: uniqueKey, // Salvar a chave única no banco
      },
    });

    console.log("Data saved to DB:", newRequest);

    const responseBody = {
      message: "Dados armazenados com sucesso",
      data: newRequest,
    };

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error("Erro ao gravar os dados:", error.message);
    console.error("Detalhes do erro:", error);

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
          uniqueKey: uniqueKey, // Salvar a chave única em caso de erro
        },
      });
      console.log("Erro ao criar request. Novo erro salvo no DB.");
    }

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
