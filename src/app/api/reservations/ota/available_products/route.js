import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";
import { Buffer } from "buffer";
import { parseStringPromise } from "xml2js";

export async function POST(request) {
  try {
    const { propertyID, checkin, checkout, adults } = await request.json();

    if (!propertyID || !checkin || !checkout || !adults) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Calculate nights
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const nights = Math.max(1, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24)));

    // Get RoomCloud credentials
    const creds = await prisma.roomCloud.findUnique({
      where: { propertyID: parseInt(propertyID, 10) },
      select: { username: true, password: true, hotelID: true }
    });
    if (!creds) {
      return NextResponse.json({ error: "No RoomCloud credentials found." }, { status: 404 });
    }

    // Build XML body
    const xml = `<getAvailableProducts hotelId="${creds.hotelID}" checkin="${checkin}" nights="${nights}" adults="${adults}"/>`;

    // Prepare Basic Auth
    const auth = Buffer.from(`${creds.username}:${creds.password}`).toString("base64");

    // Send POST request to RoomCloud
    const url = `https://apitest.roomcloud.net/hotw/download/Cloudtools.jsp?hotelId=${creds.hotelID}`;
    const response = await axios.post(url, xml, {
      headers: {
        "Content-Type": "application/xml",
        "Authorization": `Basic ${auth}`
      }
    });

    // Parse XML response
    const parsed = await parseStringPromise(response.data, { explicitArray: false, trim: true, mergeAttrs: true, explicitCharkey: true, charkey: "value" });

    // Extract products
    const products = [];
    const hotel = parsed?.Response?.hotel;
    const productList = hotel?.products?.product;
    if (productList) {
      const arr = Array.isArray(productList) ? productList : [productList];
      for (const p of arr) {
        const getRoomType = (p) => {
          if (typeof p.roomType === "string" && p.roomType) return p.roomType;
          if (typeof p.roomType === "object" && p.roomType !== null && "value" in p.roomType && p.roomType.value) return p.roomType.value;
          return p.roomName?.value || "Unknown";
        };

        products.push({
          roomId: p.roomId,
          rateId: p.rateId,
          roomName: p.roomName?.value || "",
          rateDescription: p.rateDescription?.value || "",
          boardType: p.boardType,
          refundable: p.refundable,
          cancellationPolicy: p.cancellationPolicy?.value || "",
          currency: p.currency,
          baseRate: p.baseRate?.amountAfterTax || "",
          roomType: getRoomType(p),
          baseDailyAmounts: p.baseDailyAmounts, // <-- ADD THIS LINE
        });
      }
    }

    // Extract rooms
    const roomsArr = [];
    const rooms = parsed?.Response?.hotel?.rooms?.room;
    if (rooms) {
      const arr = Array.isArray(rooms) ? rooms : [rooms];
      for (const r of arr) {
        roomsArr.push({
          roomId: r.roomId,
          count: r.count,
        });
      }
    }

    return NextResponse.json({ products, rooms: roomsArr, xml: response.data });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}