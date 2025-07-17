// src/api/reservations/checkins/registrationForm/editaddress.js
import { NextResponse } from 'next/server';
import prisma from "@/lib/db";
import axios from "axios";

export async function POST(request) {
    try {
        // Parse JSON body from the incoming request
        const body = await request.json();
        console.log("[INFO] Corpo da requisição recebido:", body);

        const {
            countryID,
            address,
            postalcode,
            city,
            region,
            profileID,
            propertyID
        } = body;

        const headers = {
            Authorization: process.env.API_AUTH_TOKEN,
            CountryID: parseInt(countryID),
            StreetAddress: address,
            PostalCode: postalcode,
            City: city,
            StateProvinceRegion: region,
            ProfileID: parseInt(profileID),
        };

        console.log("[INFO] Headers para a requisição externa:", headers);

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

        console.log("[INFO] Buscando propriedade com ID:", propertyIDInt);
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

        const url = `http://${propertyServer}:${propertyPort}/editaddress`;
        console.log("[INFO] URL montada para requisição externa:", url);

        const response = await axios.post(url, null, { headers });
        console.log("[INFO] Resposta da API externa:", {
            status: response.status,
            data: response.data
        });

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[ERRO] Exceção no proxy:", error?.response?.data || error.message);

        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Erro interno no servidor" };

        return new Response(JSON.stringify(message), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
