import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const response = await prisma.hotelTerms.findMany();

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

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      propertyID,
      termsAndCondEN,
      termsAndCondPT,
      termsAndCondES,
      privacyPolicyEN,
      privacyPolicyPT,
      privacyPolicyES
    } = body;

    if (!propertyID) {
      return new NextResponse(
        JSON.stringify({ error: "propertyID is required" }),
        { status: 400 }
      );
    }

    // Verifica se já existem termos para esse propertyID
    const existing = await prisma.hotelTerms.findUnique({
      where: { propertyID },
    });

    let result;

    if (existing) {
      // Atualiza os termos existentes
      result = await prisma.hotelTerms.update({
        where: { propertyID },
        data: {
          termsAndCondEN,
          termsAndCondPT,
          termsAndCondES,
          privacyPolicyEN,
          privacyPolicyPT,
          privacyPolicyES
        },
      });
    } else {
      // Cria novos termos
      result = await prisma.hotelTerms.create({
        data: {
          propertyID,
          termsAndCondEN,
          termsAndCondPT,
          termsAndCondES,
          privacyPolicyEN,
          privacyPolicyPT,
          privacyPolicyES
        },
      });
    }

    return new NextResponse(JSON.stringify({ success: true, hotelTerms: result }), {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao salvar hotelTerms:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erro ao salvar os termos do hotel." }),
      { status: 500 }
    );
  }
}
