import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db"; // Certifique-se de que a importação está correta

export async function POST(request) {
  try {
    // Obtém os parâmetros da URL
    const { searchParams } = new URL(request.url);
    const HotelID = searchParams.get("mpehotel");  // Parâmetro HotelID para enviar na query
    const PropertyID = searchParams.get("propertyID");  // Parâmetro PropertyID
    
    // Verifica se os parâmetros estão presentes
    if (!PropertyID || !HotelID) {
      return new NextResponse(
        JSON.stringify({ error: "Faltam parâmetros: HotelID ou PropertyID" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }
    
    // Garantir que PropertyID seja um número inteiro
    const propertyIDInt = parseInt(PropertyID, 10);  // Converte para inteiro, base 10
    
    // Verificar se a conversão foi bem-sucedida
    if (isNaN(propertyIDInt)) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID inválido, deve ser um número" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Consulta ao banco de dados para obter informações sobre o servidor e a porta do PropertyID
    const property = await prisma.properties.findUnique({
      where: {
        propertyID: propertyIDInt,
      },
      select: {
        propertyServer: true,
        propertyPort: true,
      },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "PropertyID não encontrado no banco de dados" }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { propertyServer, propertyPort } = property;

    // Obtém os dados do corpo da requisição
    const body = await request.json();  // Agora obtém corretamente o corpo da requisição

    // Envia valores vazios se não houver alteração
    const dataToSend = {
      email: body.email || "",  // Envia um valor vazio se não houver alteração
      vatNo: body.vatNo || ""   // Envia um valor vazio se não houver alteração
    };

    // Verifica se os campos necessários estão presentes, mesmo que vazios
    if (!dataToSend.email && !dataToSend.vatNo) {
      return new NextResponse(
        JSON.stringify({ error: "Faltam dados: email ou vatNo" }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Exibe os dados recebidos no backend (console.log)
    console.log("Dados recebidos no backend:", dataToSend);

    // Define a URL de destino dinamicamente
    const url = `http://${propertyServer}:${propertyPort}/valuesEdited`;

    // Envia os dados para a URL externa
    const response = await axios.post(url, dataToSend);

    // Exibe a resposta da API externa
    console.log("Resposta da API externa:", response.data);

    // Retorna a resposta de sucesso
    return new NextResponse(
      JSON.stringify({ message: "Dados recebidos e enviados com sucesso", data: response.data }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    
  } catch (error) {
    // Se ocorrer um erro, retorna uma resposta de erro detalhada
    console.error("Erro ao processar os dados:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao processar os dados" }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
