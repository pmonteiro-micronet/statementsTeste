"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

export default function NavBar({ listItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState(new Set()); // Estado para controlar menus abertos
  const { data: session } = useSession();
  let inactivityTimeout;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = (key) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key); // Fecha o submenu se já estiver aberto
      } else {
        newSet.add(key); // Abre o submenu
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      handleLogout();
    }, 15 * 60 * 1000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  return (
    <nav className="w-full fixed top-0 z-50 flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="font-semibold text-sm">Extensions myPMS</div>

      {/* Menu Toggle Button */}
      <button onClick={toggleMenu} className="text-2xl">
        <TbLayoutSidebarLeftExpand />
      </button>

      {/* Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 overflow-auto">
          {/* Close Button */}
          <button onClick={toggleMenu} className="self-end text-2xl mb-4 text-gray-600">
            &times;
          </button>

          {/* Render Menu Items */}
          <ul>
            {Object.entries(listItems).map(([key, section]) => (
              <li key={key} className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer font-bold text-indigo-800 mb-2"
                  onClick={() => toggleSubmenu(key)}
                >
                  {key}
                  {section.items && (
                    <span className="text-sm text-gray-600">
                      {openMenus.has(key) ? "-" : "+"}
                    </span>
                  )}
                </div>

                {/* Submenu */}
                {openMenus.has(key) && (
                  <ul className="pl-4">
                    {section.items.map((item, index) =>
                      item.items ? (
                        <li key={index} className="mb-2">
                          <span className="font-semibold text-gray-800">{item.label}</span>
                          <ul className="pl-4">
                            {item.items.map((subItem, subIndex) => (
                              <li key={subIndex} className="mb-1">
                                <Link
                                  href={subItem.ref}
                                  className="block py-1 text-indigo-600"
                                  onClick={toggleMenu}
                                >
                                  {subItem.label}
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
                            {item.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Profile and Logout at the bottom */}
          <div className="mt-auto flex flex-col">
            {/* Profile */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                <FaUser />
              </div>
              <div className="ml-3 text-center">
                <p className="font-medium">
                  {session
                    ? `${session.user.firstName} ${session.user.secondName}`
                    : "Usuário Desconhecido"}
                </p>
                <span className="text-xs text-gray-600 ml-3">
                  {session ? session.user.email : "Email Desconhecido"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center text-white bg-red-500 h-10 rounded-lg hover:bg-red-600"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
