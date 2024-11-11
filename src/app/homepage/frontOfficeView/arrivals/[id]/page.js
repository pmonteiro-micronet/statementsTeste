"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"; // Importando a função de logout

export default function Page() {
    const [reservas, setReservas] = useState([]); // Estado para armazenar as reservas
    const [postSuccessful, setPostSuccessful] = useState(false); // Estado para rastrear o sucesso do POST
    const today = new Date().toISOString().split("T")[0]; // Formata o dia atual como 'yyyy-mm-dd'

  
    // Efeito colateral que busca as reservas após um POST bem-sucedido
    useEffect(() => {
      const fetchReservas = async () => {
        console.log("Buscando reservas..."); // Log antes da chamada GET
        try {
          const response = await axios.get("/api/reservations/CI"); // Chama a API GET
          console.log("Reservas retornadas:", response.data.response);
          // Filtra as reservas para incluir apenas aquelas com requestDateTime igual ao dia atual
          const reservasFiltradas = response.data.response.filter((reserva) => {
            // Converte requestDateTime para o formato YYYY-MM-DD
            const requestDateTime = new Date(reserva.requestDateTime)
              .toISOString()
              .split("T")[0]; // Formata a data da reserva
            return requestDateTime === today; // Verifica se é igual ao dia atual
          });
  
          setReservas(reservasFiltradas); // Atualiza o estado com as reservas filtradas
        } catch (error) {
          console.error(
            "Erro ao buscar as reservas:",
            error.response ? error.response.data : error.message
          );
        }
      };
  
      fetchReservas();
    }, [postSuccessful]);

  return (
    <div className="p-4">
      {/* <button className="bg-red-200 h-10 w-32 rounded-lg">
        See Departures
      </button> */}

      {/* Exibe as reservas */}
      <div>
        <h2 className="text-center font-semibold text-xl">Arrivals list</h2>
        {reservas.length > 0 ? (
          <table border="1" className="w-full text-left mt-5">
            <thead>
              <tr className="bg-gray-200 h-10">
                <th>Arrival</th>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Booker</th>
                <th>Company</th>
                <th>Room</th>
                <th>Room status</th>
                <th>Notes</th>
                <th>Res. No.</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva, index) => {
                // Parseia o requestBody para garantir que é um objeto
                let requestBody;
                try {
                  requestBody = JSON.parse(reserva.requestBody); // Tenta converter para objeto
                } catch (error) {
                  console.error("Erro ao parsear requestBody:", error.message);
                  return null;
                }

                // Itera sobre as chaves numéricas (1, 2, 3, etc.) no objeto parsed
                return Object.keys(requestBody).map((key) => {
                  const reservasArray = requestBody[key]; // Valor que deve ser um array

                  // Verifica se reservasArray é um array e itera
                  if (Array.isArray(reservasArray)) {
                    return reservasArray.map((reservaItem, innerIndex) => (
                      <tr key={`${index}-${innerIndex}`} className="h-10 border-2 border-b-gray text-left">
                        <td>{reservaItem.DateCI}</td>
                        <td>{reservaItem.LastName}</td>
                        <td>{reservaItem.FirstName}</td>
                        <td>{reservaItem.Booker}</td>
                        <td>{reservaItem.Company}</td>
                        <td>{reservaItem.RoomNumber}</td>
                        <td>{reservaItem.RoomStatus}</td>
                        <td>{reservaItem.Notes}</td>
                        <td>{reservaItem.ReservationNumber}</td>
                      </tr>
                    ));
                  } else {
                    console.error("reservasArray não é um array:", reservasArray);
                    return null;
                  }
                });
              })}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma reserva encontrada.</p>
        )}
      </div>
    </div>
  );
}
