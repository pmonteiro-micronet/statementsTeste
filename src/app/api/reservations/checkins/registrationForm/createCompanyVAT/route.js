import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Dados recebidos para envio:", body);

    const { profileID, propertyID, companyName, vatNo, emailAddress, countryID, countryName, streetAddress, zipCode, city, state } = body;

    if (!profileID || !propertyID) {
      return new NextResponse(JSON.stringify({ error: "profileID e propertyID são obrigatórios." }), { status: 400 });
    }

    // Buscar a propriedade para obter o servidor e a porta da API externa
    const property = await prisma.properties.findUnique({
      where: { propertyID: parseInt(propertyID, 10) },
      select: { propertyServer: true, propertyPort: true },
    });

    if (!property) {
      return new NextResponse(JSON.stringify({ error: "propertyID não encontrado." }), { status: 404 });
    }

    // ** Envio para a API externa antes de salvar no banco **
    const url = `http://${property.propertyServer}:${property.propertyPort}/insertCompany`;
    console.log("Enviando dados para API externa:", url);

    const dataToSend = {
      CompanyName: companyName,
      CountryID: countryID,
      CountryName: countryName,
      StreetAddress: streetAddress,
      ZipCode: zipCode,
      City: city,
      State: state,
      VatNo: vatNo,
      Email: emailAddress,
    };

    const response = await axios.post(url, dataToSend, {
      headers: {
        Authorization: "q4vf9p8n4907895f7m8d24m75c2q947m2398c574q9586c490q756c98q4m705imtugcfecvrhym04capwz3e2ewqaefwegfiuoamv4ros2nuyp0sjc3iutow924bn5ry943utrjmi",
        "Content-Type": "application/json",
      },
    });

    console.log("Resposta da API externa:", response.data);

    // ** Somente após sucesso, atualizar os dados no banco **
    const record = await prisma.requestRecordsArrivals.findFirst({
      where: { propertyID: parseInt(propertyID, 10) },
      select: { requestBody: true, responseBody: true },
    });

    if (!record) {
      return new NextResponse(JSON.stringify({ error: "Registro não encontrado." }), { status: 404 });
    }

    let requestBody = JSON.parse(record.requestBody);
    let responseBody = record.responseBody ? JSON.parse(record.responseBody) : [];

    // Função para atualizar os campos da empresa no JSON
    const atualizarCamposEmpresa = (json) => {
      json.forEach((reserva) => {
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
      });
    };    

    // Atualizar os campos nos dois JSONs
    atualizarCamposEmpresa([requestBody]); // Atualiza o requestBody
    atualizarCamposEmpresa(responseBody); // Atualiza o responseBody (lista)

    // Converter os JSONs de volta para string antes de salvar no banco
    const updatedRequestBody = JSON.stringify(requestBody);
    const updatedResponseBody = JSON.stringify(responseBody);

    // **Salvar os JSONs atualizados no banco**
    await prisma.requestRecordsArrivals.update({
      where: { propertyID: parseInt(propertyID, 10) },
      data: {
        requestBody: updatedRequestBody,
        responseBody: updatedResponseBody,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Dados enviados e armazenados com sucesso",
        updatedRequestBody: requestBody,
        updatedResponseBody: responseBody,
        externalAPIResponse: response.data,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar ou atualizar os dados:", error.response ? error.response.data : error.message);
    return new NextResponse(
      JSON.stringify({ error: error.response ? error.response.data : "Erro ao enviar ou atualizar os dados" }),
      { status: 500 }
    );
  }
}
