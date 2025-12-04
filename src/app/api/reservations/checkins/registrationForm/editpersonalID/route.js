// src/api/reservations/checkins/registrationForm/editpersonalID.js
import { NextResponse } from 'next/server';
import prisma from "@/lib/db";
import axios from "axios";

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("[INFO] Dados recebidos no body:", body);

        const {
            DateOfBirth,
            CountryOfBirth,
            Nationality,
            IDDoc,
            DocNr,
            ExpDate,
            Issue,
            profileID,
            propertyID
        } = body;

        console.log("[INFO] Campos recebidos do body:", {
            DateOfBirth,
            CountryOfBirth,
            Nationality,
            IDDoc,
            DocNr,
            ExpDate,
            Issue,
            profileID,
            propertyID
        });

        if (!propertyID) {
            console.error("[ERRO] PropertyID está ausente");
            return new NextResponse(
                JSON.stringify({ error: "Faltam parâmetros: PropertyID" }),
                { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }

        const propertyIDInt = parseInt(propertyID, 10);
        if (isNaN(propertyIDInt)) {
            console.error("[ERRO] PropertyID não é um número válido:", propertyID);
            return new NextResponse(
                JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
                { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }

        const property = await prisma.properties.findUnique({
            where: { propertyID: propertyIDInt },
            select: { propertyServer: true, propertyPort: true }
        });

        if (!property) {
            console.error("[ERRO] PropertyID não encontrado no banco de dados:", propertyIDInt);
            return new NextResponse(
                JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
                { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }

        const { propertyServer, propertyPort } = property;
        console.log("[INFO] Dados da propriedade:", { propertyServer, propertyPort });

        const headers = {
            Authorization: process.env.API_AUTH_TOKEN,
            DateOfBirth: DateOfBirth,
            CountryOfBirth: isNaN(parseInt(CountryOfBirth)) ? null : parseInt(CountryOfBirth),
            Nationality: isNaN(parseInt(Nationality)) ? null : parseInt(Nationality),
            IDDoc: isNaN(parseInt(IDDoc)) ? null : parseInt(IDDoc),
            DocNr: DocNr ?? null,
            ExpDate: ExpDate,
            Issue: Issue,
            ProfileID: parseInt(profileID),
        };


        console.log("[INFO] Headers preparados para envio:", headers);

        const url = `http://${propertyServer}:${propertyPort}/editpersonal`;
        console.log("[INFO] Enviando requisição para:", url);

        const response = await axios.post(url, null, { headers });

        console.log("[SUCESSO] Resposta do servidor remoto:", response.data);

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("[ERRO] Falha ao processar requisição:");
        console.error("Mensagem:", error.message);
        console.error("Stack:", error.stack);
        if (error.response) {
            console.error("Resposta do servidor remoto:", error.response.data);
        }

        const status = error.response?.status || 500;
        const message = error.response?.data || { message: "Internal Server Error" };

        return new Response(JSON.stringify(message), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
