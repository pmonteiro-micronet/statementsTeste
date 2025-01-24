import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
    try {
        const { propertyServer, propertyPort } = await request.json(); // Extraindo dados do corpo da requisição

        if (!propertyServer || !propertyPort) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "propertyServer and propertyPort are required." }),
                { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        }

        const url = `http://${propertyServer}:${propertyPort}/healthcheck`;
        console.log("URL:", url);
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
                },
                timeout: 5000, // Definindo o timeout de 5 segundos
            });

            if (response.status === 200 && response.data.Status === "Running") {
                return new NextResponse(
                    JSON.stringify({ success: true, message: "Property is online.", timestamp: response.data.Timestamp }),
                    { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
                );
            }

            return new NextResponse(
                JSON.stringify({ success: false, message: "Property returned an unexpected status." }),
                { status: response.status, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
            );
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error(`Request to ${url} timed out after 5 seconds.`);
                return new NextResponse(
                    JSON.stringify({ success: false, message: "Request timed out. Property may be offline or slow to respond." }),
                    { status: 504, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
                );
            }
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
