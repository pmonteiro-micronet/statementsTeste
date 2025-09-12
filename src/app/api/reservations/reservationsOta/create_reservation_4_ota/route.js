import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";
import { Buffer } from "buffer";

export async function POST(request) {
  try {
    const body = await request.json();

    // All fields required
    const requiredFields = [
      "propertyID", "id", "creation_date", "checkin", "checkout", "firstName", "lastName",
      "email", "telephone", "address", "city", "zipCode", "country", "rooms", "adults",
      "price", "status", "currency", "lang",
      // Room fields
      "room_id", "rateId", "room_quantity", "room_price", "room_adults", "room_status",
      "room_checkin", "room_checkout", "room_currency",
      // Day prices (array of {day, roomId, rateId, price})
      "dayPrices"
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return new NextResponse(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
      }
    }

    // Get credentials from roomCloud table
    const creds = await prisma.roomCloud.findUnique({
      where: { propertyID: parseInt(body.propertyID, 10) },
      select: { username: true, password: true, hotelID: true }
    });

    if (!creds) {
      return new NextResponse(
        JSON.stringify({ error: "No RoomCloud credentials found for this propertyID" }),
        { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Log request before sending to RoomCloud
    const logRecord = await prisma.roomCloudLogs.create({
      data: {
        hotelID: parseInt(body.propertyID, 10),
        requestBody: JSON.stringify(body),
        responseStatus: "PENDING",
        responseBody: "",
      }
    });

    // Build XML body, using logRecord.requestID as reservation id
    const xml = `
<Request>
  <reservation id="${logRecord.requestID}" creation_date="${body.creation_date}"
               checkin="${body.checkin}" checkout="${body.checkout}"
               firstName="${body.firstName}" lastName="${body.lastName}"
               email="${body.email}" telephone="${body.telephone}"
               address="${body.address}" city="${body.city}" zipCode="${body.zipCode}" country="${body.country}"
               rooms="${body.rooms}" adults="${body.adults}" price="${body.price}" status="${body.status}"
               currency="${body.currency}" lang="${body.lang}">
    <room id="${body.room_id}" rateId="${body.rateId}" quantity="${body.room_quantity}" price="${body.room_price}"
          adults="${body.room_adults}" status="${body.room_status}" checkin="${body.room_checkin}" checkout="${body.room_checkout}" currency="${body.room_currency}">
      ${Array.isArray(body.dayPrices) ? body.dayPrices.map(dp => (
        `<dayPrice day="${dp.day}" roomId="${dp.roomId}" rateId="${dp.rateId}" price="${dp.price}"/>`
      )).join("\n      ") : ""}
      <guest roomId="${body.room_id}" firstName="${body.firstName}" lastName="${body.lastName}"
             email="${body.email}" phone="${body.telephone}" address="${body.address}"
             zipCode="${body.zipCode}" city="${body.city}" country="${body.country}"/>
    </room>
  </reservation>
</Request>`.trim();

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

    // Update log with response
    await prisma.roomCloudLogs.update({
      where: { requestID: logRecord.requestID },
      data: {
        responseStatus: response.status.toString(),
        responseBody: typeof response.data === "string" ? response.data : JSON.stringify(response.data),
      }
    });

    return new NextResponse(
      response.data,
      { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Reservation creation error:", error?.response?.data || error.message);

    // Attempt to log error
    try {
      const body = await request.json().catch(() => ({}));
      await prisma.roomCloudLogs.create({
        data: {
          hotelID: parseInt(body.propertyID, 10) || 0,
          requestBody: JSON.stringify(body),
          responseStatus: "ERROR",
          responseBody: error?.response?.data ? JSON.stringify(error.response.data) : error.message,
        }
      });
    } catch (logErr) {
      console.error("Failed to log to roomCloudLogs:", logErr.message);
    }

    return new NextResponse(
      JSON.stringify({ error: error?.response?.data || error.message }),
      { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }
}