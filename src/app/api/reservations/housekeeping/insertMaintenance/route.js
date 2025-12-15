import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
    try {
        // Receber payload do body
        const body = await request.json();

        const {
            propertyID,
            room,
            reasonID,
            reasonText,
            isOOS,
            description,
            localText,
            image,
            createdDate,
            createdTime,
            createdBy,
        } = body;

        //Validar se propertyID existe
        if (!propertyID) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID é obrigatório." }),
                { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
            );
        }

        const propertyIDInt = parseInt(propertyID, 10);
        if (isNaN(propertyIDInt)) {
            return new NextResponse(
                JSON.stringify({ error: "propertyID inválido." }),
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

        //Montar URL da API externa
        const url = `http://${propertyServer}:${propertyPort}/insertmaintenance`;

       // Montar os headers
const headers = {
    Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
    mpehotel,
    room: String(room),
    bq: 0,
    reason: reasonID,
    reasonName: reasonText,
    solved: 0,
    createdDateAt: createdDate,
    createdBy: createdBy,
    createdTimeAt: createdTime,
    solvedDateAt: "1900-01-01",
    solvedBy: "n",
    solvedTimeAt: "00:00:00",
    orgreason: -1,
    resolutionStartDate: "1900-01-01",
    resolutionStartTime: "00:00:00",
    resolutionEstimatedTime: "0",
    tstartdt: "1900-01-01",
    tstartzt: "0",
    tdauer: 0,
    tkosten: 0.00,
    treason: -1,
    reasonNotes: description ?? "",
    textlokal: localText ?? "",
    dokument: image ?? "",
    prio: 0,
    _del: 0,
    "Content-Type": "application/json",
};

// Logar o que será enviado
console.log("🚀 Headers enviados para a API externa:", JSON.stringify(headers, null, 2));

// Enviar para a API externa
const response = await axios.post(url, null, { headers });

        // Retornar resposta ao front
        return new NextResponse(
            JSON.stringify({ success: true, data: response.data }),
            { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );

   } catch (error) {
    console.error("🔥 Erro ao enviar manutenção:", error);

    // Caso seja erro HTTP do Axios
    if (error.response) {
        console.error("📌 ERRO DA API EXTERNA:", {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
        });

        return new NextResponse(
            JSON.stringify({
                error: "Erro na API externa",
                status: error.response.status,
                details: error.response.data
            }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }

    // Caso seja erro de rede / Axios sem resposta
    if (error.request) {
        console.error("📌 Nenhuma resposta da API externa:", error.request);

        return new NextResponse(
            JSON.stringify({
                error: "Sem resposta da API externa",
                details: "A API não respondeu ou está offline."
            }),
            { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
    }

    // Erro desconhecido
    return new NextResponse(
        JSON.stringify({
            error: "Erro inesperado",
            details: error.message
        }),
        { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
}

}
