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
    } = body;

    if (!profileID || !propertyID || !resNo || !companyID) {
      return new NextResponse(
        JSON.stringify({ error: "profileID, propertyID, resNo e companyID são obrigatórios." }), 
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
    const url = `http://${property.propertyServer}:${property.propertyPort}/updateCompany`;
    console.log("Enviando dados para API externa:", url);

    // Enviar para API externa
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
      },
    });

    console.log("Resposta da API externa:", response.data);

    // Buscar registros no banco para atualização
    const recordArrivals = await prisma.requestRecordsArrivals.findFirst({
      where: { propertyID: Number(propertyID) },
      select: { requestID: true, responseBody: true },
    });

    const recordRequest = await prisma.requestRecords.findFirst({
      where: { propertyID: Number(propertyID) },
      select: { requestID: true, requestBody: true },
    });

    if (!recordArrivals || !recordRequest) {
      return new NextResponse(
        JSON.stringify({ error: "Registro não encontrado." }), 
        { status: 404 }
      );
    }

    // Converter JSONs do banco
    let responseBody = recordArrivals.responseBody
      ? (typeof recordArrivals.responseBody === "string" ? JSON.parse(recordArrivals.responseBody) : recordArrivals.responseBody)
      : [];

    let requestBody = recordRequest.requestBody
      ? (typeof recordRequest.requestBody === "string" ? JSON.parse(recordRequest.requestBody) : recordRequest.requestBody)
      : [];

    // Função para atualizar os dados da empresa dentro do JSON
    const atualizarCamposEmpresa = (json, resNo) => {
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

    console.log("Atualizando responseBody e requestBody com CompanyID:", companyID);

    atualizarCamposEmpresa(responseBody, resNo);
    atualizarCamposEmpresa(requestBody, resNo);

    console.log("responseBody FINAL antes de salvar:", JSON.stringify(responseBody, null, 2));
    console.log("requestBody FINAL antes de salvar:", JSON.stringify(requestBody, null, 2));

    // Atualizar responseBody e requestBody no banco
    await prisma.requestRecordsArrivals.update({
      where: { requestID: recordArrivals.requestID },
      data: { responseBody: JSON.stringify(responseBody) },
    });

    await prisma.requestRecords.update({
      where: { requestID: recordRequest.requestID },
      data: { requestBody: JSON.stringify(requestBody) },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Dados atualizados e armazenados com sucesso",
        updatedResponseBody: responseBody,
        updatedRequestBody: requestBody,
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
