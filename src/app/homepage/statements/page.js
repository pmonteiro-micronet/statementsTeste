'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "./statements.css";
import en from "../../../../public/locales/english/common.json";
import pt from "../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const Homepage = () => {
  const [locale, setLocale] = useState("pt");

  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"

  const { data: session } = useSession();

  // Estado para armazenar os valores de "pendings" e "viewed"
  const [pendings, setPendings] = useState(0);
  const [viewed, setViewed] = useState(0);

  const router = useRouter(); // Instancia o hook useRouter

  useEffect(() => {
    if (session?.user?.propertyIDs) {
      console.log("ids", session?.user?.propertyIDs); // Verificando os propertyIDs da sessão
      // Função para buscar os dados dos contadores
      const fetchCounters = async () => {
        try {
          // Realizando a chamada para a API
          const response = await fetch("/api/counter");
          const data = await response.json();
          console.log("dados", data);

          if (response.ok) {
            // Somando os valores de pendings
            const pendingsSum = data.response
              .filter(
                (item) =>
                  item.counterName === "pendings" &&
                  session.user.propertyIDs.includes(item.propertyID)
              )
              .reduce((sum, item) => sum + (item.count || 0), 0);  // Usando o campo "count" em vez de "value"

            // Somando os valores de viewed
            const viewedSum = data.response
              .filter(
                (item) =>
                  item.counterName === "viewed" &&
                  session.user.propertyIDs.includes(item.propertyID)
              )
              .reduce((sum, item) => sum + (item.count || 0), 0);  // Usando o campo "count" em vez de "value"

            // Atualizando o estado com os valores somados
            setPendings(pendingsSum);
            setViewed(viewedSum);
          } else {
            console.error("Erro ao buscar dados:", data.error);
          }
        } catch (error) {
          console.error("Erro ao buscar dados da API:", error);
        }
      };

      fetchCounters();
    }
  }, [session?.user?.propertyIDs]); // Dependência para recarregar quando a sessão mudar

  // Função para redirecionar
  const handleRedirect = (type) => {
    router.push(`/homepage/statements/${type}`); // Redireciona dinamicamente com base no tipo
  };

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 min-h-screen p-8 overflow-y-auto">
        <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.statements.dashboard.title}</h2>

        <div className="flex flex-row gap-5">
          <div
            className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
            onClick={() => handleRedirect("pending")}
          >
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">{pendings !== null ? pendings : "Loading..."}</h3>
              <p className="text-gray-400 mt-1 uppercase">{t.statements.dashboard.cardPending}</p>
            </div>
          </div>
          <div
            className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2 cursor-pointer"
            onClick={() => handleRedirect("viewed")}>
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">{viewed !== null ? viewed : "Loading..."}</h3>
              <p className="text-gray-400 mt-1 uppercase">{t.statements.dashboard.cardViewed}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
