'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import "./statements.css";

const Homepage = () => {
  const { data: session } = useSession();
  
  // Estado para armazenar os valores de "pendings" e "viewed"
  const [pendings, setPendings] = useState(0);
  const [viewed, setViewed] = useState(0);

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

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 min-h-screen p-8 overflow-y-auto">
        <h2 className="font-semibold text-2xl mb-4">Statements</h2>

        <div className="flex flex-row gap-5">
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">{pendings !== null ? pendings : "Loading..."}</h3>
              <p className="text-gray-400 mt-1">PENDINGS</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">{viewed !== null ? viewed : "Loading..."}</h3>
              <p className="text-gray-400 mt-1">VIEWED</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;