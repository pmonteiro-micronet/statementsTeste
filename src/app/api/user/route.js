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
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req) {
  try {
    console.log("Iniciando processo de criação de usuário");
    const body = await req.json();
    console.log("Request body recebido:", body);
  
    const { firstName, secondName, email, password, pin, expirationDate } = body;
  
    if (!firstName || !secondName || !email || !password) {
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

    const userData = {
      firstName,
      secondName,
      email,
      password: hashedPassword,
      pin: hashedPin,
      expirationDate: expirationDate ? new Date(expirationDate) : defaultExpirationDate, // Usa a data padrão se não fornecida
      permissions: 0,
    };

    console.log("Criando novo usuário no banco de dados");
    const newUser = await prisma.users.create({
      data: userData,
    });
  
    console.log("Usuário criado com sucesso:", newUser);
    return new NextResponse(JSON.stringify({ newUser }), { status: 201 });
  } catch (error) {
    console.error("Erro no processo:", error);
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new NextResponse(
      JSON.stringify({ error: "Failed to create user." }),
      { status: 500 }
    );
  }
}

