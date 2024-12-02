'use client';
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar, { SidebarItem, SubMenuItem } from "./Sidebar";
import NavBar from "./Navbar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IoDocumentOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiHotelLine } from "react-icons/ri";

export default function SidebarWrapper({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedHotelID, setSelectedHotelID] = useState("");
  const [listItems, setListItems] = useState({});
  const [hotels, setHotels] = useState([]);
  const [showSelectionButtons, setShowSelectionButtons] = useState(false);
  const [isHotelConfirmed, setIsHotelConfirmed] = useState(false);

  console.log(showSelectionButtons);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      if (session?.user?.propertyIDs && Array.isArray(session.user.propertyIDs)) {
        try {
          const response = await axios.get(
            `/api/properties?propertyIDs=${session.user.propertyIDs.join(",")}`
          );
          const allHotels = Array.isArray(response.data.response) ? response.data.response : [];
          const filteredHotels = allHotels.filter((hotel) =>
            session.user.propertyIDs.includes(hotel.propertyID)
          );
          setHotels(filteredHotels);
        } catch (error) {
          console.error("Erro ao buscar hotéis:", error);
        }
      }
    };

    fetchHotels();
  }, [session]);

  useEffect(() => {
    const updatePendingCount = () => {
      const count = parseInt(localStorage.getItem("pendingCount"), 10) || 0;
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // Recupera os dados do hotel selecionado e confirmação do hotel
  useEffect(() => {
    const savedHotelID = localStorage.getItem("selectedHotelID");
    const savedIsHotelConfirmed = localStorage.getItem("isHotelConfirmed") === 'true';
    if (savedHotelID) {
      setSelectedHotelID(savedHotelID);
      setIsHotelConfirmed(savedIsHotelConfirmed);
    }
  }, []);

  useEffect(() => {
    if (selectedHotelID && session?.user) {
      const isAdmin = session?.user?.permission === 1; // Verifica permissões

      setListItems({
        Statements: {
          icon: <IoDocumentOutline size={20} />,
          items: [
            { ref: "/homepage/statements", label: "Statements" },
            { ref: "/homepage/statements/pending", label: "Pendings", count: pendingCount },
            { ref: "/homepage/statements/viewed", label: "Viewed" },
          ],
        },
        Front_Office: {
          icon: <FaRegCalendarAlt size={18} />,
          items: [
            {
              ref: `/homepage/frontOfficeView`,
              label: "Front Office",
              onClick: () => router.push(`/homepage/frontOfficeView`),
            },
            ...(isAdmin
              ? [
                  {
                    ref: `/homepage/frontOfficeView/arrivals/${selectedHotelID}`,
                    label: "Arrivals",
                    onClick: () =>
                      router.push(`/homepage/frontOfficeView/arrivals/${selectedHotelID}`),
                  },
                  {
                    ref: `/homepage/frontOfficeView/inhouses/${selectedHotelID}`,
                    label: "In Houses",
                    onClick: () =>
                      router.push(`/homepage/frontOfficeView/inhouses/${selectedHotelID}`),
                  },
                ]
              : []), // Somente admins veem esses menus
            {
              ref: `/homepage/frontOfficeView/departures/${selectedHotelID}`,
              label: "Departures",
              onClick: () =>
                router.push(`/homepage/frontOfficeView/departures/${selectedHotelID}`),
            },
          ],
        },
      });
    } else {
      setListItems({});
    }
  }, [selectedHotelID, pendingCount, session]);

  const handleHotelSelect = (hotelID) => {
    setSelectedHotelID(hotelID);
    localStorage.setItem("selectedHotelID", hotelID);
    setIsHotelConfirmed(false); // Resetar a confirmação ao escolher um novo hotel
    localStorage.setItem("isHotelConfirmed", 'false'); // Armazenar o estado de confirmação
    setShowSelectionButtons(true);
  };

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  const resetHotelSelection = () => {
    setSelectedHotelID("");
    setIsHotelConfirmed(false); // Reseta a confirmação ao resetar a seleção
    setShowSelectionButtons(false);
    localStorage.removeItem("selectedHotelID");
    localStorage.removeItem("isHotelConfirmed"); // Limpar a confirmação no localStorage
  };

  const confirmHotelSelection = () => {
    const selectedHotel = hotels.find((hotel) => String(hotel.propertyID) === String(selectedHotelID));
    if (selectedHotel) {
      setIsHotelConfirmed(true); // Marca o hotel como confirmado
      localStorage.setItem("isHotelConfirmed", 'true'); // Armazenar a confirmação
    }
    setShowSelectionButtons(false); // Esconde os botões após a confirmação
  };

  // Verifica se o hotel foi selecionado mas não confirmado ao atualizar a página
  const showConfirmationModal = selectedHotelID && !isHotelConfirmed;

  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");
  const showNavBar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth");

  return (
    <div className="min-h-screen flex flex-col">
      {showNavBar && isMobile ? (
        <NavBar
          listItems={listItems}
          hotels={hotels}
          selectedHotelID={selectedHotelID}
          setSelectedHotelID={setSelectedHotelID}
        />
      ) : (
        !isMobile && showSidebar && (
          <Sidebar setExpanded={setExpanded}>
            <div className="sidebar-autocomplete">
              <select
                value={selectedHotelID}
                onChange={(e) => handleHotelSelect(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select a hotel</option>
                {hotels.map((hotel) => (
                  <option key={hotel.propertyID} value={hotel.propertyID}>
                    {hotel.propertyName}
                  </option>
                ))}
              </select>
              {!selectedHotelID && (
                <div className="text-sm text-gray-500 mt-2">
                  Please select a hotel to access the menus.
                </div>
              )}
            </div>

            {/* Exibe o modal de confirmação do hotel se necessário */}
            {showConfirmationModal && (
              <div className="mt-4 border-t pt-4">
                <div className="text-sm font-semibold mb-2 flex flex-row justify-center items-center">
                  <RiHotelLine size={20} className="mr-1" />
                  {hotels.find((hotel) => String(hotel.propertyID) === String(selectedHotelID))?.propertyName || "Não encontrado"}
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-black text-sm py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Logout
                  </button>
                  <button
                    onClick={resetHotelSelection}
                    className="bg-gray-200 text-black text-sm py-1 px-2 rounded hover:bg-gray-300"
                  >
                    Select
                  </button>
                  <button
                    onClick={confirmHotelSelection}
                    className="bg-primary text-white text-sm py-1 px-2 rounded hover:bg-[#E87A18]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Exibe o menu de navegação apenas após a confirmação do hotel */}
            {isHotelConfirmed && Object.entries(listItems).map(([key, section]) => (
              <SidebarItem key={key} text={key} icon={section.icon} active={section.active}>
                {section.items.map((item, index) => (
                  <SubMenuItem
                    key={index}
                    text={item.label}
                    href={item.ref}
                    active={item.active}
                    count={item.count}
                    onClick={item.onClick}
                  />
                ))}
              </SidebarItem>
            ))}
          </Sidebar>
        )
      )}

      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ${isMobile || !showSidebar ? "p-0" : "ml-16"
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
