"use client"

import React, { useEffect, useState } from "react";
import "./styles.css";
import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";
import { useSession } from "next-auth/react";
const translations = { en, pt, es };

const Homepage = () => {

  const [locale, setLocale] = useState("pt");
const { data: session, status } = useSession();
    console.log("USER", session?.user?.isInternalUser === true);
  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"

  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 min-h-screen p-8 overflow-y-auto"
      >
        <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.homepage.title}</h2>
      </main>
    </div>
  );
};

export default Homepage;
