"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function QrCodeUserPage() {
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("qrUserData");
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (err) {
        console.error("Erro ao recuperar dados do sessionStorage:", err);
      }
    }
  }, []);

  const handleAdvance = () => {
    const queryParams = new URLSearchParams({
      propertyID: userData.propertyID || "",
      requestID: userData.requestID || "",
      resNo: userData.resNo || "",
      profileID: userData.profileID || "",
    }).toString();

    router.push(`/homepage/frontOfficeView/registrationForm?${queryParams}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Confirmação de Usuário</h1>
      <p>Email: <span className="font-semibold">{userData.email}</span></p>
      <p>Reserva Nº: <span className="font-semibold">{userData.resNo}</span></p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAdvance}
          className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-green-600"
        >
          Avançar
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("qrUserData");
            signOut({ callbackUrl: "/" });
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
