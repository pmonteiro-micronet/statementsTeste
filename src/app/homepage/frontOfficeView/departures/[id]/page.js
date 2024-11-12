"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@nextui-org/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import DepartureInfoForm from "@/components/modals/departures/info/page";
import "../departures.css";
import LoadingBackdrop from "@/components/Loader/page";

export default function Page({ params }) {
  const { id } = params;
  const propertyID = id;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  const [currentDate, setCurrentDate] = useState(today);
  const [reservas, setReservas] = useState([]);
  const [postSuccessful, setPostSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendResSuccess, setSendResSuccess] = useState(false); //estado para envio get statement
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Função para enviar os dados para a API
  const sendDataToAPI = async (dates) => {
    try {
      setIsLoading(true); // Inicia o carregamento
      await axios.post("/api/reservations/info", {
        propertyID,
        data: dates,
      });
      console.log(`Dados enviados para as datas: ${dates.join(", ")}`);
      setPostSuccessful(true);
    } catch (error) {
      console.error(
        "Erro ao enviar os dados:",
        error.response ? error.response.data : error.message
      );
      setPostSuccessful(false);
    } finally {
      setIsLoading(false); // Termina o carregamento
    }
  };

  // Função para enviar os dados para a API
  const sendResToAPI = async (resNumber) => {
    console.log("Enviando resNumber para a API:", resNumber); // Verifica o valor antes de enviar
    const windowValue = 0; // Usar uma variável temporária para armazenar o valor
  
    try {
      await axios.post("/api/reservations/info/specificReservation", {
        resNumber,
        window: windowValue,  // Enviando como "window"
      });
      console.log(`Dados enviados com sucesso para a reserva ${resNumber} com window: ${windowValue}`);
      setSendResSuccess(true);
    } catch (error) {
      console.error(
        "Erro ao enviar os dados:",
        error.response ? error.response.data : error.message
      );
      setSendResSuccess(false);
    }
  };
  console.log(sendResSuccess);

  // Função para pegar as reservas
  useEffect(() => {
    const fetchReservas = async () => {
      setIsLoading(true); // Inicia o carregamento
      try {
        const response = await axios.get("/api/reservations/checkouts");
        console.log("Resposta da API:", response.data); // Log da resposta da API

        let reservasFiltradas = [];

        response.data.response.forEach((reserva) => {
          try {
            if (reserva.requestBody) {
              const requestBody = JSON.parse(reserva.requestBody);
              console.log("requestBody:", requestBody); // Log do requestBody

              for (let key in requestBody) {
                const reservas = requestBody[key];

                if (Array.isArray(reservas)) {
                  const reservasComDataAtual = reservas.filter(item => item.DateCO === currentDate);
                  console.log("Reservas filtradas para a data atual:", reservasComDataAtual); // Log das reservas filtradas

                  reservasFiltradas = [...reservasFiltradas, ...reservasComDataAtual];
                } else {
                  console.warn(`Reservas para a chave ${key} não são um array:`, reservas);
                }
              }
            } else {
              console.warn("requestBody está undefined para a reserva:", reserva);
            }
          } catch (e) {
            console.error("Erro ao fazer o parsing do requestBody:", e);
          }
        });

        // Atualiza o estado com as reservas filtradas
        setReservas(reservasFiltradas);
      } catch (error) {
        console.error(
          "Erro ao buscar as reservas:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setIsLoading(false); // Para o carregamento, independentemente do sucesso ou erro
      }
    };

    fetchReservas();
  }, [currentDate, postSuccessful]); // Recarrega as reservas sempre que a data mudar

  // UseMemo para preparar os dados filtrados de acordo com a paginação
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reservas.slice(start, end); // Filtra as reservas com base na página atual e número de linhas por página
  }, [page, rowsPerPage, reservas]); // A dependência inclui `reservas`, que é onde as reservas filtradas estão

  const pages = Math.ceil(reservas.length / rowsPerPage); // Calcula o número total de páginas com base no total de reservas

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Função chamada quando o botão de refresh é clicado
  const handleRefreshClick = () => {
    sendDataToAPI([today, tomorrowDate]); // Envia os dados ao clicar no botão
  };

  return (
    <main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-[#FAFAFA]">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex justify-between items-center w-full">
          <div className="header-container flex items-center justify-between w-full">
            {/* Div para o conteúdo centralizado (setas e título dinâmico) */}
            <div className="flex items-center space-x-4 mx-auto">
              {/* Seta para voltar para o dia de hoje */}
              {currentDate !== today && (
                <button
                  onClick={() => setCurrentDate(today)}
                  className="p-2 text-gray-500"
                >
                  <IoIosArrowBack size={20} />
                </button>
              )}

              {/* Título dinâmico com a data atual */}
              <h2 className="text-xl">
                {currentDate === today ? `Today: ${today}` : `Tomorrow: ${currentDate}`}
              </h2>

              {/* Seta para avançar para o próximo dia */}
              {currentDate !== tomorrowDate && (
                <button
                  onClick={() => setCurrentDate(tomorrowDate)}
                  className="p-2 text-gray-500"
                >
                  <IoIosArrowForward size={20} />
                </button>
              )}

              {/* Título "Departure List" separado do título dinâmico */}
              <h2 className="text-xl">Departure List</h2>
            </div>

            {/* Botão de refresh alinhado à direita */}
            <div className="flex items-center">
              <button
                onClick={handleRefreshClick} // Aqui chamamos a função para enviar os dados
                className="text-black border border-black bg-white rounded-lg cursor-pointer p-2"
              >
                <MdOutlineRefresh size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {reservas.length > 0 ? (
            <div className="overflow-auto md:overflow-visible">
              <LoadingBackdrop open={isLoading} />
              {!isLoading && (
                <table className="w-full text-left mb-5 min-w-full md:min-w-0 border-collapse">
                  <thead>
                    <tr className="bg-[#e8e6e6] h-12">
                      <td className="pl-2 w-10 border-r border-[#e6e6e6]"><FaGear size={18} color="black" /></td>
                      <td className="pl-2 border-r border-[#e6e6e6]">ROOM</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">LAST NAME</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">FIRST NAME</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">TRAVEL AGENCY</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">COMPANY</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">GROUP</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">NOTES</td>
                      <td className="pl-2 border-r border-[#e6e6e6]">RES. NO.</td>
                      <td className="text-right pr-2">DEPARTURE</td>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((reserva, index) => {
                      // Aqui, reserva já deve ser um objeto com as propriedades que você precisa
                      return (
                        <tr key={index} className="h-10 border-b border-[#e8e6e6] text-left">
                          <td className="pl-1 flex items-start border-r border-[#e6e6e6]">
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  variant="light"
                                  className="flex justify-center items-center w-auto min-w-0  p-0 m-0"
                                >
                                  <BsThreeDotsVertical size={20} className="text-black" />
                                </Button>


                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Static Actions"
                                closeOnSelect={false}
                                isOpen={true}
                              >
                                <DropdownItem key="edit">
                                  <DepartureInfoForm
                                    buttonName={"Ver info"}
                                    buttonColor={"transparent"}
                                    modalHeader={"Reservation"}
                                    formTypeModal={11}
                                    editor={"teste"}
                                    roomNumber={reserva.RoomNumber}  // Passando o roomNumber
                                    dateCO={reserva.DateCO}  // Passando a data de check-out (dateCO)
                                    booker={reserva.Booker}
                                    salutation={reserva.Salutation}
                                    lastName={reserva.LastName}
                                    firstName={reserva.FirstName}
                                    roomType={reserva.RoomType}
                                    resStatus={reserva.ResStatus}
                                    totalPax={reserva.TotalPax}
                                    balance={reserva.Balance}
                                    country={reserva.Country}
                                  />
                                </DropdownItem>
                                <DropdownItem
  key="show"
  onClick={() => {
    console.log("francisco e igor", reserva.ReservationNumber);

    // Verificando se o ReservationNumber existe
    if (reserva.ReservationNumber) {
      // Passando o ReservationNumber para a função sendResToAPI
      sendResToAPI(reserva.ReservationNumber);
    } else {
      console.warn("ReservationNumber não encontrado.");
    }
  }}
>
  Get Statement
</DropdownItem>


                              </DropdownMenu>
                            </Dropdown>
                          </td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.RoomNumber}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.LastName}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.FirstName}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.Booker}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.Company}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.Group}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.Notes}</td>
                          <td className="pl-2 border-r border-[#e6e6e6]">{reserva.ReservationNumber}</td>
                          <td className="text-right pr-2">{reserva.DateCO}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <p>Nenhuma reserva encontrada.</p>
          )}
        </div>

      </div>

      {/* Fixed Pagination Section */}
      <div className="sticky bottom-0 w-full bg-white p-0 m-0">
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
