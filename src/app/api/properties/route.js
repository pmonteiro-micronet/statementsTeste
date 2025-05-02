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
      infoEmail
    } = body;

    // Verificar campos obrigatórios
    if (!propertyName || !propertyTag || !hotelName) {
      console.error("Campos obrigatórios ausentes");
      return new NextResponse(
        JSON.stringify({ error: "Some required fields are missing." }),
        { status: 400 }
      );
    }

    console.log("Validando tipos de dados");
    if (typeof mpehotel !== "number") {
      console.error("mpehotel devem ser números");
      return new NextResponse(
        JSON.stringify({
          error: "propertyPort and mpehotel must be numbers.",
        }),
        { status: 400 }
      );
    }

    console.log("Atualizando as propriedades no banco de dados");

    // Atualizar ou criar propriedades no banco
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

          hasStay,
          replyEmail,
          replyPassword,
          sendingServer,
          sendingPort,
          emailSubject,
          emailBody,
          infoEmail
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

          replyEmail,
          replyPassword,
          sendingServer,
          sendingPort,
          emailSubject,
          emailBody,
          infoEmail
        },
      });
    }

    console.log("Propriedades processadas com sucesso:", updatedProperties);

    // Retorna o ID da propriedade
    return new NextResponse(
      JSON.stringify({ propertyId: updatedProperties.id, updatedProperties }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no processo:", error);
    if (error instanceof Error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new NextResponse(
      JSON.stringify({ error: "Failed to update properties." }),
      { status: 500 }
    );
  }
}
