import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função para lidar com requisições POST
export async function POST(req) {
  console.log("Received POST request"); // Log para verificar o método da requisição

  let newRequest; // Definido para capturar o novo registro
  try {
    const body = await req.json(); // Ler o corpo da requisição

    // Desestruture os dados da requisição
    const {
      propertyID,
      Reservation,
      GuestInfo,
      Items,
      Taxes,
      DocumentTotals,
    } = body;

    // Criar o objeto que vamos salvar
    newRequest = await prisma.requestRecords.create({
      data: {
        requestBody: JSON.stringify(body), // Armazena o corpo completo como JSON
        requestType: "POST",
        requestDateTime: new Date(),
        responseStatus: "201",
        responseBody: "",
        propertyID: propertyID,
        seen: false,
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

    // Se `newRequest` foi criado, atualize com erro
    if (newRequest) {
      await prisma.requestRecords.update({
        where: {
          id: newRequest.id, // Certifique-se de que 'id' é o campo correto
        },
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
      // Caso não tenha conseguido criar `newRequest`, criar um novo registro de erro
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
    return NextResponse.json({ message: "Erro ao gravar os dados", error: error.message }, { status: 500 });
  }
}

// Função para lidar com requisições GET
export async function GET(req) {
  try {
    const allRequests = await prisma.requestRecords.findMany();
    console.log("GET request: Retrieved all requests:", allRequests);
    return NextResponse.json({ data: allRequests }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    return NextResponse.json({ message: "Erro ao buscar os dados" }, { status: 500 });
  }
}