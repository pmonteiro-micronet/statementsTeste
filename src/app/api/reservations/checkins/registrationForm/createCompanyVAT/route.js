import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos para envio:", body);

    const { 
      profileID, 
      propertyID, 
      resNo,
      companyName, 
      vatNo, 
      emailAddress, 
      countryID, 
      countryName, 
      streetAddress, 
      zipCode, 
      city, 
      state 
    } = body;

    // Verificar se os campos obrigatórios estão presentes
    if (!profileID || !propertyID || !resNo) {
      return new NextResponse(
        JSON.stringify({ error: "profileID, propertyID e resNo são obrigatórios." }), 
        { status: 400 }
      );
    }

    // Buscar a propriedade no banco
    const property = await prisma.properties.findUnique({
      where: { propertyID: Number(propertyID) },
      select: { propertyServer: true, propertyPort: true },
    });

    if (!property) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID não encontrado." }), 
        { status: 404 }
      );
    }

    // Construir a URL da API externa
    const url = `http://${property.propertyServer}:${property.propertyPort}/insertCompany`;
    console.log("Enviando dados para API externa:", url);

    // Enviar para API externa com os dados no HEADER
    const response = await axios.post(url, null, {  
      headers: {
        Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
        "Content-Type": "application/json",
        CompanyName: companyName,
        CountryID: countryID,
        CountryName: countryName,
        StreetAddress: streetAddress,
        ZipCode: zipCode,
        City: city,
        State: state,
        VatNo: vatNo,
        Email: emailAddress,
        ResNo : resNo,
      },
    });

    console.log("Resposta da API externa:", response.data);

    const companyID = response.data?.CompanyID;

    if (!companyID) {
      return new NextResponse(
        JSON.stringify({ error: "CompanyID não foi retornado pela API externa." }), 
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Dados enviados com sucesso (sem atualização de BD)",
        externalAPIResponse: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);

    return new NextResponse(
      JSON.stringify({
        error: error.response?.data || "Erro ao enviar os dados",
      }),
      { status: 500 }
    );
  }
}
