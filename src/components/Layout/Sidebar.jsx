"use client";
import { useContext, createContext, useState, useEffect } from "react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import Link from "next/link"; // Importando o Link do Next.js
import { signOut, useSession } from "next-auth/react"; // Importando a função de logout
import { useRouter } from "next/navigation"; // Importando o hook de navegação
import { FaSignOutAlt } from "react-icons/fa"; // Importa o ícone de logout
import { FaUser } from "react-icons/fa";

const SidebarContext = createContext();
let inactivityTimeout;

export default function Sidebar({ children, setExpanded }) {
  const [expanded, setExpandedInternal] = useState(true);
  const { data: session, status } = useSession(); // Obtém a sessão
  const router = useRouter(); // Obtém o router

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
    // Limpa o timeout anterior
    clearTimeout(inactivityTimeout);

    // Define um novo timeout de 15 minutos
    inactivityTimeout = setTimeout(() => {
      handleSignOut();
    }, 15 * 60 * 1000); // 15 minutos em milissegundos
  };

  const handleSignOut = () => {
    // Faz logout do usuário
    signOut();
  };

  useEffect(() => {
    // Adiciona listeners para eventos de atividade do usuário
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Define o timeout inicial
    resetInactivityTimer();

    // Remove listeners ao desmontar o componente
    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      clearTimeout(inactivityTimeout);
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


  return (
    <aside
      className={`fixed top-0 left-0 bg-white border-r shadow-sm transition-all duration-300 ${expanded ? "w-64" : "w-16"
        }`}
      style={{
        height: 'calc(var(--vh, 1vh) * 100)', // Usa a altura visível calculada
        maxHeight: 'calc(var(--vh, 1vh) * 100)',
        overflowY: 'auto', // Caso o conteúdo exceda, permite scroll apenas dentro da sidebar
      }}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <p
            className={`font-semibold text-sm overflow-hidden transition-all ${expanded ? "w-64" : "w-0"
              }`}
          >
            Extensions myPMS
          </p>
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <TbLayoutSidebarLeftExpand />
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[#FAE7D6]">
            <FaUser style={{ color: "#FC9D25" }} />
          </div>

          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"
              }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">
                {session
                  ? `${session.user.firstName} ${session.user.secondName}`
                  : "Usuário Desconhecido"}
              </h4>
              <span className="text-xs text-gray-600">
                {session ? session.user.email : "Email Desconhecido"}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Logout */}
        <li
          className={`flex items-center mx-3 py-[9px] mb-3 mt-1 rounded-md cursor-pointer transition-colors group hover:bg-red-600 ${expanded ? "px-3" : "px-2"
            } bg-red-500 text-white`} // Cor de fundo e texto
          onClick={handleLogout}
        >
          <div className={`flex items-center justify-between w-full`}>
            <div className={`flex items-center`}>
              <FaSignOutAlt className="mr-2" /> {/* Ícone de logout */}
              <span className={`${expanded ? "block" : "hidden"}`}>Logout</span>
            </div>
          </div>
        </li>
      </nav>
    </aside>
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
export function SubMenuItem({ text, href, count }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={href}>
      <li
        className="flex items-center py-2 pl-3 my-1 rounded-md hover:bg-[#FAE7D6] text-gray-600 cursor-pointer"
      >
        <span
          className={`overflow-hidden transition-all ${expanded ? "w-40" : "w-0"}`}
        >
          {replaceUnderscores(text)} {/* Aplica a função aqui */}
        </span>
        {/* Badge count */}
        {count !== undefined && (
          <span
            className="ml-auto mr-3 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-semibold"
          >
            {count}
          </span>
        )}
      </li>
    </Link>
  );
}

