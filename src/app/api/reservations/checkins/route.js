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

    // Valida se o resNo foi recebido
    if (!body.resNo) {
      return NextResponse.json(
        { message: "resNo é obrigatório." },
        { status: 400 }
      );
    }

    // Converte propertyID para int
    const propertyID = parseInt(body.propertyID, 10);
    if (isNaN(propertyID)) {
      return NextResponse.json(
        { message: "propertyID deve ser um número válido." },
        { status: 400 }
      );
    }

    // Consulta o propertyServer e propertyPort
    const property = await prisma.properties.findUnique({
      where: { propertyID },
      select: { propertyServer: true, propertyPort: true },
    });

    if (!property) {
      return NextResponse.json(
        { message: "PropertyID não encontrado no banco de dados" },
        { status: 404 }
      );
    }

    const { propertyServer, propertyPort } = property;

    // URL dinâmica
    const url = `http://${propertyServer}:${propertyPort}/updatecheckin`;
    console.log("URL para requisição:", url);

    // Chamada externa via axios
    const response = await axios.get(url, {
      headers: {
        Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
        resNo: String(body.resNo),
      },
    });

    console.log("Resposta externa:", response.data);

    return NextResponse.json({
      message: "Dados processados e enviados com sucesso",
      externalResponse: response.data,
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao processar os dados:", error.message);

    return NextResponse.json(
      { message: "Erro ao processar os dados", error: error.message },
      { status: 500 }
    );
  }
}

