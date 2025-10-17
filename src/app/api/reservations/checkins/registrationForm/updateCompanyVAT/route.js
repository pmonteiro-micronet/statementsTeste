import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos para atualização:", body);

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
      state,
      companyID,
      oldCompany
    } = body;

    if (!profileID || !propertyID || !resNo || !companyID)  {
      return new NextResponse(
        JSON.stringify({ error: "profileID, propertyID , resNo e companyID são obrigatórios." }), 
        { status: 400 }
      );
    }

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

    const url = `http://${property.propertyServer}:${property.propertyPort}/updateCompany`;
    console.log("Enviando dados para API externa:", url);

    const response = await axios.post(url, null, {  
      headers: {
        Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
        "Content-Type": "application/json",
        CompanyName: companyName,
        CountryID: (typeof countryID === "number" && isNaN(countryID)) ? null : countryID,
        CountryName: countryName,
        StreetAddress: streetAddress,
        ZipCode: zipCode,
        City: city,
        State: state,
        VatNo: vatNo,
        Email: emailAddress,
        ResNo: resNo,
        CompanyID: companyID,
        OldCompany: oldCompany || "-1",
      },
    });
    console.log(oldCompany);
    console.log("Resposta da API externa:", response.data);

    return new NextResponse(
      JSON.stringify({
        message: "Dados enviados com sucesso para API externa",
        externalAPIResponse: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao atualizar os dados:", error);

    return new NextResponse(
      JSON.stringify({
        error: error.response?.data || "Erro ao atualizar os dados",
      }),
      { status: 500 }
    );
  }
}
