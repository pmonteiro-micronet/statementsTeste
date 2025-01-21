import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(request, { params }) {
    const { id } = await params; // Não precisa do `await` aqui
    const { expirationDate } = await request.json(); // Extrai os dados da requisição

    if (!expirationDate) {
        return NextResponse.json(
            { message: "Missing expiration date." },
            { status: 400 }
        );
    }

    try {
        // Verifica se o usuário existe
        const user = await prisma.users.findUnique({
            where: { userID: parseInt(id) },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        // Converte expirationDate para um objeto Date
        const formattedExpirationDate = new Date(expirationDate);

        // Verifica se a data é válida
        if (isNaN(formattedExpirationDate)) {
            return NextResponse.json(
                { message: "Invalid expiration date format." },
                { status: 400 }
            );
        }

        // Atualiza o usuário com a nova data de expiração
        const updatedUser = await prisma.users.update({
            where: { userID: parseInt(id) },
            data: { expirationDate: formattedExpirationDate },
        });

        console.log(updatedUser);

        return NextResponse.json(
            { message: "Expiration date updated successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating expiration date:", error);
        return NextResponse.json(
            { message: "An error occurred." },
            { status: 500 }
        );
    }
}
