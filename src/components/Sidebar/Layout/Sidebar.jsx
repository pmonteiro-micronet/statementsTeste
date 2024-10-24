"use client";
import { useContext, createContext, useState } from "react";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import Link from "next/link"; // Importando o Link do Next.js
import { signOut } from "next-auth/react"; // Importando a função de logout

const SidebarContext = createContext();

export default function Sidebar({ children, setExpanded }) {
  const [expanded, setExpandedInternal] = useState(true);

  const handleToggle = () => {
    setExpandedInternal((curr) => !curr);
    setExpanded((curr) => !curr); // Atualiza o estado externo
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" }); // Redireciona para a página de login após logout
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r shadow-sm transition-all duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center">
          <p
            className={`font-semibold text-sm overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Hotel Extensions
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
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Henrique Gaspar</h4>
              <span className="text-xs text-gray-600">
                henriquegaspar14@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 mx-3 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}

// src/components/Sidebar/Layout/Sidebar.tsx
export function SidebarItem({ icon, text, active, alert, children }) {
  const { expanded } = useContext(SidebarContext);
  const [isOpen, setIsOpen] = useState(false); // Estado para controle do submenu

  return (
    <>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
        onClick={() => {
          if (children) setIsOpen((prev) => !prev); // Alterna o submenu se houver filhos
        }}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
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

// Inside SubMenuItem component
export function SubMenuItem({ text, filter }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link href={`/homepage/filtros/${filter}`}>
      <li
        className={`flex items-center py-2 pl-3 my-1 rounded-md hover:bg-indigo-50 text-gray-600 cursor-pointer`}
      >
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-40" : "w-0"
          }`}
        >
          {text}
        </span>
      </li>
    </Link>
  );
}
