import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt"; // Para encriptar senha e pin

export async function GET() {
  try {
    const response = await prisma.users.findMany();
    return new NextResponse(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch records" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    console.log("Iniciando processo de criação de usuário");
    const body = await req.json();
    console.log("Request body recebido:", body);

    const { firstName, secondName, email, selectedRole, password, pin, expirationDate } = body;

    if (!firstName || !secondName || !email || !selectedRole || !password) {
      console.error("Campos obrigatórios ausentes");
      return new NextResponse(
        JSON.stringify({ error: "All fields except pin are required." }),
        { status: 400 }
      );
    }

    console.log("Verificando se o email já está registrado");
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error("Email já registrado");
      return new NextResponse(
        JSON.stringify({ error: "Email is already registered." }),
        { status: 400 }
      );
    }

    console.log("Encriptando a senha e o PIN");
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = pin ? await bcrypt.hash(pin, 10) : null;

    // Se não houver expirationDate, defina a data padrão como 2222-01-01
    const defaultExpirationDate = new Date("2222-01-01");

    // 🔥 TRANSACTION: criar user e user_roles juntos
    const newUser = await prisma.$transaction(async (tx) => {
      // 1️⃣ Criar user
      const user = await tx.users.create({
        data: {
          firstName,
          secondName,
          email,
          password: hashedPassword,
          pin: hashedPin,
          expirationDate: expirationDate ? new Date(expirationDate) : defaultExpirationDate,
          permissions: 0,
        },
      });

      // 2️⃣ Criar relação user ↔ role
      await tx.user_roles.create({
        data: {
          userID: user.userID,        // 👈 campo correto do schema
          roleID: Number(selectedRole) // converte string do select para número
        },
      });

      return user;
    });

    console.log("Usuário criado com sucesso:", newUser);
    return new NextResponse(JSON.stringify({ newUser }), { status: 201 });
  } catch (error) {
    console.error("Erro no processo:", error);
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new NextResponse(
      JSON.stringify({ error: "Failed to create user." }),
      { status: 500 }
    );
  }
}
