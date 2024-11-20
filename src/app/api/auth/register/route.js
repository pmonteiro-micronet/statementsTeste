// src/app/api/auth/register.js
import prisma from "@/lib/db"; // ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";

const API_KEY =
  process.env.API_KEY || "vn2or398yvuh39fv9yf32faso987f987oihsao8789780hvw08f";

export async function POST(request) {
  // Verificar a API Key
  const apiKey = request.headers.get("x-api-key"); // Use req.headers.get() with the new fetch API in Next.js 13

  if (!apiKey || apiKey !== API_KEY) {
    return new Response(JSON.stringify({ message: "Invalid API key" }), {
      status: 403,
    });
  }

  try {
    const { firstName, secondName, email, password, pin, propertyTags } = await request.json();

    // Verifique se o email já está em uso
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email já está em uso." }), {
        status: 400,
      });
    }

    // Validação inicial: verificar se propertyTags é válido
    if (!Array.isArray(propertyTags) || propertyTags.length === 0) {
      return new Response(
        JSON.stringify({ error: "É necessário fornecer ao menos um propertyTag." }),
        { status: 400 }
      );
    }

    // Buscar os properties correspondentes às propertyTags
    const properties = await prisma.properties.findMany({
      where: {
        propertyTag: {
          in: propertyTags,
        },
      },
    });

    // Valida se todas as propertyTags foram encontradas
    const foundTags = properties.map((p) => p.propertyTag);
    const missingTags = propertyTags.filter((tag) => !foundTags.includes(tag));
    if (missingTags.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Os seguintes propertyTags não foram encontrados: ${missingTags.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // Se todos os propertyTags são válidos, prosseguir com o registro
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin.toString(), 10);

    // Criar o novo usuário
    const newUser = await prisma.users.create({
      data: {
        firstName,
        secondName,
        email,
        password: hashedPassword,
        pin: hashedPin,
      },
    });

    // Criar registros em usersProperties
    const usersPropertiesEntries = properties.map((property) => ({
      userID: newUser.userID,
      propertyID: property.propertyID,
      propertyTag: property.propertyTag,
    }));

    await prisma.usersProperties.createMany({
      data: usersPropertiesEntries,
    });

    // Retornar o novo usuário criado
    return new Response(JSON.stringify(newUser), { status: 201 });
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
