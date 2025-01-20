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
            const response = await axios.get(url);

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
