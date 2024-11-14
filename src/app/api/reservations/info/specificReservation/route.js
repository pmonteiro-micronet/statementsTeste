import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ResNumber = searchParams.get("ResNumber");
  const window = searchParams.get("window");

  console.log("Dados recebidos no backend:", { ResNumber, window }); // Confirmação dos dados recebidos

  if (!ResNumber || window === null) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros" }),
      { status: 400 }
    );
  }

  try {
    // Monta a URL com os parâmetros na query string
    const response = await axios.get(
      `http://192.168.145.22:91/pp_xml_ckit_extratoconta`,
      {
        params: { ResNumber, window },
      }
    );
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(
      "Erro ao enviar dados para o Mock Server:",
      error.response ? error.response.data : error.message
    );
    return new NextResponse(
      JSON.stringify({
        error: error.response ? error.response.data : "Erro ao enviar dados para a API" + error,
      }),
      { status: 500 }
    );
  }
}