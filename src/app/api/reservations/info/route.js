import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyID = searchParams.get("propertyID");
  const data = searchParams.get("data");

  if (!propertyID || !data) {
    return new NextResponse(
      JSON.stringify({ error: "Faltam parâmetros: propertyID ou data" }),
      { status: 400 }
    );
  }

  try {
    // Enviar os dados como parâmetros na query string
    const response = await axios.get(
      'http://192.168.145.22/pp_xml_ckit_statementcheckouts',
      {
        params: { propertyID, data },
      }
    );

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
