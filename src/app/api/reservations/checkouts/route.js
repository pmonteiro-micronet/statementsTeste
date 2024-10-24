//app/api/reservations/checkouts
import { NextResponse } from 'next/server'; // Importa NextResponse
import prisma from "@/lib/db"; // Importa a instância do Prisma Client que você configurou

// Para o método GET (busca por registros da data atual)
export async function GET(request) {
  try {
    // Obtém a data atual sem o componente de tempo
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Define a hora para 00:00:00 para comparação de data

    // Obtém a data de amanhã para comparação (para limitar a consulta apenas a hoje)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Recupera todos os registros com requestDateTime igual a hoje
    const allRequests = await prisma.requestRecordsReservations.findMany({
      where: {
        requestDateTime: {
          gte: today,    // maior ou igual a hoje
          lt: tomorrow,  // menor que amanhã
        },
      },
    });

    console.log("GET request: Retrieved all requests:", allRequests);
    return NextResponse.json({ data: allRequests }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
    return NextResponse.json({ message: "Erro ao buscar os dados" }, { status: 500 });
  }
}

// Exporta a função que lida com as requisições POST
export async function POST(request) {
  try {
    const body = await request.json(); // Lê o corpo da requisição
    console.log("POST Request received:", body);

    // Valida se o propertyID foi recebido
    if (!body.propertyID) {
      return NextResponse.json(
        { message: "propertyID é obrigatório." },
        { status: 400 }
      );
    }

    // Cria um registro no banco de dados
    const newRequest = await prisma.requestRecordsReservations.create({
      data: {
        requestBody: JSON.stringify(body), // Armazena o corpo completo como JSON
        requestType: "POST", // Definido como POST
        requestDateTime: new Date(), // Data e hora atual
        responseStatus: "201", // Supondo sucesso inicialmente
        responseBody: "", // Inicialmente vazio, será atualizado depois
        propertyID: body.propertyID, // Armazena o propertyID
      },
    });

    console.log("Data saved to DB:", newRequest);

    // Resposta de sucesso
    const responseBody = {
      message: "Dados armazenados com sucesso",
      data: newRequest,
    };

    // Envie a resposta ao cliente
    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error("Erro ao gravar os dados:", error.message);
    
    // Retorne o erro ao cliente
    return NextResponse.json(
      { message: "Erro ao gravar os dados", error: error.message },
      { status: 500 }
    );
  }
}
