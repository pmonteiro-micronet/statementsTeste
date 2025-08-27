import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";

export async function POST(request) {
  try {
    // Obtém os dados do corpo da requisição
    const body = await request.json();
    console.log("Dados recebidos no backend:", body);

    const { resNo, propertyID } = body;

    if (!resNo || !propertyID) {
      return new NextResponse(
        JSON.stringify({ error: "O número da reserva (resNo) e o propertyID são obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Busca informações do servidor da propriedade
    const property = await prisma.properties.findUnique({
      where: { propertyID },
      select: { propertyServer: true, propertyPort: true },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "Propriedade não encontrada no banco de dados." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { propertyServer, propertyPort } = property;
    const apiUrl = `http://${propertyServer}:${propertyPort}/updateCheckin`;

    console.log("Chamando API externa:", apiUrl);

    // Configuração do header com o Authorization e resNo
    const headers = {
      Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi", // Token de Authorization
      "Content-Type": "application/json",
      resNo: resNo, // Enviando o resNo no header para a API externa
    };

    // Envia a requisição para a API externa para atualizar o check-in
    const externalResponse = await axios.post(apiUrl, {}, { headers });

    return new NextResponse(
      JSON.stringify({ message: "Check-in atualizado com sucesso.", data: externalResponse.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao processar check-in:", error);

    return new NextResponse(
      JSON.stringify({ error: "Erro interno do servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
