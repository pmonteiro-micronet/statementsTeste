import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function GET(request) {
    try {
        // Obtém os parâmetros da requisição (pode vir do client-side)
        const { searchParams } = new URL(request.url);
        const propertyID = searchParams.get("propertyID");

        if (!propertyID) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Garantir que propertyID seja um número
        const propertyIDInt = parseInt(propertyID, 10);
        if (isNaN(propertyIDInt)) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID inválido." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Buscar dados do servidor no banco de dados
        const property = await prisma.properties.findUnique({
            where: { propertyID: propertyIDInt },
            select: { propertyServer: true, propertyPortStay: true }
        });

        if (!property) {
            return new NextResponse(
                JSON.stringify({ error: "Propriedade não encontrada." }),
                { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        // Construir a URL da API externa
        const { propertyServer, propertyPortStay } = property;
        const url = `http://${propertyServer}:${propertyPortStay}/doctype`;

        // Fazer a requisição para buscar os tipos de documentos
        const response = await axios.get(url, {
            headers: {
                Authorization: 'q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi',
                'Content-Type': 'application/json',
            },
        });

        const doctypes = response.data;

        // Opcional: Filtrar ou transformar os dados se necessário
        const formattedDocTypes = doctypes.map((doctype) => ({
            value: doctype.ref,       // ID do tipo de documento
            label: doctype.text       // Nome do tipo de documento
        }));

        // Retornar os dados como JSON
        return new NextResponse(
            JSON.stringify(formattedDocTypes),
            { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    } catch (error) {
        console.error("Erro ao buscar tipos de documentos:", error.message);
        return new NextResponse(
            JSON.stringify({ error: "Erro ao buscar tipos de documentos." }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }
}
