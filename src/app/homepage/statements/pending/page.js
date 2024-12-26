"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "../styles.css";
import LoadingBackdrop from "@/components/Loader/page";
import en from "../../../../../public/locales/english/common.json";

const translations = { en };

const PendentesPage = () => {
  const locale = "en";
  const t = translations[locale];
  const [getJsons, setGetJsons] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Novo estado para controlar carregamento inicial
  console.log(isFirstLoad);
  const [propertyIDs, setPropertyIDs] = useState([]);

  // Redirecionar para login caso não haja sessão ativa
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth");
    } else {
      setPropertyIDs(session.user.propertyIDs || []); // Define múltiplos propertyIDs
    }
  }, [session, status, router]);

  // Fetch data from the API
  const getDataJsons = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true); // Exibe carregamento apenas na primeira carga
    try {
      const response = await axios.get("/api/get_jsons");
      const filteredData = response.data.response
        .filter(item => {
          try {
            const parsedItem = JSON.parse(item.requestBody);
            return Array.isArray(parsedItem) && parsedItem[0]?.HotelInfo;
          } catch (error) {
            console.log(error);
            return false;
          }
        })
        .sort((a, b) => {
          const requestID_A = typeof a.requestID === "string" ? parseInt(a.requestID, 10) : a.requestID;
          const requestID_B = typeof b.requestID === "string" ? parseInt(b.requestID, 10) : b.requestID;
          return requestID_B - requestID_A;
        });
      setGetJsons(filteredData);
    } catch (error) {
      console.error("Error fetching data from API", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false); // Finaliza o carregamento inicial
        setIsFirstLoad(false); // Define que a primeira carga foi concluída
      }
    }
  };

  useEffect(() => {
    getDataJsons(true); // Primeira carga com carregamento visível
    const interval = setInterval(() => getDataJsons(false), 5000); // Atualizações automáticas sem exibir carregamento
    return () => clearInterval(interval);
  }, []);

  // Filtra os dados com base nos múltiplos propertyIDs
  const filteredJsons = getJsons.filter(
    (json) => propertyIDs.includes(json.propertyID) && !json.seen
  );

  // Remove duplicados com base nas informações da reserva
  const uniqueJsons = filteredJsons.filter((item, index, self) => {
    const parsedData = JSON.parse(item.requestBody);
    const hotelInfo = parsedData[0]?.HotelInfo?.[0];
    const reservation = parsedData[0]?.Reservation?.[0];
    const guestInfo = parsedData[0]?.GuestInfo?.[0];

    const description = hotelInfo?.Description;
    const roomNumber = reservation?.RoomNumber;
    const firstName = guestInfo?.FirstName;
    const lastName = guestInfo?.LastName;
    const dateCI = reservation?.DateCI;
    const dateCO = reservation?.DateCO;
    const reservationNumber = reservation?.ReservationNumber;

    return (
      index ===
      self.findIndex((json) => {
        const comparisonData = JSON.parse(json.requestBody);
        const comparisonHotelInfo = comparisonData[0]?.HotelInfo?.[0];
        const comparisonReservation = comparisonData[0]?.Reservation?.[0];
        const comparisonGuestInfo = comparisonData[0]?.GuestInfo?.[0];

        return (
          comparisonHotelInfo?.Description === description &&
          comparisonReservation?.RoomNumber === roomNumber &&
          comparisonGuestInfo?.FirstName === firstName &&
          comparisonGuestInfo?.LastName === lastName &&
          comparisonReservation?.DateCI === dateCI &&
          comparisonReservation?.DateCO === dateCO &&
          comparisonReservation?.ReservationNumber === reservationNumber
        );
      })
    );
  });

  // Armazena o número de JSONs únicos no localStorage
  useEffect(() => {
    localStorage.setItem("pendingCount", uniqueJsons.length.toString());
  }, [uniqueJsons]);

  const handleCardClick = (json) => {
    const recordID = json.requestID;
    const propertyID = json.propertyID;
  
    // Redireciona para a página jsonView com os parâmetros na URL
    router.push(`/homepage/jsonView?recordID=${recordID}&propertyID=${propertyID}`);
  };

  if (status === "loading") {
    return <div>{t.errors.loading}...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-8 bg-background">
      <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.statements.pending.title}</h2>
      <LoadingBackdrop open={isLoading} />
      {!isLoading && (
        <div className="grid-container">
          {uniqueJsons.length > 0 ? (
            uniqueJsons.map((json, index) => {
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
              const hotelName = hotelInfo?.Description || t('statements.pending.defaultHotelName');

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
                        <p className="text-sm font-bold">{t.statements.pending.reservationNumber}</p>
                        <span>{reservation.ReservationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-bold">{t.statements.pending.checkIn}</p>
                        <span>{reservation.DateCI}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-bold">{t.statements.pending.checkOut}</p>
                        <span>{reservation.DateCO}</span>
                      </div>
                    </div>
                    <div className="flex justify-center mt-5 pr-4 pb-4">
                      <button
                        className="w-full pt-1 pb-1 text-sm rounded-lg border-2 flex items-center justify-center gap-2 border-primary-50 bg-primary-100 hover:bg-primary hover:text-white transition-colors"
                        onClick={() => handleCardClick(json)}
                      >
                        {t.statements.pending.viewStatement}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">{t.statements.pending.noStatement}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PendentesPage;
