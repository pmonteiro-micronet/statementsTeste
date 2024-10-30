import { NextResponse } from "next/server"; 
import axios from "axios"; 

export async function POST(request) {
  const { propertyID, data } = await request.json();

  if (!propertyID || !data) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: propertyID ou data" }),
      { status: 400 }
    );
  }

  try {
    // Enviar os dados para o Mock Server
    const response = await axios.post('https://1f665a51-784d-4255-979e-660fb3c6a889.mock.pstmn.io/api/reservations/info', {
      propertyID,
      data,
    });

    // Retorna a resposta do Mock Server para o cliente
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Erro ao enviar dados para o Mock Server:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao enviar dados para o Mock Server" }),
      { status: 500 }
    );
  }
}