import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
    try {
        // Obtém os parâmetros da query string
        const { searchParams } = new URL(request.url);
        const propertyServer = searchParams.get("propertyServer");
        const propertyPort = searchParams.get("propertyPort");

        // Validação dos parâmetros
        if (!propertyServer || !propertyPort) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "propertyServer and propertyPort are required." }),
                { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }

        const url = `http://${propertyServer}:${propertyPort}/healthcheck`;

        try {
            // Realiza a verificação enviando um GET para o healthcheck
            const response = await axios.get(url);

            // Se a resposta for 200, a propriedade está ativa
            if (response.status === 200) {
                return new NextResponse(
                    JSON.stringify({ success: true, message: "Property is online." }),
                    { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
                );
            }

            // Caso a propriedade não esteja disponível
            return new NextResponse(
                JSON.stringify({ success: false, message: "Property returned an unexpected status." }),
                { status: response.status, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        } catch (error) {
            // Em caso de erro, propriedade é considerada offline
            console.error(`Error connecting to ${url}:`, error.message);
            return new NextResponse(
                JSON.stringify({ success: false, message: "Property is offline or unreachable." }),
                { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }
    } catch (error) {
        console.error("API Error:", error);
        return new NextResponse(
            JSON.stringify({ success: false, message: "Internal server error." }),
            { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
    }
}
