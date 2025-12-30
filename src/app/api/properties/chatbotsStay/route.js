import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyID = searchParams.get("propertyID");

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

export async function POST(request) {
  const { propertyID, active, provider, hijiffyToken, hijiffyCampaign } =
    await request.json();

  if (!propertyID) {
    return new NextResponse(
      JSON.stringify({ error: "propertyID is required" }),
      { status: 400 }
    );
  }

  try {
    // Upsert: update if exists, create if not
    const chatbot = await prisma.chatbotsStay.upsert({
      where: {
        propertyID: parseInt(propertyID),
      },
      update: {
        active: active === true,
        provider: provider || null,
        hijiffyToken: hijiffyToken || null,
        hijiffyCampaign: hijiffyCampaign || null,
      },
      create: {
        propertyID: parseInt(propertyID),
        active: active === true,
        provider: provider || null,
        hijiffyToken: hijiffyToken || null,
        hijiffyCampaign: hijiffyCampaign || null,
      },
    });

    return new NextResponse(JSON.stringify({ response: chatbot }), { status: 200 });
  } catch (error) {
    console.error("Error saving chatbot data:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
