"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem, SubMenuItem } from "@/components/Sidebar/Layout/Sidebar";
import { IoIosStats } from "react-icons/io";
import { useSession } from "next-auth/react";
import axios from "axios";

// Interface para garantir que os dados da API estejam corretos
interface Hotel {
  propertyID: string;
  propertyName: string;
}

const baseListItems = {
  Statements: {
    icon: <IoIosStats size={20} />,
    active: true,
    items: [
      { ref: "/homepage/statements/pending", label: "Pendings", active: true },
      { ref: "/homepage/statements/viewed", label: "Viewed", active: true },
    ],
  },
  FrontOffice_View: {
    icon: <IoIosStats size={20} />,
    active: true,
    items: [], // Para ser preenchido dinamicamente com os hotéis
  },
};

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");
  const [expanded, setExpanded] = useState(true);
  const [listItems, setListItems] = useState(baseListItems);
  const propertyID = session?.user?.propertyID || null;

  // Chamada para buscar hotéis
  useEffect(() => {
    const fetchHotels = async () => {
      if (propertyID) {
        try {
          const response = await axios.get(`/api/properties?propertyID=${propertyID}`);
          const hotels: Hotel[] = Array.isArray(response.data.response) ? response.data.response : [];

          // Adiciona dinamicamente os hotéis ao item FrontOffice_View em listItems
          const updatedListItems = { ...baseListItems };
          updatedListItems.FrontOffice_View.items = hotels.length > 1
            ? hotels.map((hotel) => ({
                label: hotel.propertyName,
                items: [
                  { ref: `/homepage/frontOfficeView/departures/${hotel.propertyID}`, label: "Departures" },
                  { ref: `/homepage/frontOfficeView/${hotel.propertyID}/arrivals`, label: "Arrivals" },
                ],
              }))
            : [
                { ref: `/homepage/frontOfficeView/${hotels[0]?.propertyID}/departures`, label: "Departures" },
                { ref: `/homepage/frontOfficeView/${hotels[0]?.propertyID}/arrivals`, label: "Arrivals" },
              ];

          setListItems(updatedListItems);
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
          {Object.entries(listItems).map(([key, section]) => (
            <SidebarItem
              key={key}
              text={key}
              icon={section.icon}
              active={section.active}
            >
              {section.items.map((item, index) =>
                item.items ? (
                  <SidebarItem key={index} text={item.label} icon={section.icon} active={false}>
                    {item.items.map((subItem, subIndex) => (
                      <SubMenuItem key={subIndex} text={subItem.label} href={subItem.ref} />
                    ))}
                  </SidebarItem>
                ) : (
                  <SubMenuItem key={index} text={item.label} href={item.ref} />
                )
              )}
            </SidebarItem>
          ))}
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
