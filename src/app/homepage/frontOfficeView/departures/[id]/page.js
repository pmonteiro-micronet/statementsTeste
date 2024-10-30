"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react"; // Importando a função de logout
import PaginationTable from "@/components/table/paginationTable/page"; // Componente de paginação

export default function Page() {
  const { data: session, status } = useSession(); // Obtém a sessão
  const [reservas, setReservas] = useState([]); // Estado para armazenar as reservas
  const [postSuccessful, setPostSuccessful] = useState(false); // Estado para rastrear o sucesso do POST
  const propertyID = session ? `${session.user.propertyID}` : "Propriedade desconhecida";
  const today = new Date().toISOString().split("T")[0]; // Formata o dia atual como 'yyyy-mm-dd'

  // Estados para paginação
  const [page, setPage] = useState(0); // Página atual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Itens por página

  const handleButtonClick = async () => {
    try {
      // Primeiro, chama a API /api/reservations/info para enviar os dados
      await axios.post("/api/reservations/info", {
        propertyID,
        data: today,
      });

      // Define postSuccessful como true após o POST bem-sucedido
      setPostSuccessful(true);
    } catch (error) {
      console.error(
        "Erro ao enviar os dados:",
        error.response ? error.response.data : error.message
      );
      setPostSuccessful(false); // Se o POST falhar, reseta o estado
    }
  };

  // Efeito colateral que busca as reservas após um POST bem-sucedido
  useEffect(() => {
    const fetchReservas = async () => {
      console.log("Buscando reservas..."); // Log antes da chamada GET
      try {
        const response = await axios.get("/api/reservations/checkouts"); // Chama a API GET
        console.log("Reservas retornadas:", response.data.response);

        // Filtra as reservas para incluir apenas aquelas com requestDateTime igual ao dia atual
        const reservasFiltradas = response.data.response.filter((reserva) => {
          const requestDateTime = new Date(reserva.requestDateTime).toISOString().split("T")[0];
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

  // Função para mudar o número de itens por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reseta a página para a primeira ao mudar o número de itens por página
  };

  // Páginas total com base nas reservas
  const pages = Math.ceil(reservas.length / rowsPerPage);

  // Itens da página atual
  const items = reservas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <main className="flex flex-col flex-grow h-screen">
      <div className="p-4">
      <button className="bg-red-200 h-10 w-32 rounded-lg" onClick={handleButtonClick}>
        See Departures
      </button>

      {/* Exibe a data atual */}
      <h2 className="text-center font-semibold text-xl mt-5">Departure List for {today}</h2>

      {/* Exibe as reservas com paginação */}
      <div className="flex-grow overflow-y-auto">
        {reservas.length > 0 ? (
          <table border="1" className="w-full text-left mt-5 mb-20">
            <thead>
              <tr className="bg-gray-200 h-10">
                <td>Departure</td>
                <td>Last Name</td>
                <td>First Name</td>
                <td>Booker</td>
                <td>Company</td>
                <td>Room</td>
                <td>Notes</td>
                <td>Res. No.</td>
              </tr>
            </thead>
            <tbody>
              {items.map((reserva, index) => {
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
                        <td>{reservaItem.DateCO}</td>
                        <td>{reservaItem.LastName}</td>
                        <td>{reservaItem.FirstName}</td>
                        <td>{reservaItem.Booker}</td>
                        <td>{reservaItem.Company}</td>
                        <td>{reservaItem.RoomNumber}</td>
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

      {/* Footer de Paginação sem padding */}
      <div className="fixed bottom-0 right-0">
        <PaginationTable
          page={page}
          pages={pages}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          items={items}
          setPage={setPage}
          dataCSVButton={items.map((item) => ({
            ID: item.roomTypeID,
            Cod: item.active,
            Abreviatura: item.name,
            Descrição: item.desc,
            Detalhe: item.roomFeaturesDesc,
            Função: item.roomTypePlan,
            GrupoTipologia: item.groupID
          }))}
        />
      </div>
    </main>
  );
}
