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

    // Verificar se os campos obrigatórios estão presentes
    if (!profileID || !propertyID || !resNo || !companyID)  {
      return new NextResponse(
        JSON.stringify({ error: "profileID, propertyID , resNo e companyID são obrigatórios." }), 
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

    // Construir a URL da API externa (continua sendo POST, mas com propósito de atualização)
    const url = `http://${property.propertyServer}:${property.propertyPort}/updateCompany`;
    console.log("Enviando dados para API externa:", url);

    // Enviar para API externa com os dados no HEADER (sem "X-")
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
        CompanyID: companyID,
      },
    });

    console.log("Resposta da API externa:", response.data);

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

    // Agora podemos usar o requestID do registro encontrado
    const { requestID } = record;

    // Converter JSONs do banco de forma segura
    let responseBody = record.responseBody
      ? (typeof record.responseBody === "string" ? JSON.parse(record.responseBody) : record.responseBody)
      : [];

    // Função para atualizar os dados da empresa dentro do JSON (somente no responseBody)
    const atualizarCamposEmpresaNoResponseBody = (json, profileID) => {
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
          });
        }
      });
    };    

    // Atualizar somente o responseBody com os dados da empresa
    atualizarCamposEmpresaNoResponseBody(responseBody, profileID);

    // Atualizar banco de dados com a nova versão do responseBody
    await prisma.requestRecordsArrivals.update({
      where: { requestID: requestID },  // Usando requestID para atualizar o registro
      data: {
        responseBody: JSON.stringify(responseBody),  // Convertendo de volta para string
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Dados atualizados e armazenados com sucesso",
        updatedResponseBody: responseBody,
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