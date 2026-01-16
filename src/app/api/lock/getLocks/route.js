import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const propertyID = searchParams.get("propertyID");

        if (!propertyID) {
            return NextResponse.json(
                { error: "propertyID é obrigatório." },
                { status: 400 }
            );
        }

        const propertyIDInt = parseInt(propertyID, 10);
        if (isNaN(propertyIDInt)) {
            return NextResponse.json(
                { error: "propertyID inválido." },
                { status: 400 }
            );
        }

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

        const { propertyServer, propertyPort } = property;
        const url = `http://${propertyServer}:${propertyPort}/getlockemailconfig`;

        const response = await axios.get(url, {
            headers: {
                Authorization:
                    "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                "Content-Type": "application/json",
            },
        });

        // DEVOLVE DIRETAMENTE OS DADOS
        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error("Erro ao buscar emails de fechaduras:", error);
        return NextResponse.json(
            { error: "Erro ao buscar emails de fechaduras." },
            { status: 500 }
        );
    }
}
