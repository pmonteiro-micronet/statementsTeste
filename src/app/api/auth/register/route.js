// src/app/api/auth/register.js
import prisma from "@/lib/db"; // ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { firstName, secondName, email, password } = await request.json();

  // Verifique se o email já está em uso
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(JSON.stringify({ error: "Email já está em uso." }), {
      status: 400,
    });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crie o novo usuário
  const newUser = await prisma.users.create({
    data: {
      firstName,
      secondName,
      email,
      password: hashedPassword,
    },
  });

  return new Response(JSON.stringify(newUser), { status: 201 });
}
