"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem, SubMenuItem } from "./Sidebar";
import NavBar from "./Navbar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IoDocumentOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function SidebarWrapper({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [pendingCount, setPendingCount] = useState(0); // Estado para armazenar o contador de pendências
  const [listItems, setListItems] = useState({
    Statements: {
      icon: <IoDocumentOutline size={20} />,
      items: [
        { ref: "/homepage/statements/pending", label: "Pendings", count: 0 },
        { ref: "/homepage/statements/viewed", label: "Viewed" },
      ],
    },
    FrontOffice_View: {
      icon: <FaRegCalendarAlt size={18} />,
      items: [],
    },
  });
console.log(pendingCount);
  // Atualizar o tamanho da tela
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Buscar hotéis e configurar items da sidebar
  useEffect(() => {
    const fetchHotels = async () => {
      if (session?.user?.propertyID) {
        try {
          const response = await axios.get(`/api/properties?propertyID=${session.user.propertyID}`);
          const hotels = Array.isArray(response.data.response) ? response.data.response : [];
          const filteredHotels = hotels.filter(hotel => hotel.propertyID === session.user.propertyID);

          setListItems((prevListItems) => ({
            ...prevListItems,
            FrontOffice_View: {
              ...prevListItems.FrontOffice_View,
              items: filteredHotels.length === 1
                ? [
                    { ref: `/homepage/frontOfficeView/departures/${filteredHotels[0].propertyID}`, label: "Departures" },
                    { ref: `/homepage/frontOfficeView/arrivals/${filteredHotels[0].propertyID}`, label: "Arrivals" },
                  ]
                : filteredHotels.map((hotel) => ({
                    label: hotel.propertyName,
                    items: [
                      { ref: `/homepage/frontOfficeView/departures/${hotel.propertyID}`, label: "Departures" },
                      { ref: `/homepage/frontOfficeView/${hotel.propertyID}/arrivals/${hotel.propertyID}`, label: "Arrivals" },
                    ],
                  })),
            },
          }));
        } catch (error) {
          console.error("Erro ao buscar os hotéis:", error.response ? error.response.data : error.message);
        }
      }
    };

    fetchHotels();
  }, [session]);

  // Atualizar pendências do localStorage
  useEffect(() => {
    const updatePendingCount = () => {
      const count = parseInt(localStorage.getItem("pendingCount"), 10) || 0;
      setPendingCount(count);

      // Atualizar o listItems com a contagem mais recente
      setListItems((prevListItems) => ({
        ...prevListItems,
        Statements: {
          ...prevListItems.Statements,
          items: prevListItems.Statements.items.map((item) =>
            item.ref === "/homepage/statements/pending"
              ? { ...item, count }
              : item
          ),
        },
      }));
    };

    updatePendingCount(); // Atualizar ao montar
    const interval = setInterval(updatePendingCount, 1000); // Atualizar periodicamente

    return () => clearInterval(interval); // Limpar intervalo ao desmontar
  }, []);

  // Atualize o estado ativo com base na rota atual
  useEffect(() => {
    setListItems((prevListItems) => {
      const updatedListItems = { ...prevListItems };

      Object.entries(updatedListItems).forEach(([key, section]) => {
        console.log(key);
        let sectionActive = false;

        section.items = section.items.map((item) => {
          if (!item.items) {
            const isActive = pathname === item.ref;
            sectionActive = sectionActive || isActive;
            return {
              ...item,
              active: isActive,
            };
          }

          const subItems = item.items.map((subItem) => {
            const isSubActive = pathname === subItem.ref;
            sectionActive = sectionActive || isSubActive;
            return {
              ...subItem,
              active: isSubActive,
            };
          });

          return {
            ...item,
            active: subItems.some((subItem) => subItem.active),
            items: subItems,
          };
        });

        section.active = sectionActive;
      });

      return updatedListItems;
    });
  }, [pathname]);

  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <NavBar listItems={listItems} />
      ) : (
        showSidebar && (
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
                    <SidebarItem key={index} text={item.label} icon={section.icon} active={item.active}>
                      {item.items.map((subItem, subIndex) => (
                        <SubMenuItem key={subIndex} text={subItem.label} href={subItem.ref} active={subItem.active} />
                      ))}
                    </SidebarItem>
                  ) : (
                    <SubMenuItem key={index} text={item.label} href={item.ref} active={item.active} count={item.count} />
                  )
                )}
              </SidebarItem>
            ))}
          </Sidebar>
        )
      )}

      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${
          !showSidebar ? "p-0" : "ml-16"
        }`}
        style={{
          marginLeft: isMobile || !showSidebar ? "0" : expanded ? "16rem" : "4rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
