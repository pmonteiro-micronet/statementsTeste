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

    // Capturar corretamente o CompanyID da resposta da API externa
    const companyID = response.data?.CompanyID; // Com "C" maiúsculo

    if (!companyID) {
      return new NextResponse(
        JSON.stringify({ error: "CompanyID não foi retornado pela API externa." }), 
        { status: 500 }
      );
    }

    // Buscar o registro no banco para atualização
    const record = await prisma.requestRecordsArrivals.findFirst({
      where: { propertyID: Number(propertyID) },
      select: { requestID: true, responseBody: true },
    });

    if (!record) {
      return new NextResponse(
        JSON.stringify({ error: "Registro não encontrado." }), 
        { status: 404 }
      );
    }

    const { requestID } = record;

    // Converter JSONs do banco de forma segura
    let responseBody = record.responseBody
      ? (typeof record.responseBody === "string" ? JSON.parse(record.responseBody) : record.responseBody)
      : [];

    // Função para atualizar os dados da empresa dentro do JSON (somente no responseBody)
    const atualizarCamposEmpresaNoResponseBody = (json, profileID, companyID) => {
      json.forEach((reserva) => {
        // Verifica se há algum hóspede com o profileID correto nesta reserva
        const hospedeEncontrado = reserva.GuestInfo.some((guest) =>
          guest.GuestDetails.some((detail) => detail.ProfileID === profileID)
        );
    
        if (hospedeEncontrado) {
          reserva.ReservationInfo.forEach((reservation) => {
            reservation.Company = companyName;
            reservation.CompanyEmail = emailAddress;
            reservation.CompanyVatNo = vatNo;
            reservation.CompanyState = state;
            reservation.CompanyCity = city;
            reservation.CompanyZipCode = zipCode;
            reservation.CompanyStreetAddress = streetAddress;
            reservation.CompanyCountryName = countryName;
            reservation.CompanyCountryID = countryID;
            reservation.hasCompanyVAT = 1;
            reservation.CompanyID = companyID; 
          });
        }
      });
    };    

    // Atualizar somente o responseBody com os dados da empresa e o novo CompanyID
    atualizarCamposEmpresaNoResponseBody(responseBody, profileID, companyID);

    // Atualizar banco de dados com a nova versão do responseBody
    await prisma.requestRecordsArrivals.update({
      where: { requestID: requestID },  
      data: {
        responseBody: JSON.stringify(responseBody),
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Dados enviados e armazenados com sucesso",
        updatedResponseBody: responseBody,
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