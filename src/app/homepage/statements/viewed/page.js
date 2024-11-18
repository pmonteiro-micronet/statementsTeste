"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const VistosPage = () => {
  const [getJsons, setGetJsons] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [propertyIDs, setPropertyIDs] = useState([]); // Suporte a múltiplos propertyIDs

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth");
    } else {
      setPropertyIDs(session.user.propertyIDs || []); // Pega os propertyIDs da sessão
    }
  }, [session, status, router]);

  const getDataJsons = async () => {
    try {
      const response = await axios.get("/api/get_jsons");
      setGetJsons(response.data.response);
    } catch (error) {
      console.error("Erro ao buscar os dados da API", error);
    }
  };

  useEffect(() => {
    if (propertyIDs.length > 0) {
      getDataJsons();
      const interval = setInterval(getDataJsons, 5000);
      return () => clearInterval(interval);
    }
  }, [propertyIDs]);

  const filteredJsons = getJsons.filter(
    (json) => propertyIDs.includes(json.propertyID) && json.seen // Filtrar pelos propertyIDs e vistos
  );

  const handleCardClick = (json) => {
    localStorage.setItem("recordID", json.requestID);
    router.push("/homepage/jsonView");
  };

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  return (
    <main className="flex flex-col flex-grow h-full overflow-hidden p-4 m-0 bg-background">
      <h2 className="font-semibold text-2xl mb-4">Vistos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredJsons.length > 0 ? (
          filteredJsons.map((json, index) => {
            let parsedData;
            try {
              parsedData = JSON.parse(json.requestBody);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              return null;
            }

            const hotelInfo = parsedData[0]?.HotelInfo?.[0];
            const reservation = parsedData[0]?.Reservation?.[0];
            const guestInfo = parsedData[0]?.GuestInfo?.[0];
            const hotelName = hotelInfo?.Description || "Nome do Hotel";

            if (!reservation || !guestInfo) {
              return null;
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
          <p className="text-gray-500">Nenhuma reserva vista.</p>
        )}
      </div>
    </main>
  );
};

export default VistosPage;
