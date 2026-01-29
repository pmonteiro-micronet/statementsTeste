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
import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuMapPinHouse } from "react-icons/lu";
import { RxEnter, RxExit } from "react-icons/rx";
import { FaRegAddressCard } from "react-icons/fa";
import { GiArchiveRegister } from "react-icons/gi";
import { PiBroom } from "react-icons/pi";

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

  useEffect(() => {
    const savedHotelID = localStorage.getItem("selectedHotelID");
    const savedIsHotelConfirmed = localStorage.getItem("isHotelConfirmed") === 'true';
    if (savedHotelID) {
      setSelectedHotelID(savedHotelID);
      setIsHotelConfirmed(savedIsHotelConfirmed);
    }
  }, []);

  const handleRedirect = async (type) => {
    if (selectedHotelID) {
      setIsLoading(true);
      try {
          // Redirect after all API calls have been made
          router.push(`/homepage/frontOfficeView/${type}/${selectedHotelID}`);
       
      } catch (error) {
        console.error("Erro durante as requisições", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // const sendDataToAPI = async (type, mpehotel) => {
  //   try {
  //     const propertyID = selectedHotelID;
  
  //     if (mpehotel && propertyID) {
  //       if (type === "arrivals") {
  //         await axios.get("/api/reservations/checkins/reservations_4_tat", {
  //           params: { mpehotel, propertyID },
  //         });
  //       } else if (type === "inhouses") {
  //         await axios.get("/api/reservations/inHouses/reservations_4_tat", {
  //           params: { mpehotel, propertyID },
  //         });
  //       } else if (type === "departures") {
  //         await axios.get("/api/reservations/info", {
  //           params: { mpehotel, propertyID },
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`Erro ao enviar os dados para ${type}:`, error);
  //   }
  // };
  
useEffect(() => {
  if (selectedHotelID && session?.user) {
    const isAdmin = session?.user?.role?.includes(1) ?? false;
    const isHousekeeping = session?.user?.role?.includes(2) ?? false;
    const isUser = session?.user?.role?.includes(3) ?? false;

    const menu = {};

    // Admin vê tudo
    if (isAdmin) {
      menu[t.navbar.text.statements] = {
        icon: <IoDocumentOutline size={20} />,
        items: [
          { ref: "/homepage/statements", label: `${t.navbar.text.dashboard}`, icon: <TbLayoutDashboardFilled /> },
          { ref: "/homepage/statements/pending", label: `${t.navbar.text.pendings}`, icon: <MdOutlinePendingActions />, count: pendingCount },
          { ref: "/homepage/statements/viewed", label: `${t.navbar.text.viewed}`, icon: <AiOutlineFileDone /> },
        ],
      };

      menu.Front_Office = {
        icon: <FaRegCalendarAlt size={18} />,
        items: [
          {
            ref: `/homepage/frontOfficeView/${selectedHotelID}`,
            label: `${t.navbar.text.dashboard}`,
            onClick: () => router.push(`/homepage/frontOfficeView/${selectedHotelID}`),
            icon: <TbLayoutDashboardFilled />,
          },
          {
            ref: `/homepage/frontOfficeView/reservations/${selectedHotelID}`,
            label: `Reservations`,
            onClick: () => handleRedirect("reservations"),
            icon: <GiArchiveRegister />,
          },
          {
            ref: `/homepage/frontOfficeView/checkinRequest`,
            label: `Registration Form`,
            icon: <FaRegAddressCard />,
          },
          {
            ref: `/homepage/frontOfficeView/arrivals/${selectedHotelID}`,
            label: `${t.navbar.text.arrivals}`,
            onClick: () => handleRedirect("arrivals"),
            icon: <RxEnter />,
          },
          {
            ref: `/homepage/frontOfficeView/inhouses/${selectedHotelID}`,
            label: `${t.navbar.text.inHouses}`,
            onClick: () => handleRedirect("inhouses"),
            icon: <LuMapPinHouse />,
          },
          {
            ref: `/homepage/frontOfficeView/departures/${selectedHotelID}`,
            label: `${t.navbar.text.departures}`,
            onClick: () => handleRedirect("departures"),
            icon: <RxExit />,
          },
        ],
      };

      menu.Housekeeping = {
        icon: <PiBroom size={20} />,
        items: [
          {
            ref: `/homepage/housekeeping/${selectedHotelID}`,
            label: `${t.navbar.text.housekeeping}`,
            onClick: () => handleRedirect("housekeeping"),
            icon: <PiBroom size={18} />,
          },
        ],
      };
    }

    // Usuário comum vê statements e front office (sem reservations e housekeeping)
    else if (isUser) {
      menu[t.navbar.text.statements] = {
        icon: <IoDocumentOutline size={20} />,
        items: [
          { ref: "/homepage/statements", label: `${t.navbar.text.dashboard}`, icon: <TbLayoutDashboardFilled /> },
          { ref: "/homepage/statements/pending", label: `${t.navbar.text.pendings}`, icon: <MdOutlinePendingActions />, count: pendingCount },
          { ref: "/homepage/statements/viewed", label: `${t.navbar.text.viewed}`, icon: <AiOutlineFileDone /> },
        ],
      };

      menu.Front_Office = {
        icon: <FaRegCalendarAlt size={18} />,
        items: [
          {
            ref: `/homepage/frontOfficeView/${selectedHotelID}`,
            label: `${t.navbar.text.dashboard}`,
            onClick: () => router.push(`/homepage/frontOfficeView/${selectedHotelID}`),
            icon: <TbLayoutDashboardFilled />,
          },
          {
            ref: `/homepage/frontOfficeView/checkinRequest`,
            label: `Registration Form`,
            icon: <FaRegAddressCard />,
          },
          {
            ref: `/homepage/frontOfficeView/arrivals/${selectedHotelID}`,
            label: `${t.navbar.text.arrivals}`,
            onClick: () => handleRedirect("arrivals"),
            icon: <RxEnter />,
          },
          {
            ref: `/homepage/frontOfficeView/inhouses/${selectedHotelID}`,
            label: `${t.navbar.text.inHouses}`,
            onClick: () => handleRedirect("inhouses"),
            icon: <LuMapPinHouse />,
          },
          {
            ref: `/homepage/frontOfficeView/departures/${selectedHotelID}`,
            label: `${t.navbar.text.departures}`,
            onClick: () => handleRedirect("departures"),
            icon: <RxExit />,
          },
        ],
      };
    }

    // Housekeeping vê apenas Housekeeping
    else if (isHousekeeping) {
      menu.Housekeeping = {
        icon: <PiBroom size={20} />,
        items: [
          {
            ref: `/homepage/housekeeping/${selectedHotelID}`,
            label: `Management`,
            onClick: () => handleRedirect("housekeeping"),
            icon: <PiBroom size={18} />,
          },
        ],
      };
    }

    setListItems(menu);
  } else {
    setListItems({});
  }
}, [selectedHotelID, pendingCount, session, router.pathname]);




  const handleHotelSelect = (hotelID) => {
    setSelectedHotelID(hotelID);
    localStorage.setItem("selectedHotelID", hotelID);
    setIsHotelConfirmed(false); // Resetar a confirmação ao escolher um novo hotel
    localStorage.setItem("isHotelConfirmed", 'false'); // Armazenar o estado de confirmação
    setShowSelectionButtons(true); // Exibir os botões "Select" e "Continue"
  };

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  // const resetHotelSelection = () => {
  //   setSelectedHotelID("");
  //   setIsHotelConfirmed(false);
  //   setShowSelectionButtons(false);
  //   localStorage.removeItem("selectedHotelID");
  //   localStorage.removeItem("isHotelConfirmed");
  // };

  const confirmHotelSelection = () => {
    const selectedHotel = hotels.find((hotel) => String(hotel.propertyID) === String(selectedHotelID));

    if (selectedHotel) {
      setIsHotelConfirmed(true);
      localStorage.setItem("isHotelConfirmed", 'true');

      // Redireciona para a página principal do front office
      router.push(`/homepage/frontOfficeView/${selectedHotelID}`);
    }

    setShowSelectionButtons(false); // Esconde os botões após a confirmação
  };


  const showConfirmationModal = selectedHotelID && !isHotelConfirmed;
  const showSidebar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth") && !pathname.includes("/homepage/frontOfficeView/registrationForm") && !pathname.includes("/qrcode_user");
  const showNavBar = pathname && !pathname.includes("/homepage/jsonView") && !pathname.includes("/auth") && !pathname.includes("/homepage/frontOfficeView/registrationForm") && !pathname.includes("/qrcode_user");

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
                className="border p-2 rounded w-full mb-4 text-textPrimaryColor"
              >
                <option value="" className="text-textPrimaryColor">{t.navbar.text.selectHotel}</option>
                {hotels.map((hotel) => (
                  <option className="text-textPrimaryColor" key={hotel.propertyID} value={hotel.propertyID}>
                    {hotel.propertyName}
                  </option>
                ))}
              </select>
              {!selectedHotelID && (
                <div className="text-sm text-gray-500 mt-2">
                  {t.navbar.text.selectHotelInfo}
                </div>
              )}
            </div>

            {showConfirmationModal && (
              <div className="mt-4 border-t pt-4">
                <div className="text-sm font-semibold mb-2 flex flex-row justify-center items-center text-textPrimaryColor">
                  <RiHotelLine size={20} className="mr-1" />
                  {hotels.find((hotel) => String(hotel.propertyID) === String(selectedHotelID))?.propertyName || "Não encontrado"}
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-black text-sm py-1 px-2 rounded hover:bg-gray-300"
                  >
                    {t.navbar.text.logout}
                  </button>
                  <button
                    onClick={confirmHotelSelection}
                    className="bg-primary text-white text-sm py-1 px-2 rounded hover:bg-[#E87A18]"
                  >
                    {t.navbar.text.select}
                  </button>
                </div>
              </div>
            )}

            {isHotelConfirmed && Object.entries(listItems).map(([key, section]) => (
              <SidebarItem key={key} text={key} icon={section.icon} active={section.active}>
                {section.items.map((item, index) => (
                  <SubMenuItem
                    key={index}
                    text={item.label}
                    href={item.ref}
                    icon={item.icon} // Adicione o ícone ao submenu
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
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 bg-background ${isMobile || !showSidebar ? "p-0" : "ml-16"
          } ${showNavBar ? "" : ""} `}
        style={{
          marginLeft: isMobile || !showSidebar ? "0" : expanded ? "16rem" : "4rem",
        }}
      >
        {children}
      </main>

    </div>
  );
}
