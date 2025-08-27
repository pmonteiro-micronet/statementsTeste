//app/api/reservations/checkouts
import { NextResponse } from 'next/server'; // Importa NextResponse
import prisma from "@/lib/db"; // Importa a instância do Prisma Client que você configurou

// Para o método GET (busca por registros da data atual)
export async function GET() {
    try {
      const response = await prisma.requestRecordsArrivals.findMany();
  
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

// Exporta a função que lida com as requisições POST
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("POST Request received:", body);

    // Valida se o propertyID foi recebido
    if (!body.propertyID) {
      return NextResponse.json(
        { message: "propertyID é obrigatório." },
        { status: 400 }
      );
    }

    // Converte para int
    const propertyID = parseInt(body.propertyID, 10);

    if (isNaN(propertyID)) {
      return NextResponse.json(
        { message: "propertyID deve ser um número válido." },
        { status: 400 }
      );
    }

    // Cria um registro no banco de dados
    const newRequest = await prisma.requestRecordsArrivals.create({
      data: {
        requestBody: JSON.stringify(body),
        requestType: "POST",
        requestDateTime: new Date(),
        responseStatus: "201",
        responseBody: "",
        propertyID: propertyID, // Agora como Int
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

    return NextResponse.json(
      { message: "Erro ao gravar os dados", error: error.message },
      { status: 500 }
    );
  }
}

