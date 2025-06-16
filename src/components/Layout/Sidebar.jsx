"use client";
import { useContext, createContext, useState, useEffect, useRef } from "react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import Link from "next/link"; // Importando o Link do Next.js
import { signOut, useSession } from "next-auth/react"; // Importando a função de logout
import { useRouter } from "next/navigation"; // Importando o hook de navegação
import { FaSignOutAlt } from "react-icons/fa"; // Importa o ícone de logout
import { FaUser } from "react-icons/fa";
import { RiHotelFill } from "react-icons/ri";

import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";

import { MdSunny } from "react-icons/md";
import { FaMoon, FaGlobe, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Novos ícones adicionados

import ProfileModalForm from "@/components/modals/user/profileModal";

const SidebarContext = createContext();
let inactivityTimeout;
let warningTimeout;
const translations = { en, pt, es };

export default function Sidebar({ children, setExpanded }) {
  const [expanded, setExpandedInternal] = useState(true);
  const { data: session, status } = useSession(); // Obtém a sessão
  const router = useRouter(); // Obtém o router
  const [warningVisible, setWarningVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const dropdownRef = useRef(null);
// const modalRef = useRef(null); // Novo ref para o modal

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

  useEffect(() => {
    // Verifica se a sessão está carregando ou se está ativa
    if (status === "loading") return;

    // Se não houver sessão e o path não for "/auth", redireciona para "/auth"
    if (!session && router.pathname !== "/auth") {
      router.push("/auth");
    }
  }, [session, status, router.pathname]);

  const handleToggle = () => {
    setExpandedInternal((curr) => !curr);
    setExpanded((curr) => !curr); // Atualiza o estado externo
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" }); // Redireciona para a página de login após logout
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
    }, 14 * 60 * 1000); // 14 minutos

    inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, 15 * 60 * 1000); // 15 minutos
  };

  const stopActivityListeners = () => {
    window.removeEventListener("mousemove", resetInactivityTimer);
    window.removeEventListener("keydown", resetInactivityTimer);
  };

  const startActivityListeners = () => {
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
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

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Atualiza na montagem e sempre que a janela for redimensionada
    window.addEventListener('resize', updateHeight);
    updateHeight();

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const [isDropdownOpen, setDropdownOpen] = useState(false); // Controle do dropdown
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

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);


  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Alterar o idioma e armazenar no localStorage
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang); // Salvar no localStorage
    setDropdownOpen(false); // Fechar o dropdown após selecionar
    window.location.reload(); // Recarregar a página para aplicar o idioma
  };
  const user = session?.user || {};
  const isAdmin = user?.permission === 1; // Verifica se o usuário é admin

  return (
    <>
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

      <aside
        className={` overflow-x-hidden fixed top-0 left-0 bg-primaryBackground border-r shadow-sm transition-all duration-300 ${expanded ? "w-64" : "w-16"
          }`}
        style={{
          height: 'calc(var(--vh, 1vh) * 100)', // Usa a altura visível calculada
          maxHeight: 'calc(var(--vh, 1vh) * 100)',
          overflowY: 'auto', // Caso o conteúdo exceda, permite scroll apenas dentro da sidebar
        }}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-2 flex !justify-between items-center gap-2">
            <img src="/icon/extensionsLogo.png" alt="logo" width={20} />
            <p
              className={`font-semibold text-sm overflow-hidden transition-all text-textPrimaryColor ${expanded ? "w-64" : "w-0"
                }`}
            >
              Extensions myPMS
            </p>
            <button
              onClick={handleToggle}
              className="p-1.5 rounded-lg bg-primaryBackground hover:primaryBackground"
            >
              <TbLayoutSidebarLeftExpand className="text-textPrimaryColor" />
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[#FAE7D6]">
              <FaUser style={{ color: "#FC9D25" }} />
            </div>

            {/* Informações do usuário */}
            <div
              className={`flex justify-between text-textPrimaryColor items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
                }`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">
                  {session
                    ? `${session.user.firstName} ${session.user.secondName}`
                    : `${t.navbar.errors.unknownUser}`}
                </h4>
                <span className="text-xs text-textLabelColor">
                  {session ? session.user.email : `${t.navbar.errors.unknownEmail}`}
                </span>
              </div>

              {/* Botão de seta para abrir dropdown */}
              <button onClick={toggleDropdown} className="ml-2 text-gray-600">
                {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute bottom-14 right-0 bg-background shadow-lg rounded-md p-3 w-56 z-50 text-textPrimaryColor border border-gray-200">
                <ul>
                  <li
                    className={isAdmin ? "" : "disabled"} // Aplica uma classe de estilo "disabled" se não for admin
                    style={{
                      pointerEvents: isAdmin ? "auto" : "none", // Desativa a interação do mouse se não for admin
                      opacity: isAdmin ? 1 : 0.5, // Reduz a opacidade para criar efeito visual de desabilitado
                    }}
                  >
                    <div className="flex flex-row gap-4 px-3 text-sm mb-3">
                      <RiHotelFill size={15} />
                      <Link href="/homepage/allProperties">All Properties</Link>
                    </div>
                  </li>
                  <li
                    className={isAdmin ? "" : "disabled"} // Aplica uma classe de estilo "disabled" se não for admin
                    style={{
                      pointerEvents: isAdmin ? "auto" : "none", // Desativa a interação do mouse se não for admin
                      opacity: isAdmin ? 1 : 0.5, // Reduz a opacidade para criar efeito visual de desabilitado
                    }}
                  >
                    <div className="flex flex-row gap-4 px-3 text-sm mb-1">
                      <FaUser />
                      <Link href="/homepage/allProfiles">All Profiles</Link>
                    </div>
                  </li>
                  <li className="">
                    <ProfileModalForm
                      formTypeModal={11}
                      buttonName={"Profile Settings"}
                      buttonIcon={<FaUser />}
                      modalHeader={"Profile Settings"}
                      buttonColor={"transparent"}
                    />
                  </li>
                  {/* Tema Escuro */}
                  <li className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-background">
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
                        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition ${isDarkMode ? "translate-x-8" : "translate-x-0"
                          } flex items-center justify-center z-10`}
                      >
                        {isDarkMode ? (
                          <FaMoon size={14} className="text-orange-400" />
                        ) : (
                          <MdSunny size={14} className="text-orange-400" />
                        )}
                      </span>
                    </button>
                  </li>

                  {/* Idiomas */}
                  <li className="py-2 px-3 rounded-md flex flex-row justify-between">
                    <span className="flex items-center">
                      <FaGlobe className="mr-2" />
                      {t.navbar.text.language}
                    </span>
                    <select
                      className="ml-2 bg-transparent outline-none cursor-pointer"
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      <option value="pt">Pt</option>
                      <option value="en">En</option>
                      <option value="es">Es</option>
                    </select>
                  </li>

                  {/* Logout */}
                  <li
                    className="flex items-center py-2 px-3 rounded-md text-red-500 hover:bg-background cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-2" />
                    {t.navbar.text.logout}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

// Função utilitária para substituir underscores por espaços
function replaceUnderscores(text) {
  return text.replace(/_/g, " ");
}

// SidebarItem Component
export function SidebarItem({ icon, text, active, alert, children }) {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false); // Estado para controle do submenu

  return (
    <>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active
          ? "bg-[#FC9D25] text-white"
          : "hover:bg-primary-50 text-gray-600"
          }`}
        onClick={() => {
          if (children) setIsOpen((prev) => !prev); // Alterna o submenu se houver filhos
        }}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
            }`}
        >
          {replaceUnderscores(text)} {/* Aplica a função aqui */}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-primary ${expanded ? "" : "top-2"
              }`}
          />
        )}

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-primary text-[#BF6415] text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {replaceUnderscores(text)} {/* Aplica a função aqui */}
          </div>
        )}
      </li>

      {/* Renderizando subitens se existirem */}
      {children && isOpen && (
        <ul className={`pl-5 transition-all ${isOpen ? "block" : "hidden"}`}>
          {children}
        </ul>
      )}
    </>
  );
}



// SubMenuItem Component
export function SubMenuItem({ text, href, count, icon }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={href}>
      <li
        className={`flex items-center py-2 px-3 my-1 rounded-md text-gray-600 cursor-pointer transition-all ${expanded ? "justify-start hover:bg-[#FAE7D6]" : "justify-center"}`} // Justifica no centro quando compactada
      >
        {icon && (
          <span className={`mr-2 -ml-3 ${expanded ? "" : "hover:bg-[#FAE7D6] py-2 px-3 -mt-2 -mb-2 rounded-md"} `}>
            {icon}
          </span>
        )}
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-40" : "hidden"}`}
        >
          {text}
        </span>
        {count ? (
          <span className="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded">
            {count}
          </span>
        ) : null}
      </li>
    </Link>
  );
}



