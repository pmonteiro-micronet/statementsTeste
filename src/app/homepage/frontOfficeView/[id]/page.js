'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import "./styles.css";
import en from "../../../../../public/locales/english/common.json";

const translations = { en };

const FrontOffice = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const locale = "en";
  const t = translations[locale];

  const router = useRouter(); // Instancia o hook useRouter

  // Pegando o selectedHotelID da URL
  const selectedHotelID = pathname.split('/').pop(); // Extrai o último valor da URL, que deve ser o hotelID

  // Estados para armazenar os valores de "arrivals", "inhouses" e "departures"
  const [arrivals, setArrivals] = useState(null);
  const [inhouses, setInhouses] = useState(null);
  const [departures, setDepartures] = useState(null);

  useEffect(() => {
    if (session?.user?.propertyIDs && selectedHotelID) {
      console.log("IDs", session?.user?.propertyIDs); // Verificando os propertyIDs da sessão

      // Função para buscar os dados dos contadores
      const fetchCounters = async () => {
        try {
          // Realizando a chamada para a API
          const response = await fetch("/api/counter");
          const data = await response.json();
          console.log("dados", data);

          if (response.ok) {
            // Filtra os dados pela ID do hotel e pega apenas os dados para o selectedHotelID
            const arrivalsData = data.response.filter(
              (item) =>
                item.counterName === "arrivals" &&
                String(item.propertyID) === String(selectedHotelID)
            );

            const inhousesData = data.response.filter(
              (item) =>
                item.counterName === "inhouses" &&
                String(item.propertyID) === String(selectedHotelID)
            );

            const departuresData = data.response.filter(
              (item) =>
                item.counterName === "departures" &&
                String(item.propertyID) === String(selectedHotelID)
            );

            // Verifica se há algum dado para o selectedHotelID, caso contrário retorna 0
            setArrivals(arrivalsData.length > 0 ? arrivalsData[0].count : 0);
            setInhouses(inhousesData.length > 0 ? inhousesData[0].count : 0);
            setDepartures(departuresData.length > 0 ? departuresData[0].count : 0);
          } else {
            console.error("Erro ao buscar dados:", data.error);
          }
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
        }
      };

      fetchCounters();
    }
  }, [session?.user?.propertyIDs, selectedHotelID]); // Dependência para recarregar quando a sessão ou selectedHotelID mudar

  // Função para redirecionar, aceitando o tipo de contagem como parâmetro
  const handleRedirect = (type) => {
    if (selectedHotelID) {
      router.push(`/homepage/frontOfficeView/${type}/${selectedHotelID}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 min-h-screen p-8 overflow-y-auto">
        <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.frontOffice.dashboard.title}</h2>

        <div className="flex flex-row gap-5">
          <div
            className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
            onClick={() => handleRedirect("arrivals")}>
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">
                {arrivals !== null ? arrivals : `${t.errors.loading}...`}
              </h3>
              <p className="text-gray-400 mt-1 uppercase">{t.frontOffice.dashboard.cardArrivals}</p>
            </div>
          </div>
          <div
            className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
            onClick={() => handleRedirect("inhouses")}>
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">
                {inhouses !== null ? inhouses : `${t.errors.loading}...`}
              </h3>
              <p className="text-gray-400 mt-1 uppercase">{t.frontOffice.dashboard.cardInHouses}</p>
            </div>
          </div>
          <div
            className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
            onClick={() => handleRedirect("departures")}>
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
