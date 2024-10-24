import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API_KEY =
  process.env.API_KEY || "vn2or398yvuh39fv9yf32faso987f987oihsao8789780hvw08f"; // Chave da API

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Verificar a API Key
    const apiKey = req.headers["x-api-key"]; // Esperamos a chave no cabeçalho 'x-api-key'

    if (!apiKey || apiKey !== API_KEY) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    try {
      const {
        propertyTag,
        propertyName,
        propertyServer,
        propertyPort,
        propertyConnectionString,
      } = req.body;

      // Verificar se todos os campos obrigatórios estão presentes
      if (!propertyTag || !propertyName || !propertyServer) {
        return res.status(400).json({
          message:
            "Required fields: propertyTag, propertyName, propertyServer.",
        });
      }

      // Inserir o novo registro na tabela 'properties'
      const newProperty = await prisma.properties.create({
        data: {
          propertyTag: propertyTag,
          propertyName: propertyName,
          propertyServer: propertyServer,
          propertyPort: propertyPort || null, // Campo opcional
          propertyConnectionString: propertyConnectionString || null, // Campo opcional
        },
      });

      return res.status(201).json({
        message: "Property added successfully.",
        property: newProperty,
      });
    } catch (error) {
      console.error("Database error:", error);
      return res
        .status(500)
        .json({ message: "Database error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
}

// Fechando a conexão do Prisma ao encerrar a aplicação
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
