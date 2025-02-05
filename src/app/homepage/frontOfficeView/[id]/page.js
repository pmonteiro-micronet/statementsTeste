"use client"
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
  const t = translations[locale] || translations["pt"];
  const router = useRouter();
  const selectedHotelID = pathname.split('/').pop();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }

    // Função para buscar os contadores
    const fetchCountersPeriodically = async () => {
      if (session?.user?.propertyIDs && selectedHotelID) {
        await fetchCounters();
      }
    };

    // Chama fetchCounters imediatamente ao carregar e depois a cada 30 segundos (30000ms)
    fetchCountersPeriodically();
    const intervalId = setInterval(fetchCountersPeriodically, 30000); // 30 segundos

    // Limpeza do intervalo quando o componente for desmontado ou quando mudar a página
    return () => clearInterval(intervalId);

  }, [session?.user?.propertyIDs, selectedHotelID]);

  const fetchCounters = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleRedirect = async (type) => {
    if (isLoading) return;

    // Redireciona para a página correta, sem fazer as requisições
    router.push(`/homepage/frontOfficeView/${type}/${selectedHotelID}`);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Função para enviar os dados para a API
  const sendDataToAPI = async () => {
    try {
      setIsLoading(true); // Inicia o carregamento

      const propertyResponse = await axios.get(`/api/properties/${selectedHotelID}`);

      if (propertyResponse.data && propertyResponse.data.response && propertyResponse.data.response.length > 0) {
        const mpehotel = propertyResponse.data.response[0].mpehotel;
        console.log('Mpehotel encontrado:', mpehotel);

        // Faz as requisições com delay e passando propertyID corretamente
        await axios.get("/api/reservations/checkins/reservations_4_tat", {
          params: { mpehotel, propertyID: selectedHotelID }, // Alterado aqui
        });

        await sleep(1000);

        await axios.get("/api/reservations/inHouses/reservations_4_tat", {
          params: { mpehotel, propertyID: selectedHotelID }, // Alterado aqui
        });

        await sleep(1000);

        await axios.get("/api/reservations/info", {
          params: { mpehotel, propertyID: selectedHotelID }, // Alterado aqui
        });

        await sleep(1000);
        setPostSuccessful(true);

      } else {
        console.error('Mpehotel não encontrado para o selectedHotelID:', selectedHotelID);
        setPostSuccessful(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Erro 500: Não conseguimos comunicar com o serviço PMS.");
        setErrorMessage("We were unable to communicate with the PMS service. Please contact support.");
      } else {
        console.log("Erro inesperado:", error.response ? error.response.data : error.message);
        setErrorMessage("We were unable to fulfill your order. Please contact support.");
      }
      setIsErrorModalOpen(true);
      setPostSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Chama a função sendDataToAPI ao carregar a página
  useEffect(() => {
    sendDataToAPI();
  }, [selectedHotelID]);

  return (
    <div className="min-h-screen flex bg-primaryBackground">
      {isLoading && <LoadingBackdrop open={isLoading} />} {/* Indicador de carregamento */}
      <main className="flex-1 min-h-screen p-8 overflow-y-auto">
        <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.frontOffice.dashboard.title}</h2>

        <div className="flex flex-row gap-5">
          <div
            className={`border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => !isLoading && handleRedirect("arrivals")}
          >
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">
                {arrivals !== null ? arrivals : `${t.errors.loading}...`}
              </h3>
              <p className="text-gray-400 mt-1 uppercase">{t.frontOffice.dashboard.cardArrivals}</p>
            </div>
          </div>
          <div
            className={`border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => !isLoading && handleRedirect("inhouses")}
          >
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">
                {inhouses !== null ? inhouses : `${t.errors.loading}...`}
              </h3>
              <p className="text-gray-400 mt-1 uppercase">{t.frontOffice.dashboard.cardInHouses}</p>
            </div>
          </div>
          <div
            className={`border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => !isLoading && handleRedirect("departures")}
          >
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">
                {departures !== null ? departures : `${t.errors.loading}...`}
              </h3>
              <p className="text-gray-400 mt-1 uppercase">{t.frontOffice.dashboard.cardDepartures}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FrontOffice;
