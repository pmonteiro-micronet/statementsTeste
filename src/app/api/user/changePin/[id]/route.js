import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export async function PATCH(request, context) {
    const { id } = context.params;
    const { oldPin, newPin } = await request.json(); // Extrair dados do corpo da requisição

    if (!oldPin || !newPin) {
        return new NextResponse(
            JSON.stringify({ message: "Missing old pin or new pin." }),
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
        const pinMatch = await bcrypt.compare(oldPin, user.pin);
        if (!pinMatch) {
            return new NextResponse(
                JSON.stringify({ message: "Incorrect old pin." }),
                { status: 400 }
            );
        }

        // Atualize a senha com a nova senha
        const hashednewPin = await bcrypt.hash(newPin, 10);
        const updatedUser = await prisma.users.update({
            where: { userID: parseInt(id) },
            data: { pin: hashednewPin },
        });

        console.log(updatedUser);
        
        return new NextResponse(
            JSON.stringify({ message: "Pin updated successfully." }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating pin:", error);
        return new NextResponse(
            JSON.stringify({ message: "An error occurred." }),
            { status: 500 }
        );
    }
}