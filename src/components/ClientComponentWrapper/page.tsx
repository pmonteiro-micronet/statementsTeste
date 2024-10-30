"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar, {
  SidebarItem,
  SubMenuItem,
} from "@/components/Sidebar/Layout/Sidebar";
import { IoIosStats } from "react-icons/io";
import { useSession } from "next-auth/react";
import axios from "axios";

// Interface para garantir que os dados da API estejam corretos
interface Hotel {
  propertyID: string;
  propertyName: string;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");
  const [expanded, setExpanded] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // Obter propertyID do usuário logado
  const propertyID = session?.user?.propertyID || null;

   // Chamada para buscar hotéis
   useEffect(() => {
    const fetchHotels = async () => {
      if (propertyID) {
        console.log("Buscando hotéis com axios...");
        try {
          const response = await axios.get(`/api/properties?propertyID=${propertyID}`);
          console.log("Hotéis retornados:", response.data.response);

          // Corrigir acesso à resposta da API e atualizar o estado dos hotéis
          if (Array.isArray(response.data.response)) {
            setHotels(response.data.response as Hotel[]);
          } else {
            console.warn("A resposta da API não é um array.");
          }
        } catch (error) {
          console.error("Erro ao buscar os hotéis:", error.response ? error.response.data : error.message);
        }
      }
    };

    fetchHotels();
  }, [propertyID]);

  return (
    <div className="min-h-screen flex">
      {showSidebar && (
        <Sidebar setExpanded={setExpanded}>
          <SidebarItem text="Statements" icon={<IoIosStats size={20} />} active alert={false}>
            <SubMenuItem text="Pendentes" filter="pendentes" />
            <SubMenuItem text="Vistos" filter="vistos" />
          </SidebarItem>

          <SidebarItem text="FrontOffice View" icon={<IoIosStats size={20} />} active alert={false}>
          </SidebarItem>

          {/* Lista de hotéis com verificação para garantir que temos dados */}
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <SidebarItem
                key={hotel.propertyID}
                text={hotel.propertyName}
                icon={<IoIosStats size={20} />}
                active={false}
                alert={false}>
                <SubMenuItem text="Departures" filter="partidas" />
                <SubMenuItem text="Arrivals" filter="arrivals" />
                <SubMenuItem text="In House" filter="partidas" />
              </SidebarItem>
            ))
          ) : (
            <p className="text-gray-500 p-4">Nenhum hotel encontrado.</p>
          )}
        </Sidebar>
      )}

      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300`}
        style={{
          marginLeft: showSidebar ? (expanded ? "16rem" : "4rem") : "0",
          padding: "0",
        }}
      >
        {children}
      </main>
    </div>
  );
}
