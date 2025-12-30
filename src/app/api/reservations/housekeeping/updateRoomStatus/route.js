import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
    try {
        // Receber payload do body
        const body = await request.json();

        const { propertyId, reservaId, roomStatus } = body;

        // Validar parâmetros obrigatórios
        if (!propertyId) {
            return new NextResponse(
                JSON.stringify({ error: "propertyId é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }
        if (!reservaId) {
            return new NextResponse(
                JSON.stringify({ error: "reservaId é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }
        if (roomStatus == null) {
            return new NextResponse(
                JSON.stringify({ error: "roomStatus é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        const propertyIDInt = parseInt(propertyId, 10);
        const reservaIDInt = parseInt(reservaId, 10);
        const roomStatusInt = parseInt(roomStatus, 10);

        if (isNaN(propertyIDInt) || isNaN(reservaIDInt) || isNaN(roomStatusInt)) {
            return new NextResponse(
                JSON.stringify({ error: "Valores inválidos." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Buscar host/porta no banco
        const property = await prisma.properties.findUnique({
            where: { propertyID: propertyIDInt },
            select: { propertyServer: true, propertyPort: true, mpehotel: true }
        });

        if (!property) {
            return new NextResponse(
                JSON.stringify({ error: "Propriedade não encontrada." }),
                { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        const { propertyServer, propertyPort, mpehotel } = property;

        // Montar URL da API externa (exemplo: atualizar room status)
        const url = `http://${propertyServer}:${propertyPort}/updateroomstatus`;

        const response = await axios.post(url, {
            headers: {
                Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                mpehotel: mpehotel,
                resNo: reservaIDInt,
                roomStatus: roomStatusInt,
                "Content-Type": "application/json"
            }
        });

        return new NextResponse(
            JSON.stringify({ success: true, data: response.data }),
            { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );

    } catch (error) {
        console.error("Erro ao atualizar Room Status:", error);

        return new NextResponse(
            JSON.stringify({
                error: "Erro inesperado",
                details: error.message
            }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }
}
