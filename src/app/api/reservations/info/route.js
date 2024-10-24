//app/api/reservations/info
import { NextResponse } from "next/server"; // Importa o NextResponse
import axios from "axios"; // Importa Axios para fazer requisições HTTP

export async function POST(request) {
  // Extrai os dados do corpo da requisição
  const { propertyID, data } = await request.json();

  // Valida os dados recebidos
  if (!propertyID || !data) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: propertyID ou data" }),
      { status: 400 }
    );
  }

  try {
    // Enviar os dados para o Mock Server usando a URL do endpoint específico
    const response = await axios.post('https://e66ef7df-5b4b-4133-9811-b17f6e9ab03c.mock.pstmn.io', {
      propertyID,
      data, // Use o valor enviado na requisição
    });

    // Retorna a resposta do Mock Server para o cliente
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Erro ao enviar dados para o Mock Server:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao buscar reservas no Mock Server" }),
      { status: 500 }
    );
  }
}
