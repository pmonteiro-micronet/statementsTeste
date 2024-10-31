// NavBar.jsx

"use client";
import { useState } from "react";
import Link from "next/link";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

export default function NavBar({ listItems }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  return (
    <nav className="w-full fixed top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="font-semibold text-indigo-800">Hotel Extensions</div>

      {/* Menu Toggle Button */}
      <button onClick={toggleMenu} className="text-2xl">
        <TbLayoutSidebarLeftExpand />
      </button>

      {/* Fullscreen Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-6">
          {/* Close Button */}
          <button onClick={toggleMenu} className="self-end text-2xl mb-4 text-gray-600">
            &times;
          </button>

          {/* Render Menu Items from listItems */}
          {Object.entries(listItems).map(([key, section]) => (
            <div key={key} className="mb-4">
              <div className="font-bold text-indigo-800 mb-2">{key}</div>
              {section.items.map((item, index) =>
                item.items ? (
                  <div key={index} className="pl-4">
                    <span className="text-gray-800 font-semibold">{item.label}</span>
                    <div className="pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.ref} className="block py-1 text-indigo-600" onClick={toggleMenu}>
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={index} href={item.ref} className="py-2 text-indigo-600 block" onClick={toggleMenu}>
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}

          {/* Profile and Logout */}
          <div className="flex items-center mt-8">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800">
              <FaUser />
            </div>
            <div className="ml-3">
              <p>{session ? `${session.user.firstName} ${session.user.secondName}` : "Usuário Desconhecido"}</p>
              <span className="text-xs text-gray-600">
                {session ? session.user.email : "Email Desconhecido"}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} className="flex items-center mt-5 text-red-500 hover:text-red-700">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
