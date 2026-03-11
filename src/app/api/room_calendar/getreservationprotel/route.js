import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
    try {
        // Obter parâmetros da URL
        const { searchParams } = new URL(request.url);
        const propertyID = searchParams.get("propertyID");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Validação
        if (!propertyID) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        if (!startDate || !endDate) {
            return new NextResponse(
                JSON.stringify({ error: "mpehotel, startDate e endDate são obrigatórios." }),
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

        // Buscar dados da propriedade
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

        // Montar URL da API externa
        const { propertyServer, propertyPort, mpehotel } = property;
        const url = `http://${propertyServer}:${propertyPort}/getreservationprotel`;

        // Chamada para API externa
        const response = await axios.get(url, {
            params: {
                mpehotel,
                startDate,
                endDate
            },
            headers: {
                Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                "Content-Type": "application/json",
            },
        });

        const reservation = response.data;
        console.log(reservation);
        return new NextResponse(
            JSON.stringify(reservation),
            { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );

    } catch (error) {
        console.error("Erro ao buscar reservas:", error);

        return new NextResponse(
            JSON.stringify({ error: "Erro ao buscar reservas." }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }
}