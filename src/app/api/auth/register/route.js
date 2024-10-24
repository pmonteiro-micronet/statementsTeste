// src/app/api/auth/register.js
import prisma from "@/lib/db"; // ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { firstName, secondName, email, password, pin } = await request.json();

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

  // Se o pin é um número, você pode considerar convertê-lo para string.
  // Também podemos optar por não encriptá-lo, se preferir, mas para fins de segurança, vamos fazer.
  const hashedPin = await bcrypt.hash(pin.toString(), 10);

  // Crie o novo usuário
  const newUser = await prisma.users.create({
    data: {
      firstName,
      secondName,
      email,
      password: hashedPassword,
      pin: hashedPin, // Adiciona o pin criptografado
    },
  });

  return new Response(JSON.stringify(newUser), { status: 201 });
}
