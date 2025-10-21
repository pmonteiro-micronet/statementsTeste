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
      state,
      oldCompany
    } = body;

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

    const url = `http://${property.propertyServer}:${property.propertyPort}/insertCompany`;
    console.log("Enviando dados para API externa:", url);

    // Enviar dados para API externa
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
        ResNo: resNo,
        OldCompany: oldCompany || "-1",
      },
    });

    console.log("Resposta da API externa:", response.data);

    // Capturar corretamente o CompanyID da resposta da API externa
    const companyID = response.data?.CompanyID;

    if (!companyID) {
      return new NextResponse(
        JSON.stringify({ error: "CompanyID não foi retornado pela API externa." }), 
        { status: 500 }
      );
    }

    // Buscar o requestBody na tabela requestRecords
    const record = await prisma.requestRecords.findFirst({
      where: { propertyID: Number(propertyID) },
      select: { requestID: true, requestBody: true },
    });

    if (!record) {
      return new NextResponse(
        JSON.stringify({ error: "Registro não encontrado." }), 
        { status: 404 }
      );
    }

    const { requestID } = record;

    // Converter requestBody para JSON
    let requestBody = record.requestBody
      ? (typeof record.requestBody === "string" ? JSON.parse(record.requestBody) : record.requestBody)
      : [];

    // Função para atualizar os dados da empresa no requestBody
    const atualizarCamposEmpresaNoRequestBody = (json, resNo, companyID) => {
      json.forEach((reserva) => {
        if (reserva.Reservation && reserva.Reservation.length > 0) {
          reserva.Reservation.forEach((reservation) => {
            if (reservation.ReservationNumber === resNo) {
              reservation.Company = companyName;
              reservation.CompanyEmail = emailAddress;
              reservation.companyVatNO = vatNo;
              reservation.CompanyState = state;
              reservation.CompanyCity = city;
              reservation.CompanyZipCode = zipCode;
              reservation.CompanyStreetAddress = streetAddress;
              reservation.CompanyCountryName = countryName;
              reservation.CompanyID = companyID;
              reservation.hasCompanyVAT = 1;
            }
          });
        }
      });
    };

    console.log("Atualizando requestBody com CompanyID:", companyID);

    atualizarCamposEmpresaNoRequestBody(requestBody, resNo, companyID);

    console.log("requestBody FINAL antes de salvar:", JSON.stringify(requestBody, null, 2));

    // Atualizar requestBody no banco
    await prisma.requestRecords.update({
      where: { requestID: requestID },
      data: {
        requestBody: JSON.stringify(requestBody),
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Dados enviados e armazenados com sucesso",
        updatedRequestBody: requestBody,
        externalAPIResponse: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar ou atualizar os dados:", error);

    return new NextResponse(
      JSON.stringify({
        error: error.response?.data || "Erro ao enviar ou atualizar os dados",
      }),
      { status: 500 }
    );
  }
}