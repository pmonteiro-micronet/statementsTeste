"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "./styles.css";

const PendentesPage = () => {
  const [getJsons, setGetJsons] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [propertyID, setPropertyID] = useState("");

  // Redirect to login if no active session
  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user.propertyID) {
      router.push("/auth");
    } else {
      setPropertyID(session.user.propertyID);
    }
  }, [session, status, router]);

  // Fetch data from the API
  const getDataJsons = async () => {
    try {
      const response = await axios.get("/api/get_jsons");
      const filteredData = response.data.response
        .filter(item => {
          try {
            const parsedItem = JSON.parse(item.requestBody);
            return Array.isArray(parsedItem) && parsedItem[0]?.HotelInfo;
          } catch (error) {
            console.log(error);
            return false; // Skip if parsing fails
          }
        })
        .sort((a, b) => {
          // Convert requestID to number if it's a string
          const requestID_A = typeof a.requestID === 'string' ? parseInt(a.requestID, 10) : a.requestID;
          const requestID_B = typeof b.requestID === 'string' ? parseInt(b.requestID, 10) : b.requestID;

          // Sort in descending order
          return requestID_B - requestID_A; // Higher requestID first
        });
      setGetJsons(filteredData);
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  // Fetch data periodically
  useEffect(() => {
    getDataJsons();
    const interval = setInterval(getDataJsons, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter pending JSONs based on propertyID and unseen status
  const filteredJsons = getJsons.filter(
    (json) => json.propertyID === propertyID && !json.seen
  );

  // Handle card click to view details
  const handleCardClick = (json) => {
    localStorage.setItem("recordID", json.requestID);
    router.push("/homepage/jsonView");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-8 bg-background">
      <h2 className="font-semibold text-2xl mb-4">Pendentes</h2>
      <div className="grid-container">
        {filteredJsons.length > 0 ? (
          // Exibir itens na ordem mais recente para mais antigo
          filteredJsons.map((json, index) => {
            let parsedData;
            try {
              parsedData = JSON.parse(json.requestBody);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              return null; // Skip this item if parsing fails
            }

            const hotelInfo = parsedData[0]?.HotelInfo?.[0];
            const reservation = parsedData[0]?.Reservation?.[0];
            const guestInfo = parsedData[0]?.GuestInfo?.[0];
            const hotelName = hotelInfo?.Description || "Nome do Hotel";

            if (!reservation || !guestInfo) {
              return null; // Skip if reservation or guest info is missing
            }

            return (
              <div key={index} className="card" onClick={() => handleCardClick(json)}>
                <div className="flex flex-row">
                  <div className="absolute top-0 left-0 p-2 rounded-lg mt-2 ml-2">
                    <p className="text-sm font-bold text-gray-700">{hotelName}</p>
                  </div>
                  <div className="absolute top-0 right-0 mr-1 mt-1">
                    <p className="flex flex-col">
                      <span className="text-5xl font-semibold text-center text-white bg-primary rounded-lg">
                        <span className="text-4xl">#</span>
                        {reservation.RoomNumber}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col absolute top-12 left-4">
                  <p className="text-sm text-gray-500">
                    <span className="text-lg text-gray-900 font-semibold">
                      {guestInfo.Salution || ""} {guestInfo.LastName || ""}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-200 h-[1%] w-full -mt-[20%]"></div>
                <div className="absolute left-4 mt-20 w-full pr-4">
                  <div className="flex flex-col space-y-2 pr-4">
                    <div className="flex justify-between mt-10">
                      <p className="text-sm font-bold">Reservation Number</p>
                      <span>{reservation.ReservationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-bold">Check-In</p>
                      <span>{reservation.DateCI}</span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-bold">Check-Out</p>
                      <span>{reservation.DateCO}</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5 pr-4 pb-4">
                    <button
                      className="w-full pt-1 pb-1 text-sm rounded-lg border-2 flex items-center justify-center gap-2 border-primary-50 bg-primary-100 hover:bg-primary hover:text-white transition-colors"
                      onClick={() => handleCardClick(json)}
                    >
                      View Statement
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Nenhuma reserva pendente.</p>
        )}
      </div>
    </div>
  );
};

export default PendentesPage;
