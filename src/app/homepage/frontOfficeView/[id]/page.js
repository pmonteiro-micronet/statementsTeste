'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import "./styles.css";
import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";
import LoadingBackdrop from "@/components/Loader/page";

const translations = { en, pt, es };

const FrontOffice = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [locale, setLocale] = useState("pt");
  const [arrivals, setArrivals] = useState(null);
  const [inhouses, setInhouses] = useState(null);
  const [departures, setDepartures] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  const t = translations[locale] || translations["pt"];
  const router = useRouter();
  const selectedHotelID = pathname.split('/').pop();

  useEffect(() => {
    if (session?.user?.propertyIDs && selectedHotelID) {
      fetchCounters();
    }
  }, [session?.user?.propertyIDs, selectedHotelID]);

  const fetchCounters = async () => {
    try {
      setIsLoading(true); // Ativa o carregamento durante a busca de contadores
      const response = await fetch("/api/counter");
      const data = await response.json();

      if (response.ok) {
        const arrivalsData = data.response.filter(
          (item) => item.counterName === "arrivals" && String(item.propertyID) === String(selectedHotelID)
        );
        const inhousesData = data.response.filter(
          (item) => item.counterName === "inhouses" && String(item.propertyID) === String(selectedHotelID)
        );
        const departuresData = data.response.filter(
          (item) => item.counterName === "departures" && String(item.propertyID) === String(selectedHotelID)
        );

        setArrivals(arrivalsData.length > 0 ? arrivalsData[0].count : 0);
        setInhouses(inhousesData.length > 0 ? inhousesData[0].count : 0);
        setDepartures(departuresData.length > 0 ? departuresData[0].count : 0);
      } else {
        console.error("Erro ao buscar dados:", data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    } finally {
      setIsLoading(false); // Desativa o carregamento
    }
  };

  const handleRedirect = async (type) => {
    if (selectedHotelID) {
      setIsLoading(true); // Ativa o carregamento durante o redirecionamento
      try {
        const propertyResponse = await axios.get(`/api/properties/${selectedHotelID}`);
        const mpehotel = propertyResponse.data.response?.[0]?.mpehotel;

        if (mpehotel) {
          await Promise.all([
            sendDataToAPI("arrivals", mpehotel),
            sendDataToAPI("inhouses", mpehotel),
            sendDataToAPI("departures", mpehotel),
          ]);

          router.push(`/homepage/frontOfficeView/${type}/${selectedHotelID}`);
        } else {
          console.error("Mpehotel not found for the selected hotel.");
        }
      } catch (error) {
        console.error("Erro durante as requisições", error);
      } finally {
        setIsLoading(false); // Desativa o carregamento após o redirecionamento
      }
    }
  };

  const sendDataToAPI = async (type, mpehotel) => {
    try {
      const propertyID = selectedHotelID;

      if (mpehotel && propertyID) {
        if (type === "arrivals") {
          await axios.get("/api/reservations/checkins/reservations_4_tat", {
            params: { mpehotel, propertyID },
          });
        } else if (type === "inhouses") {
          await axios.get("/api/reservations/inHouses/reservations_4_tat", {
            params: { mpehotel, propertyID },
          });
        } else if (type === "departures") {
          await axios.get("/api/reservations/info", {
            params: { mpehotel, propertyID },
          });
        }
      }
    } catch (error) {
      console.error(`Erro ao enviar os dados para ${type}:`, error);
    }
  };

  return (
    <>
      {isLoading && <LoadingBackdrop open={isLoading} />}
      <div className="min-h-screen flex bg-primaryBackground">
        <main className="flex-1 min-h-screen p-8 overflow-y-auto">
          <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">
            {t.frontOffice.dashboard.title}
          </h2>

          <div className="flex flex-row gap-5">
            <div
              className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
              onClick={() => handleRedirect("arrivals")}
            >
              <div className="flex flex-col">
                <h3 className="text-5xl text-primary">
                  {arrivals !== null ? arrivals : `${t.errors.loading}...`}
                </h3>
                <p className="text-gray-400 mt-1 uppercase">
                  {t.frontOffice.dashboard.cardArrivals}
                </p>
              </div>
            </div>
            <div
              className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
              onClick={() => handleRedirect("inhouses")}
            >
              <div className="flex flex-col">
                <h3 className="text-5xl text-primary">
                  {inhouses !== null ? inhouses : `${t.errors.loading}...`}
                </h3>
                <p className="text-gray-400 mt-1 uppercase">
                  {t.frontOffice.dashboard.cardInHouses}
                </p>
              </div>
            </div>
            <div
              className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
              onClick={() => handleRedirect("departures")}
            >
              <div className="flex flex-col">
                <h3 className="text-5xl text-primary">
                  {departures !== null ? departures : `${t.errors.loading}...`}
                </h3>
                <p className="text-gray-400 mt-1 uppercase">
                  {t.frontOffice.dashboard.cardDepartures}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FrontOffice;
