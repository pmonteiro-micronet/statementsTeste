import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const response = await prisma.roomCloud.findMany();

        return new NextResponse(JSON.stringify({ response }), { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar registros:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to fetch records" }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect(); // Desconexão do Prisma
    }
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            propertyID,
            roomCloudUsername,
            roomCloudPassword,
            roomCloudHotelID
        } = body;

        if (!propertyID) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID is required" }),
                { status: 400 }
            );
        }

        // Verifica se já existe registro para este propertyID
        const existing = await prisma.roomCloud.findUnique({
            where: { propertyID },
        });

        let result;

        if (existing) {
            // Atualiza o registro existente
            result = await prisma.roomCloud.update({
                where: { propertyID },
                data: {
                    username: roomCloudUsername,
                    password: roomCloudPassword,
                    hotelID: roomCloudHotelID
                },
            });
        } else {
            // Cria novo registro
            result = await prisma.roomCloud.create({
                data: {
                    propertyID,
                    username: roomCloudUsername,
                    password: roomCloudPassword,
                    hotelID: roomCloudHotelID
                },
            });
        }

        return new NextResponse(JSON.stringify({ success: true, roomCloud: result }), {
            status: 201,
        });
    } catch (error) {
        console.error("Erro ao salvar roomCloud:", error);
        return new NextResponse(
            JSON.stringify({ error: "Erro ao salvar os dados do RoomCloud." }),
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
