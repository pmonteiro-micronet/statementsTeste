"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";

export default function Page({ params }) {
  const { id } = params; // Acessando o parâmetro id diretamente das props
  const [reservas, setReservas] = useState([]);
  const [postSuccessful, setPostSuccessful] = useState(false);
  const propertyID = id;
  const today = new Date().toISOString().split("T")[0];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log("ID", id);

  const handleButtonClick = async () => {
    try {
      await axios.post("/api/reservations/info", {
        propertyID,
        data: today,
      });
      setPostSuccessful(true);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error.response ? error.response.data : error.message);
      setPostSuccessful(false);
    }
  };

  useEffect(() => {
    const fetchReservas = async () => {
      console.log("Buscando reservas...");
      try {
        const response = await axios.get("/api/reservations/checkouts");
        console.log("Reservas retornadas:", response.data.response);

        const reservasFiltradas = response.data.response.filter((reserva) => {
          const requestDateTime = new Date(reserva.requestDateTime).toISOString().split("T")[0];
          return requestDateTime === today;
        });

        setReservas(reservasFiltradas);
      } catch (error) {
        console.error("Erro ao buscar as reservas:", error.response ? error.response.data : error.message);
      }
    };

    fetchReservas();
  }, [postSuccessful]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pages = Math.ceil(reservas.length / rowsPerPage);
  const items = reservas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <main className="flex flex-col flex-grow h-screen">
      <div className="p-4">
        <button className="bg-red-200 h-10 w-32 rounded-lg" onClick={handleButtonClick}>
          See Departures
        </button>
        <h2 className="text-center font-semibold text-xl mt-5">Departure List for {today}</h2>
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
                  let requestBody;
                  try {
                    requestBody = JSON.parse(reserva.requestBody);
                  } catch (error) {
                    console.error("Erro ao parsear requestBody:", error.message);
                    return null;
                  }

                  return Object.keys(requestBody).map((key) => {
                    const reservasArray = requestBody[key];

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
            GrupoTipologia: item.groupID,
          }))}
        />
      </div>
    </main>
  );
}
