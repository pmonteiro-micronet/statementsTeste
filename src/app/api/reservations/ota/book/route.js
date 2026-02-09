import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import axios from "axios";
import { Buffer } from "buffer";

export async function POST(request) {
  try {
    const { propertyID, bookingData } = await request.json();

    if (!propertyID || !bookingData) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { booking, items, dates, total } = bookingData;

    // Get RoomCloud credentials
    const creds = await prisma.roomCloud.findUnique({
      where: { propertyID: parseInt(propertyID, 10) },
      select: { username: true, password: true, hotelID: true }
    });
    if (!creds) {
      return NextResponse.json({ error: "No RoomCloud credentials found." }, { status: 404 });
    }

    // Generate unique reservation ID
    const reservationId = `RES-${Date.now()}`;

    // Format creation date
    const now = new Date();
    const creation_date = now.toISOString().replace('T', ' ').split('.')[0];

    // Map payment type to RoomCloud code
    const paymentTypeMap = {
      "Transfer": "1",
      "Postal Order": "2",
      "Credit Card": "3",
      "Voucher": "4",
      "Cash": "5"
    };
    const paymentTypeCode = paymentTypeMap[booking.paymentType] || "3";

    // Map country name to ISO code (simplified - for production use a proper mapping)
    const countryNameToCode = {
      "Italy": "IT",
      "United States": "US",
      "Germany": "DE",
      "France": "FR",
      "Spain": "ES",
      "Portugal": "PT",
      "United Kingdom": "GB",
      "Ireland": "IE",
      "Belgium": "BE",
      "Netherlands": "NL",
      // Add more mappings as needed - for now fallback to first 2 letters uppercase
    };
    const countryCode = countryNameToCode[booking.country] || booking.country.substring(0, 2).toUpperCase();

    // Generate dlm (last modification date)
    const dlm = now.toISOString().replace('T', ' ').split('.')[0];

    // Calculate price per night (total price / nights / number of rooms)
    const pricePerNight = items.length > 0 ? (total / dates.nights / items.length) : 0;

    // Helper function to generate day prices for a single room
    const generateDayPrices = (item) => {
      const dayPrices = [];
      const checkinDate = new Date(dates.checkin);
      
      for (let i = 0; i < dates.nights; i++) {
        const currentDate = new Date(checkinDate);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Use day price from baseDailyAmounts if available, otherwise calculate average
        let dayPrice = pricePerNight;
        if (item.baseDailyAmounts) {
          const dayAmount = Array.isArray(item.baseDailyAmounts.amount) 
            ? item.baseDailyAmounts.amount[i]
            : item.baseDailyAmounts.amount;
          dayPrice = dayAmount ? parseFloat(dayAmount.value || dayAmount) : pricePerNight;
        }
        
        dayPrices.push(`    <dayPrice day="${dateStr}" roomId="${item.roomId}" rateId="${item.rateId}" price="${dayPrice.toFixed(2)}"/>`);
      }
      return dayPrices.join('\n');
    };

    // Build room elements
    const roomsXml = items.map(item => {
      const dayPrices = generateDayPrices(item);
      return `  <room
    id="${item.roomId}"
    description="${item.roomName || ''}"
    rateId="${item.rateId}"
    quantity="${item.quantity}"
    price="${item.price.toFixed(2)}"
    adults="${dates.adults}"
    status="2"
    checkin="${dates.checkin}"
    checkout="${dates.checkout}"
    currency="EUR"
    commission="0.0">
${dayPrices}
  </room>`;
    }).join('\n');

    // Build XML body
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Request>
  <reservation
    id="${reservationId}"
    creation_date="${creation_date}"
    checkin="${dates.checkin}"
    checkout="${dates.checkout}"
    firstName="${booking.firstName}"
    lastName="${booking.lastName}"
    email="${booking.email}"
    telephone="${booking.phone}"
    address="${booking.address}"
    zipCode="${booking.postalCode}"
    city="${booking.city}"
    country="${countryCode}"
    rooms="${items.length}"
    price="${total.toFixed(2)}"
    status="4"
    paymentType="${paymentTypeCode}"
    lang="EN"
    adults="${dates.adults}"
    dlm="${dlm}"
    currency="EUR">

${roomsXml}
  <guest
    firstName="${booking.firstName}"
    lastName="${booking.lastName}"
    email="${booking.email}"
    telephone="${booking.phone}"
    address="${booking.address}"
    zipCode="${booking.postalCode}"
    city="${booking.city}"
    country="${countryCode}"/>
      
  </reservation>
</Request>`;

    // Prepare Basic Auth
    const auth = Buffer.from(`${creds.username}:${creds.password}`).toString("base64");

    // Send POST request to RoomCloud
    const url = `https://xml.tecnes.com/hotw/download/Cloudtools.jsp?hotelId=${creds.hotelID}`;
    const response = await axios.post(url, xml, {
      headers: {
        "Content-Type": "application/xml",
        "Authorization": `Basic ${auth}`
      }
    });
    console.log(xml);

    return NextResponse.json({
      success: true,
      reservationId: reservationId,
      response: response.data,
      xml: xml
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}
