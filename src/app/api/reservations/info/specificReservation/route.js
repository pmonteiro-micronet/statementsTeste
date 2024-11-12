import { NextResponse } from "next/server"; 
import axios from "axios"; 

export async function POST(request) {
  const { resNumber, window } = await request.json();  // Mantendo o nome "window"
  console.log("Dados recebidos no backend:", { resNumber, window }); // Confirmação dos dados recebidos

  if (!resNumber || window === undefined) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros" }),
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "http://192.168.10.201:91/pp_xml_ckit_extratoconta",
      { resNumber, window }
    );
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(
      "Erro ao enviar dados para o Mock Server:",
      error.response ? error.response.data : error.message
    );
    return new NextResponse(
      JSON.stringify({
        error: error.response ? error.response.data : "Erro ao enviar dados para o Mock Server",
      }),
      { status: 500 }
    );
  }
}
