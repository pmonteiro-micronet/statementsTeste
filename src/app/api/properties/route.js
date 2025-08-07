import { NextResponse } from "next/server"; // Removendo NextRequest pois não está em uso
import prisma from "@/lib/db";

export async function GET() {
  try {
    const response = await prisma.properties.findMany();

    return new NextResponse(JSON.stringify({ response }), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch records" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Desconexão do Prisma
  }
}

export async function PUT(req) {
  try {
    console.log("Iniciando processo de atualização das propriedades");
    const body = await req.json();
    console.log("Request body recebido:", body);

    const {
      propertyName,
      propertyTag,
      propertyServer,
      propertyPort,
      propertyPortStay,
      mpehotel,
      pdfFilePath,
      passeIni,
      hotelName,
      hotelTermsEN,
      hotelTermsPT,
      hotelTermsES,
      hotelPhone,
      hotelEmail,
      hotelAddress,
      hotelPostalCode,
      hotelRNET,
      hotelNIF,
      hasStay,
      replyEmail,
      replyPassword,
      sendingServer,
      sendingPort,
      emailSubject,
      emailBody,
      infoEmail,
      hasRoomCloud,
    } = body;

    if (!propertyName || !propertyTag || !hotelName) {
      return new NextResponse(
        JSON.stringify({ error: "Some required fields are missing." }),
        { status: 400 }
      );
    }

    if (typeof mpehotel !== "number") {
      return new NextResponse(
        JSON.stringify({
          error: "propertyPortStay and mpehotel must be numbers.",
        }),
        { status: 400 }
      );
    }

    // ✅ Converter valores para boolean de forma segura
    const stayValue = Boolean(hasStay);
    const roomCloudValue = Boolean(hasRoomCloud);

    console.log("Atualizando propriedades com hasStay:", stayValue, "hasRoomCloud:", roomCloudValue);

    let updatedProperties;
    const existingProperty = await prisma.properties.findUnique({
      where: { propertyTag },
    });

    if (existingProperty) {
      updatedProperties = await prisma.properties.update({
        where: { propertyTag },
        data: {
          propertyName,
          propertyServer,
          propertyPort,
          propertyPortStay,
          mpehotel,
          pdfFilePath,
          passeIni,
          hotelName,
          hotelTermsEN,
          hotelTermsPT,
          hotelTermsES,
          hotelPhone,
          hotelEmail,
          hotelAddress,
          hotelPostalCode,
          hotelRNET,
          hotelNIF,
          hasStay: stayValue,          // ✅ Boolean direto
          replyEmail,
          replyPassword,
          sendingServer,
          sendingPort,
          emailSubject,
          emailBody,
          infoEmail,
          hasRoomCloud: roomCloudValue // ✅ Boolean direto
        },
      });
    } else {
      updatedProperties = await prisma.properties.create({
        data: {
          propertyName,
          propertyTag,
          propertyServer,
          propertyPort,
          propertyPortStay,
          mpehotel,
          pdfFilePath,
          passeIni,
          hotelName,
          hotelTermsEN,
          hotelTermsPT,
          hotelTermsES,
          hotelPhone,
          hotelEmail,
          hotelAddress,
          hotelPostalCode,
          hotelRNET,
          hotelNIF,
          hasStay: stayValue,
          replyEmail,
          replyPassword,
          sendingServer,
          sendingPort,
          emailSubject,
          emailBody,
          infoEmail,
          hasRoomCloud: roomCloudValue
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ propertyId: updatedProperties.propertyID, updatedProperties }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no processo:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Failed to update properties." }),
      { status: 500 }
    );
  }
}
