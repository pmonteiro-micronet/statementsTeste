import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";
import { Buffer } from "buffer";
import { parseStringPromise } from "xml2js";

export async function POST(request) {
  try {
    const { propertyID } = await request.json();

    if (!propertyID) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const creds = await prisma.roomCloud.findUnique({
      where: { propertyID: parseInt(propertyID, 10) },
      select: { username: true, password: true, hotelID: true }
    });

    if (!creds) {
      return NextResponse.json({ error: "No RoomCloud credentials found." }, { status: 404 });
    }

    const xml = `<getRooms hotelId="${creds.hotelID}"/>`;

    const auth = Buffer.from(`${creds.username}:${creds.password}`).toString("base64");

    const url = `https://xml.tecnes.com/hotw/download/Cloudtools.jsp?hotelId=${creds.hotelID}`;

    const response = await axios.post(url, xml, {
      headers: {
        "Content-Type": "application/xml",
        "Authorization": `Basic ${auth}`
      }
    });

    const parsed = await parseStringPromise(response.data, {
      explicitArray: false,
      ignoreAttrs: false
    });

    return NextResponse.json(parsed);

  } catch (error) {
    console.error("RoomCloud error:", error?.response?.data || error.message);

    return NextResponse.json(
      { error: "Failed to fetch rooms." },
      { status: 500 }
    );
  }
}