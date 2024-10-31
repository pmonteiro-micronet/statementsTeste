"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar, { SidebarItem, SubMenuItem } from "./Sidebar";
import NavBar from "./NavBar";
import { useSession } from "next-auth/react";
import { IoIosStats } from "react-icons/io";
import axios from "axios";

export default function SidebarWrapper({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [listItems, setListItems] = useState({
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
      items: [],
    },
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      if (session?.user?.propertyID) {
        try {
          const response = await axios.get(`/api/properties?propertyID=${session.user.propertyID}`);
          const hotels = Array.isArray(response.data.response) ? response.data.response : [];
          
          setListItems((prevListItems) => ({
            ...prevListItems,
            FrontOffice_View: {
              ...prevListItems.FrontOffice_View,
              items: hotels.map((hotel) => ({
                label: hotel.propertyName,
                items: [
                  { ref: `/homepage/frontOfficeView/departures/${hotel.propertyID}`, label: "Departures" },
                  { ref: `/homepage/frontOfficeView/${hotel.propertyID}/arrivals`, label: "Arrivals" },
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

  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <NavBar listItems={listItems}/>
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
        )
      )}

      {isMobile ? (
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300`}
          style={{
            marginLeft: !isMobile && expanded ? "16rem" : "0", // Margem ajustada para largura total no mobile
          }}
        >
          {children}
        </main>
      ) : (
        <main
          className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300`}
          style={{
            marginLeft: !isMobile && expanded ? "16rem" : "4rem",
            padding: "0",
          }}
        >
          {children}
        </main>
      )}
    </div>
  );
}
