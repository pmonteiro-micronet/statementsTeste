import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
    try {
        // Lê os parâmetros da URL
        const { searchParams } = new URL(request.url);
        const propertyID = searchParams.get("propertyID");
        const resNo = searchParams.get("resNo");

        // Validação básica
        if (!propertyID || !resNo) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID e resNo são obrigatórios." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Converter propertyID para número
        const propertyIDInt = parseInt(propertyID, 10);
        if (isNaN(propertyIDInt)) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID inválido." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Buscar propertyServer e propertyPortStay no banco
        const property = await prisma.properties.findUnique({
            where: { propertyID: propertyIDInt },
            select: { propertyServer: true, propertyPortStay: true, mpehotel: true }
        });

        if (!property) {
            return new NextResponse(
                JSON.stringify({ error: "Propriedade não encontrada." }),
                { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        const { propertyServer, propertyPortStay, mpehotel } = property;

        // Construir a URL da API externa
        const url = `http://${propertyServer}:${propertyPortStay}/registrationForm/updateRealTime`;

        // Chamada ao servidor externo, passando mpeHotel e resNo nos headers
        const response = await axios.get(url, {
            headers: {
                Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                "Content-Type": "application/json",
                "mpeHotel": mpehotel,
                "resID": resNo
            },
        });

        const reservas = response.data;

        // Retorna as reservas tal como vêm (já JSON válido)
        return new NextResponse(
            JSON.stringify(reservas),
            { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );

    } catch (error) {
        console.error("Erro ao buscar reserva em tempo real:", error.message);

        return new NextResponse(
            JSON.stringify({ error: "Erro ao buscar reserva em tempo real." }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }
}
