import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function GET(request, context) {
  const { id } = context.params;

  try {
    const response = await prisma.users.findMany({
      where: {
        userID: parseInt(id),
      },
    });

    // Verifique se a resposta está vazia
    if (response.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PATCH(request, context) {
    const { id } = context.params;
    const { oldPassword, newPassword } = await request.json(); // Extrair dados do corpo da requisição

    if (!oldPassword || !newPassword) {
        return new NextResponse(
            JSON.stringify({ message: "Missing old password or new password." }),
            { status: 400 }
        );
    }

    try {
        // Verifique se o usuário existe
        const user = await prisma.users.findUnique({
            where: { userID: parseInt(id) },
        });

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }

        // Verifique se a senha antiga está correta
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return new NextResponse(
                JSON.stringify({ message: "Incorrect old password." }),
                { status: 400 }
            );
        }

        // Atualize a senha com a nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.users.update({
            where: { userID: parseInt(id) },
            data: { password: hashedNewPassword },
        });

        console.log(updatedUser);
        
        return new NextResponse(
            JSON.stringify({ message: "Password updated successfully." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating password:", error);
        return new NextResponse(
            JSON.stringify({ message: "An error occurred." }),
            { status: 500 }
        );
    }
}
