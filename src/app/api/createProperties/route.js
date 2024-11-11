import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY =
  process.env.API_KEY || "vn2or398yvuh39fv9yf32faso987f987oihsao8789780hvw08f";

export async function POST(req, res) {
  // Verificar a API Key
  const apiKey = req.headers.get("x-api-key"); // Use req.headers.get() with the new fetch API in Next.js 13

  if (!apiKey || apiKey !== API_KEY) {
    return new Response(JSON.stringify({ message: "Invalid API key" }), {
      status: 403,
    });
  }

  try {
    const {
      propertyTag,
      propertyName,
      propertyServer,
      propertyPort,
      propertyConnectionString,
    } = await req.json();

    // Verificar se todos os campos obrigatórios estão presentes
    if (!propertyTag || !propertyName || !propertyServer) {
      return new Response(
        JSON.stringify({
          message: "Required fields: propertyTag, propertyName, propertyServer.",
        }),
        { status: 400 }
      );
    }

    // Inserir o novo registro na tabela 'properties'
    const newProperty = await prisma.properties.create({
      data: {
        propertyTag: propertyTag,
        propertyName: propertyName,
        propertyServer: propertyServer,
        propertyPort: propertyPort || null,
        propertyConnectionString: propertyConnectionString || null,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Property added successfully.",
        property: newProperty,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ message: "Database error", error: error.message }),
      { status: 500 }
    );
  }
}

// Fechando a conexão do Prisma ao encerrar a aplicação
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
