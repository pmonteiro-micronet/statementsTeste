//app/api/reservations/checkouts
import { NextResponse } from 'next/server'; // Importa NextResponse
import prisma from "@/lib/db"; // Importa a instância do Prisma Client que você configurou

// Função para gerar a `uniqueKey`
const generateUniqueKey = (reservation, guest) => {
  if (!reservation || !guest) {
    throw new Error("Dados insuficientes para gerar a chave única.");
  }

  const { Room, ResNo, DateCI, DateCO } = reservation;
  const guestDetails = guest?.GuestDetails?.[0];
  const { FirstName, LastName } = guestDetails || {};

  if (!Room || !ResNo || !DateCI || !DateCO || !FirstName || !LastName) {
    throw new Error("Campos obrigatórios ausentes para gerar a chave única.");
  }

  return `${Room}-${ResNo}-${DateCI}-${DateCO}-${FirstName}-${LastName}`;
};

export async function POST(req) {
  console.log("Received POST request");

    try {
    const authHeader = req.headers.get("authorization");

    const expectedToken = process.env.API_AUTH_TOKEN;

    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json(
        { message: "Não autorizado. Token inválido ou ausente." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const reservation = body?.ReservationInfo?.[0];
    const guest = body?.GuestInfo?.[0];

    if (!reservation || !guest) {
      return NextResponse.json(
        { message: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const uniqueKey = generateUniqueKey(reservation, guest);
    console.log("Generated uniqueKey:", uniqueKey);

    // Obtenha o Tag do hotel de forma apropriada
    const hotelTag = req.headers.get("x-hotel-tag");

    if (!hotelTag) {
      return NextResponse.json(
        { message: "Header 'x-hotel-tag' obrigatório não fornecido." },
        { status: 400 }
      );
    }

    const property = await prisma.properties.findFirst({
      where: { propertyTag: hotelTag },
    });

    if (!property) {
      return NextResponse.json(
        { message: `Propriedade com Tag '${hotelTag}' não encontrada.` },
        { status: 404 }
      );
    }

    // Verifica se o registro já existe
    const existingRegistration = await prisma.registrationRecords.findFirst({
      where: { uniqueKey },
    });

    if (existingRegistration) {
      const updatedRegistration = await prisma.registrationRecords.update({
        where: { requestID: existingRegistration.requestID },
        data: {
          requestBody: JSON.stringify(body),
          requestDateTime: new Date(),
          responseStatus: "201",
          responseBody: JSON.stringify(body),
        },
      });

      return NextResponse.json(
        { message: "Registro atualizado com sucesso", data: updatedRegistration },
        { status: 200 }
      );
    } else {
      const newRegistration = await prisma.registrationRecords.create({
        data: {
          requestBody: JSON.stringify(body),
          requestType: "POST",
          requestDateTime: new Date(),
          responseStatus: "201",
          responseBody: JSON.stringify(body),
          propertyID: property.propertyID,
          seen: false,
          uniqueKey,
        },
      });

      return NextResponse.json(
        { message: "Novo registro criado com sucesso", data: newRegistration },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Erro ao gravar os dados:", error.message);

    return NextResponse.json(
      { message: "Erro ao processar os dados", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const response = await prisma.registrationRecords.findMany();

    return new NextResponse(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch records" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Desconexão do Prisma
  }
}