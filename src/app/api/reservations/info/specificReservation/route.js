import { NextResponse } from "next/server"; 
import axios from "axios"; 

export async function POST(request) {
  // Desestruture os quatro parâmetros necessários
  const { propertyID, resNumber, roomNumber, window } = await request.json();

  // Verifique se todos os parâmetros estão presentes
  if (!propertyID || !resNumber || !roomNumber || !window) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros" }),
      { status: 400 }
    );
  }

  try {
    // Enviar os dados para o Mock Server
    const response = await axios.post('https://734359c8-b9cd-4bd4-910c-7bf97feb9d45.mock.pstmn.io/api/reservations/info', {
      propertyID,
      resNumber,
      roomNumber,
      window
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
