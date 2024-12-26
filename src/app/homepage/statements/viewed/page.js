"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "../styles.css";
import LoadingBackdrop from "@/components/Loader/page"; // Certifique-se de ter o componente de carregamento
import en from "../../../../../public/locales/english/common.json";

const translations = { en };

const VistosPage = () => {
  const locale = "en";
  const t = translations[locale];
  const [getJsons, setGetJsons] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [propertyIDs, setPropertyIDs] = useState([]); // Suporte a múltiplos propertyIDs
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Controle de carregamento inicial
  console.log(isFirstLoad);
  
  // Redirect to login if no active session

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth");
    } else {
      setPropertyIDs(session.user.propertyIDs || []); // Pega os propertyIDs da sessão
    }
  }, [session, status, router]);

  // Fetch data from the API
  const getDataJsons = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true); // Exibe carregamento apenas na primeira carga
    try {
      const response = await axios.get("/api/get_jsons");
      setGetJsons(response.data.response);
    } catch (error) {
      console.error("Error fetching data from API", error);
    } finally {
      if (isInitialLoad) {
        setIsLoading(false); // Finaliza carregamento inicial
        setIsFirstLoad(false); // Define que a primeira carga foi concluída
      }
    }
  };

  useEffect(() => {
    if (propertyIDs.length > 0) {
      getDataJsons();
      const interval = setInterval(getDataJsons, 5000);
      return () => clearInterval(interval);
    }
  }, [propertyIDs]);

  const uniqueJsons = getJsons.filter(
    (json) => propertyIDs.includes(json.propertyID) && json.seen // Filtrar pelos propertyIDs e vistos
  );

  const handleCardClick = (json) => {
    const recordID = json.requestID;
    const propertyID = json.propertyID;
  
    // Redireciona para a página jsonView com os parâmetros na URL
    router.push(`/homepage/jsonView?recordID=${recordID}&propertyID=${propertyID}`);
  };

  if (status === "loading") {
    return <p>{t.errors.loading}...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col p-8 bg-background">
      <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.statements.view.title}</h2>
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
              const hotelName = hotelInfo?.Description || t('statements.view.defaultHotelName');


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
                        <p className="text-sm font-bold">{t.statements.view.reservationNumber}</p>
                        <span>{reservation.ReservationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-bold">{t.statements.view.checkIn}</p>
                        <span>{reservation.DateCI}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-bold">{t.statements.view.checkOut}</p>
                        <span>{reservation.DateCO}</span>
                      </div>
                    </div>
                    <div className="flex justify-center mt-5 pr-4 pb-4">
                      <button
                        className="w-full pt-1 pb-1 text-sm rounded-lg border-2 flex items-center justify-center gap-2 border-primary-50 bg-primary-100 hover:bg-primary hover:text-white transition-colors"
                        onClick={() => handleCardClick(json)}
                      >
                        {t.statements.view.checkedStatement}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">{t.statements.view.noStatement}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VistosPage;
