// src/api/reservations/checkins/registrationForm/editaddress.js
import { NextResponse } from 'next/server';
import prisma from "@/lib/db";
import axios from "axios";

export async function POST(request) {
    try {
        // Parse JSON body from the incoming request
        const body = await request.json();

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

        //mudar o property stay para property port
        const url = `http://${propertyServer}:${propertyPort}/editaddress`;
        const response = await axios.post(url, null, { headers });

        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Proxy error:", error?.response?.data || error.message);

        const status = error.response?.status;
        const message =
            error.response?.data;

        return new Response(JSON.stringify(message), {
            status,
            headers: { "Content-Type": "application/json" },
        });
    }
}
