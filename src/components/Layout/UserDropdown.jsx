import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { RiHotelFill } from "react-icons/ri";
import { FaUser, FaMoon, FaGlobe, FaSignOutAlt } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

import ProfileModalForm from "@/components/modals/user/profileModal";

const UserModal = ({
    isOpen,
    onClose,
    isAdmin,
    t,
    isDarkMode,
    toggleTheme,
    language,
    handleLanguageChange,
    handleLogout,
}) => {
    const modalRef = useRef(null);

    // Fecha o modal clicando fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="absolute bottom-16 left-10 right-2 z-50"
        >
            <div
                ref={modalRef}
                className="bg-background shadow-lg rounded-md p-4 w-60 border border-gray-200 text-textPrimaryColor"
            >
                <ul className="space-y-2">
                    <li className={isAdmin ? "" : "opacity-50 pointer-events-none"}>
                        <div className="flex items-center gap-3 text-sm">
                            <RiHotelFill size={15} />
                            <Link href="/homepage/allProperties">All Properties</Link>
                        </div>
                    </li>
                    <li className={isAdmin ? "" : "opacity-50 pointer-events-none"}>
                        <div className="flex items-center gap-3 text-sm">
                            <FaUser />
                            <Link href="/homepage/allProfiles">All Profiles</Link>
                        </div>
                    </li>
                    <li>
                        <ProfileModalForm
                            formTypeModal={11}
                            buttonName={"Profile Settings"}
                            buttonIcon={<FaUser />}
                            modalHeader={"Profile Settings"}
                            buttonColor={"transparent"}
                        />
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="text-sm">{t.navbar.text.viewMode}</span>
                        <button
                            onClick={toggleTheme}
                            className="relative w-16 h-6 bg-gray-300 rounded-full flex items-center"
                        >
                            <span
                                className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition ${isDarkMode ? "translate-x-8" : "translate-x-0"} z-10`}
                            />
                            <MdSunny
                                className={`absolute left-1 text-gray-500 text-xs ${isDarkMode ? "opacity-0" : "opacity-100"}`}
                            />
                            <FaMoon
                                className={`absolute right-1 text-gray-500 text-xs ${isDarkMode ? "opacity-100" : "opacity-0"}`}
                            />
                        </button>
                    </li>
                    <li className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm">
                            <FaGlobe />
                            {t.navbar.text.language}
                        </span>
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="bg-transparent outline-none text-sm"
                        >
                            <option value="pt">Pt</option>
                            <option value="en">En</option>
                            <option value="es">Es</option>
                        </select>
                    </li>
                    <li
                        onClick={handleLogout}
                        className="flex items-center text-red-500 cursor-pointer text-sm"
                    >
                        <FaSignOutAlt className="mr-2" />
                        {t.navbar.text.logout}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserModal;
