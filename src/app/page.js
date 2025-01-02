// src/app/page.js
'use client';

import { redirect } from "next/navigation";
import { useState, useEffect } from "react"; // Adicionando useEffect
export default function Home() {
  const [selectedHotelID, setSelectedHotelID] = useState(""); // Estado do Hotel ID

  // Recupera o Hotel ID do localStorage ao carregar a página
  useEffect(() => {
    const savedHotelID = localStorage.getItem("selectedHotelID"); // Busca o ID salvo
    if (savedHotelID) {
      setSelectedHotelID(savedHotelID); // Define o ID no estado
    } else {
      setSelectedHotelID("defaultHotelID"); // ID padrão, caso não haja nenhum salvo
    }
  }, []); // Executa apenas uma vez no carregamento
  // Redireciona para a página desejada
  redirect(`/homepage/frontOfficeView/${selectedHotelID}`);
}
