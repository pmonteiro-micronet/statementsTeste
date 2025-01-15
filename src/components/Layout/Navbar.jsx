import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaGlobe, FaChevronDown, FaChevronUp, FaMoon } from "react-icons/fa"; // Novos ícones adicionados

import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";

import { MdSunny } from "react-icons/md";

function replaceUnderscores(text) {
  return text.replace(/_/g, " ");
}
const translations = { en, pt, es };

export default function NavBar({ listItems, hotels = [], selectedHotelID, setSelectedHotelID }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(new Set());
  const [warningVisible, setWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Novo estado para o menu do usuário
  const { data: session } = useSession();
  let inactivityTimeout;
  let warningTimeout;

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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = (key) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev); // Alterna o estado do menu do usuário
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  const handleHotelSelect = (hotelID) => {
    setSelectedHotelID(hotelID);
    localStorage.setItem("selectedHotelID", hotelID);
  };

  const stopActivityListeners = () => {
    window.removeEventListener("mousemove", resetInactivityTimer);
    window.removeEventListener("keydown", resetInactivityTimer);
  };

  const startActivityListeners = () => {
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
  };

  const resetInactivityTimer = () => {
    if (warningVisible) return; // Não reiniciar se o aviso estiver visível

    clearTimeout(inactivityTimeout);
    clearTimeout(warningTimeout);
    setWarningVisible(false);
    setCountdown(60);

    warningTimeout = setTimeout(() => {
      setWarningVisible(true);
      stopActivityListeners(); // Parar detectores de atividade
      startCountdown();
    }, 14 * 60 * 1000);

    inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, 15 * 60 * 1000);
  };

  const startCountdown = () => {
    let timeLeft = 60;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleContinueSession = () => {
    setWarningVisible(false);
    setCountdown(60);
    startActivityListeners(); // Reiniciar detectores de atividade
    resetInactivityTimer();
  };

  useEffect(() => {
    startActivityListeners();
    resetInactivityTimer();

    return () => {
      stopActivityListeners();
      clearTimeout(inactivityTimeout);
      clearTimeout(warningTimeout);
    };
  }, []);

  const [setDropdownOpen] = useState(false); // Controle do dropdown
  const [isDarkMode, setIsDarkMode] = useState(false); // Controle do tema
  const [language, setLanguage] = useState("pt"); // Idioma padrão

  // Alternar o tema
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark"); // Adiciona o tema escuro
    } else {
      document.documentElement.classList.remove("dark"); // Remove o tema escuro
    }
  };

  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false); // Controle do dropdown de idiomas

  const toggleLanguageDropdown = () => setLanguageDropdownOpen(!isLanguageDropdownOpen);

  // const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setDropdownOpen(false); // Fecha o dropdown após selecionar
  };

  return (
    <nav className="w-full fixed top-0 z-50 flex items-center justify-between p-4 bg-primaryBackground shadow-md">
      {/* Logo */}
      <div className="flex !flex-row !items-center gap-2">
        <img
          src="/icon/extensionsLogoWeb.png"
          alt="extensions"
          width={20}
          height={20}
        />
        <div className="font-semibold text-textPrimaryColor text-sm mt-1">Extensions myPMS</div>
      </div>

      {/* Dropdown for hotel selection inside the menu */}
      <button onClick={toggleMenu} className="text-textPrimaryColor text-2xl">
        <IoMenu />
      </button>

      {/* Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-primaryBackground flex flex-col p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4 -mt-3">
            <div className="flex !flex-row !items-center gap-2">
              <img
                src="/icon/extensionsLogoWeb.png"
                alt="extensions"
                width={20}
                height={20}
              />
              <div className="font-semibold text-textPrimaryColor text-sm mt-1">Extensions myPMS</div>
            </div>
            <button onClick={toggleMenu} className="text-2xl text-textPrimaryColor">
              &times;
            </button>
          </div>

          <div className="mb-4">
            <select
              value={selectedHotelID}
              onChange={(e) => handleHotelSelect(e.target.value)}
              className="border p-2 rounded w-full text-textPrimaryColor"
            >
              <option value="">{t.navbar.text.selectHotel}</option>
              {Array.isArray(hotels) &&
                hotels.map((hotel) => (
                  <option key={hotel.propertyID} value={hotel.propertyID}>
                    {hotel.propertyName}
                  </option>
                ))}
            </select>
          </div>

          <ul>
            {Object.entries(listItems).map(([key, section]) => (
              <li key={key} className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer font-bold text-indigo-800 mb-2"
                  onClick={() => toggleSubmenu(key)}
                >
                  {replaceUnderscores(key)}
                  {section.items && (
                    <span className="text-sm text-gray-600">
                      {openMenus.has(key) ? <IoIosArrowUp size={15} /> : <IoIosArrowDown size={15} />}
                    </span>
                  )}
                </div>

                {openMenus.has(key) && (
                  <ul className="pl-4">
                    {section.items.map((item, index) =>
                      item.items ? (
                        <li key={index} className="mb-2">
                          <span className="font-semibold text-gray-800">{replaceUnderscores(item.label)}</span>
                          <ul className="pl-4">
                            {item.items.map((subItem, subIndex) => (
                              <li key={subIndex} className="mb-1">
                                <Link
                                  href={subItem.ref}
                                  className="block py-1 text-textPrimaryColor"
                                  onClick={toggleMenu}
                                >
                                  {replaceUnderscores(subItem.label)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ) : (
                        <li key={index} className="mb-1">
                          <Link
                            href={item.ref}
                            className="block py-2 text-indigo-600"
                            onClick={toggleMenu}
                          >
                            {replaceUnderscores(item.label)}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                  <FaUser />
                </div>
                <div className="ml-3 text-textPrimaryColor text-center">
                  <p className="font-medium">
                    {session ? `${session.user.firstName} ${session.user.secondName}` : `${t.navbar.errors.unknownUser}`}
                  </p>
                  <span className="text-xs text-gray-600 ml-3">
                    {session ? session.user.email : `${t.navbar.errors.unknownEmail}`}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center justify-center w-full py-2 text-sm text-gray-700"
                  >
                    <IoIosArrowDown className="ml-2" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute bottom-full bg-background text-textPrimaryColor shadow-lg rounded mb-2 w-48">
                      <ul className="py-2">
                        <li>
                          <div className="flex items-center justify-between px-4 py-2 text-sm text-textPrimaryColor">
                            <span>{t.navbar.text.viewMode}</span>
                            <button
                              onClick={toggleTheme}
                              className="relative w-20 h-8 flex items-center bg-gray-300 rounded-full transition"
                            >
                              {/* Sol - lado esquerdo */}
                              <div
                                className={`absolute left-2 top-1/2 transform -translate-y-1/2 transition ${isDarkMode ? "opacity-100 text-gray-400" : "opacity-0"
                                  }`}
                              >
                                <MdSunny size={18} />
                              </div>

                              {/* Lua - lado direito */}
                              <div
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition ${isDarkMode ? "opacity-0" : "opacity-100 text-gray-400"
                                  }`}
                              >
                                <FaMoon size={18} />
                              </div>

                              {/* Botão deslizante */}
                              <span
                                className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition ${isDarkMode ? "translate-x-12" : "translate-x-0"
                                  } flex items-center justify-center z-10`}
                              >
                                {isDarkMode ? (
                                  <FaMoon size={14} className="text-orange-400" />
                                ) : (
                                  <MdSunny size={14} className="text-orange-400" />
                                )}
                              </span>
                            </button>
                          </div>
                        </li>
                        <li className="py-2 px-3 rounded-md flex flex-row">
                          <div className="flex justify-between">
                            <span className="flex items-center">
                              <FaGlobe className="mr-2" />
                              {t.navbar.text.language}
                            </span>
                            {/* Botão de seleção */}
                            <button
                              onClick={toggleLanguageDropdown} // Alterna o dropdown de idiomas
                              className="ml-2 bg-transparent outline-none cursor-pointer flex items-center"
                            >
                              {/* Exibe a bandeira ativa */}
                              <img
                                src={`/flags/${language}.png`}
                                alt={language}
                                className="w-4 h-4 object-cover"
                              />
                              {/* Botão de seta para abrir o dropdown */}
                              <button onClick={toggleLanguageDropdown} className="ml-2 text-gray-600">
                                {isLanguageDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </button>
                            {/* Dropdown customizado */}
                            {isLanguageDropdownOpen && (
                              <ul className="absolute top-20 right-4 bg-background shadow-md rounded-md w-12 z-50">
                                <li
                                  onClick={() => handleLanguageChange('pt')}
                                  className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                                >
                                  <img src="/flags/pt.png" alt="portuguese" className="w-6 h-6 object-cover mr-4" />
                                </li>
                                <li
                                  onClick={() => handleLanguageChange('uk')}
                                  className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                                >
                                  <img src="/flags/uk.png" alt="english" className="w-6 h-6 object-cover mr-4" />
                                </li>
                                <li
                                  onClick={() => handleLanguageChange('sp')}
                                  className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                                >
                                  <img src="/flags/sp.png" alt="spanish" className="w-6 h-6 object-cover mr-4" />
                                </li>
                              </ul>
                            )}
                          </div>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-red-600 flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" />
                            {t.navbar.text.logout}
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Warning */}
      {warningVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h1 className="text-xl font-bold mb-4">{t.navbar.alert.messagePart1} {countdown} {t.navbar.alert.messagePart2}</h1>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleContinueSession}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {t.navbar.alert.continue}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                {t.navbar.alert.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
