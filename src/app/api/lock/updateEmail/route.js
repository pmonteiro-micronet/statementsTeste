import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { propertyID, emailTitlePT, emailBodyPT, emailTitleEN, emailBodyEN } = body;

        console.log("Received data:", body);
        // Validações básicas
        if (!propertyID || !emailTitlePT || !emailBodyPT || !emailTitleEN || !emailBodyEN) {
            return NextResponse.json(
                { error: "Parâmetros obrigatórios em falta." },
                { status: 400 }
            );
        }

        const propertyIDInt = Number(propertyID);

        if (
            Number.isNaN(propertyIDInt)
        ) {
            return NextResponse.json(
                { error: "Valor de propertyID inválido." },
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

        const url = `http://${property.propertyServer}:${property.propertyPort}/updatelockemailconfig`;

        // Chamada à API externa
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                    emailTitlePT: emailTitlePT,
                    emailBodyPT: emailBodyPT,
                    emailTitleEN: emailTitleEN,
                    emailBodyEN: emailBodyEN,
                    "Content-Type": "application/json"
                },
                timeout: 5000
            }
        );

        console.log("Resposta da API externa:", response.data);
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );


    } catch (error) {
        console.error(
            "Erro ao atualizar a template de email:",
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
