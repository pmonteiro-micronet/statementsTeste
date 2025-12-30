import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, context) {
  const { propertyID } = await context.params;

  if (!propertyID) {
    return new NextResponse(
      JSON.stringify({ error: "propertyID is required" }),
      { status: 400 }
    );
  }

  try {
    const chatbot = await prisma.chatbotsStay.findUnique({
      where: {
        propertyID: parseInt(propertyID),
      },
    });

    if (!chatbot) {
      return new NextResponse(JSON.stringify({ response: null }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({ response: chatbot }), { status: 200 });
  } catch (error) {
    console.error("Error fetching chatbot data:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
