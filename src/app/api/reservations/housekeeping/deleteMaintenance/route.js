import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { propertyID, refnr, internalRoom } = body;

        console.log("Received data:", body);

        // Validações básicas
        if (!propertyID || !refnr || internalRoom == null) {
            return NextResponse.json(
                { error: "Parâmetros obrigatórios em falta." },
                { status: 400 }
            );
        }

        const propertyIDInt = Number(propertyID);
        const internalRoomInt = Number(internalRoom);
        const refnrInt = Number(refnr);

        if (
            Number.isNaN(propertyIDInt) ||
            Number.isNaN(internalRoomInt) ||
            Number.isNaN(refnrInt)
        ) {
            return NextResponse.json(
                { error: "Valores inválidos." },
                { status: 400 }
            );
        }

        // Buscar host e porta
        const property = await prisma.properties.findUnique({
            where: { propertyID: propertyIDInt },
            select: { propertyServer: true, propertyPort: true }
        });

        if (!property) {
            return NextResponse.json(
                { error: "Propriedade não encontrada." },
                { status: 404 }
            );
        }

        const url = `http://${property.propertyServer}:${property.propertyPort}/deletemaintenance`;

        // Chamada à API externa (ainda usando DELETE, se necessário)
        const response = await axios.delete(url, {
            headers: {
                Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                refnr: refnrInt,
                room: internalRoomInt,
                "Content-Type": "application/json"
            },
            timeout: 5000
        });

        // 🔹 Tratar ReasonID
        const reasonId = response.data?.ReasonID;

        if (reasonId !== 1) {
            return NextResponse.json(
                {
                    error: "API externa retornou erro",
                    reasonId
                },
                { status: 400 }
            );
        }

        // ✅ Sucesso
        return NextResponse.json(
            {
                success: true,
                reasonId
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Erro ao atualizar a manutenção:",
            error.response?.data || error.message
        );

        return NextResponse.json(
            {
                error: "Erro inesperado",
                details: error.response?.data || error.message
            },
            { status: 500 }
        );
    }
}
