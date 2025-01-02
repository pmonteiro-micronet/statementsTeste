import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaGlobe, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Novos ícones adicionados
function replaceUnderscores(text) {
  return text.replace(/_/g, " ");
}

export default function NavBar({ listItems, hotels = [], selectedHotelID, setSelectedHotelID }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(new Set());
  const [warningVisible, setWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Novo estado para o menu do usuário
  const { data: session } = useSession();
  let inactivityTimeout;
  let warningTimeout;

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
    <nav className="w-full fixed top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="font-semibold text-sm">Extensions myPMS</div>

      {/* Dropdown for hotel selection inside the menu */}
      <button onClick={toggleMenu} className="text-2xl">
        <IoMenu />
      </button>

      {/* Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4 -mt-3">
            <div className="font-semibold text-sm">Extensions myPMS</div>
            <button onClick={toggleMenu} className="text-2xl text-gray-600">
              &times;
            </button>
          </div>

          <div className="mb-4">
            <select
              value={selectedHotelID}
              onChange={(e) => handleHotelSelect(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Select a hotel</option>
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
                                  className="block py-1 text-indigo-600"
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
                <div className="ml-3 text-center">
                  <p className="font-medium">
                    {session ? `${session.user.firstName} ${session.user.secondName}` : "Usuário Desconhecido"}
                  </p>
                  <span className="text-xs text-gray-600 ml-3">
                    {session ? session.user.email : "Email Desconhecido"}
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
                    <div className="absolute bottom-full bg-white shadow-lg rounded mb-2 w-40">
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => {
                              // Lógica para alternar o modo de visualização
                              toggleTheme();
                            }}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                          </button>
                        </li>
                        <li className="py-2 px-3 rounded-md flex flex-row justify-between">
                          <span className="flex items-center">
                            <FaGlobe className="mr-2" />
                            Language
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
                            <ul className="absolute top-10 right-0 bg-white shadow-md rounded-md w-10 z-50">
                              <li
                                onClick={() => handleLanguageChange('pt')}
                                className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                              >
                                <img src="/flags/pt.png" alt="portuguese" className="w-4 h-4 object-cover mr-4" />
                              </li>
                              <li
                                onClick={() => handleLanguageChange('uk')}
                                className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                              >
                                <img src="/flags/uk.png" alt="english" className="w-4 h-4 object-cover mr-4" />
                              </li>
                              <li
                                onClick={() => handleLanguageChange('sp')}
                                className="flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100"
                              >
                                <img src="/flags/sp.png" alt="spanish" className="w-4 h-4 object-cover mr-4" />
                              </li>
                            </ul>
                          )}
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm text-red-600 flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" />
                            Logout
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
            <h1 className="text-xl font-bold mb-4">You will logout automatically in {countdown} seconds!</h1>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleContinueSession}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Continue Session
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
