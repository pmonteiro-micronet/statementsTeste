import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";

export async function POST(request) {
  try {
    // 1️⃣ Ler body
    const body = await request.json();
    console.log("[CCRead] Body recebido:", body);

    const propertyID = parseInt(body.propertyID, 10);

    if (!propertyID) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2️⃣ Buscar dados da propriedade
    const property = await prisma.properties.findUnique({
      where: { propertyID },
      select: {
        propertyServer: true,
        propertyPort: true,
      },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "Propriedade não encontrada." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { propertyServer, propertyPort } = property;
    const ccUrl = `http://${propertyServer}:${propertyPort}/read_cc`;
    console.log("[CCRead] Chamando serviço CC:", ccUrl);

    // 3️⃣ Função para tentar ler o cartão várias vezes
    async function tryReadCard(retries = 10, interval = 3000) {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await axios.get(ccUrl, {
            headers: {
              Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
              "Content-Type": "application/json",
            },
            timeout: 15000
          });

          // Se chegar aqui, deu certo
          return response.data;
        } catch (err) {
          console.warn(`[CCRead] Tentativa ${attempt} falhou: ${err.message}`);

          // Se for 400 "Cartão não inserido", continua tentando
          if (err.response?.status === 400 && attempt < retries) {
            await new Promise(res => setTimeout(res, interval));
          } else {
            // Qualquer outro erro ou última tentativa, lança
            throw err;
          }
        }
      }
    }

    // 4️⃣ Tentar ler o cartão
    const ccData = await tryReadCard();

    console.log("[CCRead] Dados recebidos do CC:", ccData);

    // 5️⃣ Retornar dados
    return new NextResponse(
      JSON.stringify(ccData),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[CCRead] Erro:", error);

    return new NextResponse(
      JSON.stringify({
        error: "Erro ao comunicar com o serviço do Cartão de Cidadão",
        details: error.response?.data || error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
