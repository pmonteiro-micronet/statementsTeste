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
import "../../table.css";
import LoadingBackdrop from "@/components/Loader/page";

import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";

export default function Arrivals({ params }) {
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
  // const [sendResSuccess, setSendResSuccess] = useState(false); //estado para envio get statement
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Controle do modal de erro

  const [propertyName, setPropertyName] = useState([]);
  console.log(postSuccessful);
  // Função para enviar os dados para a API
  const sendDataToAPI = async () => {
    try {
      setIsLoading(true); // Inicia o carregamento

      // Faz a requisição GET à API de properties com o propertyID passado
      const propertyResponse = await axios.get(`/api/properties/${propertyID}`);

      // Verifica se a resposta contém o 'mpehotel' e executa o que for necessário
      if (propertyResponse.data && propertyResponse.data.response && propertyResponse.data.response.length > 0) {
        const mpehotel = propertyResponse.data.response[0].mpehotel;
        console.log('Mpehotel encontrado:', mpehotel);

        await axios.get("/api/reservations/checkins/reservations_4_tat", {
          params: {
            mpehotel,
            propertyID
          },
        });

        setPostSuccessful(true);
      } else {
        console.error('Mpehotel não encontrado para o propertyID:', propertyID);
        setPostSuccessful(false);
      }
    } catch (error) {
      console.error(
        "Erro ao enviar os dados:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage("We were unable to fulfill your order. Please contact support.");
      setIsErrorModalOpen(true);
      setPostSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    let timeoutId = null;
  
    const fetchReservas = async (isInitialCall = false) => {
      // Exibe o loading apenas na primeira chamada ou se estiver demorando
      if (isInitialCall) {
        setIsLoading(true);
      } else {
        // Exibe o loading apenas se demorar mais de 2 segundos
        timeoutId = setTimeout(() => setIsLoading(true), 2000);
      }
  
      try {
        const response = await axios.get(`/api/reservations/checkins/${propertyID}`);
        console.log("Response completo:", response);
  
        const reservasArray = response.data.response.flatMap(item => {
          try {
            const parsedRequestBody = JSON.parse(item.requestBody);
  
            const reservations = Array.isArray(parsedRequestBody)
              ? parsedRequestBody.flatMap(data =>
                data.ReservationInfo?.map(reserva => {
                  const guestDetails = data.GuestInfo?.[0]?.GuestDetails?.[0] || {};
                  const addressDetails = data.GuestInfo?.[0]?.Address?.[0] || {};
  
                  return {
                    requestID: item.requestID,
                    propertyID: item.propertyID,
                    DateCI: reserva.DateCI,
                    Booker: reserva.Booker,
                    Company: reserva.Company,
                    Group: reserva.Group,
                    Room: reserva.Room,
                    ResNo: reserva.ResNo,
                    Notes: reserva.Notes,
                    RoomStatus: reserva.RoomStatus,
                    RoomType: reserva.RoomType,
                    TotalPax: (reserva.Adults || 0) + (reserva.Childs || 0),
                    Price: reserva.Price,
                    CityTax: reserva.CityTax,
                    Total: reserva.Total,
                    Salutation: guestDetails.Salution,
                    LastName: guestDetails.LastName,
                    FirstName: guestDetails.FirstName,
                    Country: addressDetails.Country,
                    Street: addressDetails.Street,
                    PostalCode: addressDetails.PostalCode,
                    City: addressDetails.City,
                    Region: addressDetails.Region,
                  };
                }) || []
              )
              : [];
  
            return reservations;
          } catch (err) {
            console.error("Erro ao processar requestBody ou reservas:", err);
            return [];
          }
        });
  
        const formattedCurrentDate = dayjs(currentDate).startOf('day').format('YYYY-MM-DD');
        const reservasFiltradas = reservasArray.filter(reserva => {
          if (!reserva.DateCI) {
            console.warn("DateCI está indefinido ou vazio para esta reserva:", reserva);
            return false;
          }
          const formattedDateCI = dayjs(reserva.DateCI).startOf('day').format('YYYY-MM-DD');
          return formattedDateCI === formattedCurrentDate;
        });
  
        const reservasUnicas = Array.from(
          new Map(reservasFiltradas.map(reserva => [reserva.Room, reserva])).values()
        );
  
        setReservas(reservasUnicas);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error.message);
      } finally {
        clearTimeout(timeoutId); // Cancela o timeout caso a chamada seja concluída antes dos 2 segundos
        setIsLoading(false);
      }
    };
  
    // Faz o fetch inicial
    fetchReservas(true);
  
    // Configura o polling para buscar dados a cada 5 segundos (5000ms)
    const intervalId = setInterval(() => fetchReservas(false), 5000);
  
    // Limpa o intervalo e timeout quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [currentDate, propertyID]);
  
  


  useEffect(() => {
    const fetchHotelName = async () => {
      try {
        const response = await axios.get(`/api/properties/${propertyID}`);

        // Verifique se a resposta contém os dados esperados
        if (response.data?.response?.length > 0) {
          const propertyName = response.data.response[0].propertyName; // Obtém o propertyName
          console.log("Property Name:", propertyName); // Exibe o propertyName no console
          setPropertyName(propertyName);
        } else {
          console.warn("Nenhum dado encontrado para o propertyID:", propertyID);
        }
      } catch (error) {
        console.error(
          "Erro ao buscar o nome do hotel:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchHotelName();
  }, [propertyID]);


  // UseMemo para preparar os dados filtrados de acordo com a paginação
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reservas.slice(start, end); // Filtra as reservas com base na página atual e número de linhas por página
  }, [page, rowsPerPage, reservas]); // A dependência inclui reservas, que é onde as reservas filtradas estão

  const pages = Math.ceil(reservas.length / rowsPerPage); // Calcula o número total de páginas com base no total de reservas

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Função chamada quando o botão de refresh é clicado
  // const handleRefreshClick = () => {
  //   sendDataToAPI([today, tomorrowDate]); // Envia os dados ao clicar no botão
  // };

  useEffect(() => {
    sendDataToAPI(); // Chama a função automaticamente ao carregar a página
  }, []); // O array de dependências vazio garante que seja executado apenas uma vez
  
  return (
    <main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
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
              <h2 className="text-xl text-textPrimaryColor">
                {currentDate === today ? `Today: ${today}` : `Tomorrow: ${currentDate}`}
              </h2>

              {/* Seta para avançar para o próximo dia */}
              {currentDate !== tomorrowDate && (
                <button
                  onClick={() => setCurrentDate(tomorrowDate)}
                  className="p-2 text-textPrimaryColor"
                >
                  <IoIosArrowForward size={20} />
                </button>
              )}

              {/* Título "Arrivals List" separado do título dinâmico */}
              <h2 className="text-xl text-textPrimaryColor">{propertyName} : Arrivals List</h2>
            </div>

            {/* Botão de refresh alinhado à direita */}
            <div className="flex items-center">
              <button
                // onClick={handleRefreshClick} // Aqui chamamos a função para enviar os dados
                className="text-white bg-primary rounded-lg cursor-pointer p-2"
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
                    <tr className="bg-primary text-white h-12">
                      <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6]"><FaGear size={18} color="white" /></td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">ROOM</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">ROOM STATUS</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">LAST NAME</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">FIRST NAME</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">TRAVEL AGENCY</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">COMPANY</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">GROUP</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">NOTES</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">RES. NO.</td>
                      <td className="pl-2">ARRIVAL</td>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((reserva, index) => {
                      // Aqui, reserva já deve ser um objeto com as propriedades que você precisa
                      return (
                        <tr key={index} className="h-10 border-b border-[#e8e6e6] text-left text-textPrimaryColor hover:bg-primary-50">
                          <td className="pl-1 flex items-start border-r border-[#e6e6e6] relative z-10">
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  variant="light"
                                  className="flex justify-center items-center w-auto min-w-0 p-0 m-0 relative"
                                >
                                  <BsThreeDotsVertical size={20} className="text-textPrimaryColor" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Static Actions"
                                closeOnSelect={true}
                                className="relative z-10 text-textPrimaryColor"
                              >
                                <DropdownItem key="edit" onClick={() => handleOpenModal()}>
                                  Info
                                </DropdownItem>
                                <DropdownItem
                                  key="show"
                                  onClick={() =>
                                    router.push(`/homepage/frontOfficeView/registrationForm?propertyID=${reserva.propertyID}&requestID=${reserva.requestID}&resNo=${reserva.ResNo}`)
                                  }
                                >
                                  Registration Form
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>

                            <DepartureInfoForm
                              buttonName={"Info"}
                              buttonColor={"transparent"}
                              modalHeader={"Reservation"}
                              formTypeModal={11}
                              roomNumber={reserva.Room}  // Passando o roomNumber
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
                              isBackdropVisible={false}
                              isOpen={isModalOpen}
                              onClose={handleCloseModal}
                            />
                          </td>
                          <td className="pr-2 border-r border-[#e6e6e6] text-right">{reserva.Room}</td>
                          <td className="pr-2 border-r border-[#e6e6e6] text-right">{reserva.RoomStatus}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6]">{reserva.LastName}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6]">{reserva.FirstName}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6]">{reserva.Booker}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] ">{reserva.Company}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-40">{reserva.Group}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-52 max-w-xs truncate">{reserva.Notes}</td>
                          <td className="pr-2 pr-2 border-r border-[#e6e6e6] text-right">{reserva.ResNo}</td>
                          <td className="text-right pr-2 w-28">{reserva.DateCI}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <p className="text-textLabelColor">No reservations found.</p>
          )}
        </div>

      </div>

      {/* Fixed Pagination Section */}
      <div className="sticky bottom-0 w-full bg-white p-0 m-0 pagination-container">
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
      {/** Modal de erro */}
      {isErrorModalOpen && errorMessage && (
        <ErrorRegistrationForm
          modalHeader="Attention"
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)} // Fecha o modal quando o erro for resolvido
        />
      )}
    </main>
  );
}