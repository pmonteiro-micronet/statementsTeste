"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { RxEnter } from "react-icons/rx";
import { CgFormatIndentIncrease } from "react-icons/cg";

import { FaCircleXmark, FaCircleExclamation } from "react-icons/fa6";
import { FaQuestionCircle, FaCheckCircle, FaBed } from "react-icons/fa";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

import ArrivalInfoForm from "@/components/modals/arrivals/info/page";
import "../../table.css";
import LoadingBackdrop from "@/components/Loader/page";

import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";

import { MdCleanHands } from "react-icons/md";

const translations = { en, pt, es };

export default function Arrivals({ params }) {
  const resolvedParams = React.use(params); // Resolve the promise
  const { id } = resolvedParams;
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
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Função para enviar os dados para a API
  const sendDataToAPI = async () => {
    try {
      setIsLoading(true); // Inicia o carregamento

      const propertyResponse = await axios.get(`/api/properties/${propertyID}`);

      if (propertyResponse.data && propertyResponse.data.response && propertyResponse.data.response.length > 0) {
        const mpehotel = propertyResponse.data.response[0].mpehotel;
        console.log('Mpehotel encontrado:', mpehotel);

        // Faz as requisições com delay
        await axios.get("/api/reservations/checkins/reservations_4_tat", {
          params: { mpehotel, propertyID },
        });

        // Aguarda 1 segundo antes de fazer a próxima requisição
        await sleep(1000);

        await axios.get("/api/reservations/inHouses/reservations_4_tat", {
          params: { mpehotel, propertyID },
        });

        // Aguarda mais 1 segundo antes de fazer a última requisição
        await sleep(1000);

        await axios.get("/api/reservations/info", {
          params: { mpehotel, propertyID },
        });

        await sleep(1000);
        setPostSuccessful(true);

      } else {
        console.error('Mpehotel não encontrado para o propertyID:', propertyID);
        setPostSuccessful(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Erro 500: Não conseguimos comunicar com o serviço PMS.");
        setErrorMessage("We were unable to communicate with the PMS service. Please contact support.");
      } else {
        console.log("Erro inesperado:", error.response ? error.response.data : error.message);
        setErrorMessage("We were unable to fulfill your order. Please contact support.");
      }
      setIsErrorModalOpen(true);
      setPostSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  const [locale, setLocale] = useState("pt");

  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"

  // Chama a função sendDataToAPI ao carregar a página
  useEffect(() => {
    sendDataToAPI();
  }, [propertyID]);

  const [selectedReserva, setSelectedReserva] = useState(null);

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReserva(null);
    setIsModalOpen(false);
  };


  // Função para pegar as reservas
  useEffect(() => {
    const fetchReservas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/reservations/checkins/${propertyID}`);
        console.log("Response completo:", response);

        const reservasArray = response.data.response.flatMap(item => {
          try {
            const parsedRequestBody = JSON.parse(item.responseBody);
            const reservations = Array.isArray(parsedRequestBody)
              ? parsedRequestBody.flatMap(data =>
                data.ReservationInfo?.map(reserva => {
                  const guestDetails = data.GuestInfo?.[0]?.GuestDetails?.[0] || {};
                  const addressDetails = data.GuestInfo?.[0]?.Address?.[0] || {};

                  return {
                    requestID: item.requestID,
                    propertyID: item.propertyID,
                    profileID: guestDetails.ProfileID,
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

        console.log("Reservas após parse:", reservasArray);

        const formattedCurrentDate = dayjs(currentDate).startOf('day').format('YYYY-MM-DD');
        const reservasFiltradas = reservasArray.filter(reserva => {
          if (!reserva.DateCI) {
            console.warn("DateCI está indefinido ou vazio para esta reserva:", reserva);
            return false;
          }
          const formattedDateCI = dayjs(reserva.DateCI).startOf('day').format('YYYY-MM-DD');
          return formattedDateCI === formattedCurrentDate;
        });

        console.log("Reservas para a data atual (antes de remover duplicatas):", reservasFiltradas);

        const reservasUnicas = Array.from(
          new Map(reservasFiltradas.map(reserva => [reserva.Room, reserva])).values()
        );

        console.log("Reservas únicas para a data atual:", reservasUnicas);
        setReservas(reservasUnicas);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservas();
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

  const handleRefreshClick = async () => {
    try {
      setIsLoading(true); // Ativa o loading
      await sendDataToAPI([today, tomorrowDate]); // Faz a requisição de dados
      router.refresh(); // Recarrega a página sem alterar a URL
    } catch (error) {
      console.error("Erro ao tentar fazer refresh:", error);
    } finally {
      setIsLoading(false); // Garante que o loading seja desativado
    }
  };


  const fetchPropertyDetails = async (propertyID) => {
    try {
      const response = await axios.get(`/api/properties?propertyID=${propertyID}`);
      if (response.data && response.data.response) {
        return response.data.response[0]; // Supondo que o resultado é uma lista e pegamos o primeiro item
      }
      throw new Error("Nenhuma propriedade encontrada.");
    } catch (error) {
      console.error("Erro ao buscar detalhes da propriedade:", error);
      return null;
    }
  };

  const verifyProperty = async (propertyDetails) => {
    const { propertyServer, propertyPort } = propertyDetails;

    for (let attempts = 0; attempts < 3; attempts++) {
      try {
        const response = await axios.post("/api/verifyProperty", { propertyServer, propertyPort });
        if (response.data.success) return true;
      } catch (error) {
        console.error(`Tentativa ${attempts + 1} falhou para a propriedade ${propertyDetails.propertyName}:`, error);
      }
    }

    return false;
  };

  const handleCheckIn = async (resNo) => {
    try {
      const response = await axios.post(
        '/api/reservations/checkins/updateCheckin',
        { resNo }, // Enviando resNo no body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Check-in atualizado com sucesso:', response.data);
      } else {
        setErrorMessage("Erro ao atualizar check-in");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage("Erro ao atualizar check-in");
      setIsErrorModalOpen(true);
    }
  };

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('');

  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'guestName') {
      const nameA = `${a.LastName}, ${a.FirstName}`.toLowerCase();
      const nameB = `${b.LastName}, ${b.FirstName}`.toLowerCase();

      if (sortOrder === 'asc') return nameA.localeCompare(nameB);
      else return nameB.localeCompare(nameA);
    }
    return 0; // padrão se nenhum campo for selecionado
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    (<main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
      {isLoading && <LoadingBackdrop open={isLoading} />}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex justify-between items-center w-full">
          <div className="header-container flex items-center justify-between w-full">
            {/* Tabs for switching between today and tomorrow */}
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentDate(today)}
                className={`px-4 py-2 ${currentDate === today ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg`}
              >
                {new Date(today).toLocaleDateString()} {/* Exibe a data formatada */}
              </button>
              <button
                onClick={() => setCurrentDate(tomorrowDate)}
                className={`px-4 py-2 ${currentDate === tomorrowDate ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg`}
              >
                {new Date(tomorrowDate).toLocaleDateString()} {/* Exibe a data formatada */}
              </button>
            </div>

            {/* Botão de refresh alinhado à direita */}
            <div className="flex items-center">
              <button
                onClick={handleRefreshClick} // Aqui chamamos a função para enviar os dados
                className="text-white bg-primary rounded-lg cursor-pointer p-2"
              >
                <MdOutlineRefresh size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Div para o conteúdo centralizado (setas e título dinâmico) */}
        <div className="mt-4">
          {/* Título "Arrivals List" separado do título dinâmico */}
          <h2 className="text-lg text-textPrimaryColor">{propertyName} : {t.frontOffice.arrivals.arrivalList}</h2>
        </div>
        <div className="mt-5 flex flex-col h-[calc(100vh-210px)]">

          {isLoading ? (
            <LoadingBackdrop open={isLoading} />
          ) : reservas.length > 0 ? (
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left min-w-max border-collapse">
                <thead className="sticky top-0 z-30">
                  <tr className="bg-primary text-white h-16">
                    <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6] uppercase"><FaGear size={18} color="white" /></td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">
                      <div className="flex items-center justify-center">
                        <FaBed size={23} color="white" />
                      </div>
                    </td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">
                      <MdCleanHands size={18} color="white" />
                    </td>
                    <td
                      className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase cursor-pointer select-none"
                      onClick={() => toggleSort("guestName")}
                    >
                      <div className="flex justify-between items-center gap-1">
                        {t.frontOffice.arrivals.guestName}
                        {sortField === "guestName" ? (
                          sortOrder === "asc" ? (
                            <FaArrowUp size={16} />
                          ) : (
                            <FaArrowDown size={16} />
                          )
                        ) : (
                          <FaArrowDown size={16} />
                        )}
                      </div>
                    </td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase w-64">{t.frontOffice.arrivals.travelAgency}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase w-64">{t.frontOffice.arrivals.company}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.arrivals.group}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.arrivals.notes}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.arrivals.resNo}</td>
                    <td className="pl-2 uppercase">{t.frontOffice.arrivals.arrival}</td>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((reserva, index) => {
                    return (
                      <tr key={index} className="min-h-14 h-14 border-b border-[#e8e6e6] text-left text-textPrimaryColor hover:bg-primary-50">
                        <td className="pl-1 pr-1 w-8 border-r border-[#e6e6e6] align-middle text-center cursor-pointer">
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                variant="light"
                                className="flex justify-center items-center w-full h-full min-w-0 p-0 m-0 z-10"
                              >
                                <BsThreeDotsVertical size={25} className="text-textPrimaryColor" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Static Actions"
                              closeOnSelect={true}
                              className="relative z-10 text-textPrimaryColor"
                            >
                              <DropdownItem key="edit" onClick={() => handleOpenModal(reserva)}>
                                <div className="flex flex-row gap-2">
                                  <IoMdInformationCircle size={15} /> {t.frontOffice.arrivals.info}
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                key="checkIn"
                                onClick={() => handleCheckIn(reserva.ResNo)}
                              >
                                <div className="flex flex-row gap-2">
                                  <RxEnter size={15} /> CheckIn
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                key="show"
                                onClick={async () => {
                                  // Busca os detalhes da propriedade
                                  const propertyDetails = await fetchPropertyDetails(reserva.propertyID);
                                  console.log("Detalhes da propriedade:", propertyDetails);

                                  if (!propertyDetails) {
                                    console.error("Não foi possível encontrar os detalhes da propriedade.");
                                    return;
                                  }

                                  // Verifica se a propriedade está acessível
                                  const isVerified = await verifyProperty(propertyDetails);

                                  if (isVerified) {
                                    // Redireciona caso seja verificado com sucesso
                                    const url = `/homepage/frontOfficeView/registrationForm?propertyID=${reserva.propertyID}&requestID=${reserva.requestID}&resNo=${reserva.ResNo}&profileID=${reserva.profileID}`;

                                    console.log("👉 URL de redirecionamento:", url);
                                    router.push(
                                      `/homepage/frontOfficeView/registrationForm?propertyID=${reserva.propertyID}&requestID=${reserva.requestID}&resNo=${reserva.ResNo}&profileID=${reserva.profileID}`
                                    );
                                  } else {
                                    // Exibe mensagem de erro no modal
                                    setErrorMessage("We were unable to communicate with the PMS service. Please contact support.");
                                    setIsErrorModalOpen(true);
                                  }
                                }}
                              >
                                <div className="flex flex-row gap-2">
                                  <CgFormatIndentIncrease size={16} /> {t.frontOffice.arrivals.registrationForm}
                                </div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>

                          <ArrivalInfoForm
                            buttonName={"Info"}
                            buttonColor={"transparent"}
                            modalHeader={t.frontOffice.infoModal.arrival.reservation.title}
                            formTypeModal={11}
                            roomNumber={selectedReserva?.Room}  // Passando o roomNumber
                            dateCI={selectedReserva?.DateCI}
                            booker={selectedReserva?.Booker}
                            salutation={selectedReserva?.Salutation}
                            lastName={selectedReserva?.LastName}
                            firstName={selectedReserva?.FirstName}
                            roomType={selectedReserva?.RoomType}
                            resStatus={selectedReserva?.RoomStatus}
                            totalPax={selectedReserva?.TotalPax}
                            balance={selectedReserva?.Total}
                            country={selectedReserva?.Country}
                            isBackdropVisible={true}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                          />
                        </td>
                        <td className="pr-2 border-r border-[#e6e6e6] text-right">{reserva.Room}</td>
                        <td className="border-r border-[#e6e6e6] text-center h-full">
                          <div
                            className="flex items-center justify-center h-full"
                            title={reserva.RoomStatus} // Adiciona o tooltip com o status
                          >
                            {(() => {
                              let icon;
                              switch (reserva.RoomStatus) {
                                case "Dirty":
                                  icon = <FaCircleXmark color="red" size={20} />;
                                  break;
                                case "Touched":
                                  icon = <FaCircleExclamation color="orange" size={20} />;
                                  break;
                                case "Checked":
                                  icon = <FaQuestionCircle color="#00CED1" size={20} />;
                                  break;
                                case "Clean":
                                  icon = <FaCheckCircle color="lime" size={20} />;
                                  break;
                                default:
                                  icon = <FaCheckCircle color="lime" size={20} />;
                                  break;
                              }
                              return icon;
                            })()}
                          </div>
                        </td>
                        <td className="pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">
                          {`${reserva.LastName}, ${reserva.FirstName}`}
                        </td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">{reserva.Booker}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">{reserva.Company}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-40 truncate whitespace-nowrap overflow-hidden">{reserva.Group}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-52 max-w-xs truncate whitespace-nowrap overflow-hidden">{reserva.Notes}</td>
                        <td className="h-14 pr-2 pr-2 border-r border-[#e6e6e6] text-right truncate whitespace-nowrap overflow-hidden">{reserva.ResNo}</td>
                        <td className="h-14 text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{reserva.DateCI}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-textLabelColor">{t.frontOffice.arrivals.noReservations}</p>
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
          modalHeader={t.frontOffice.arrivals.attention}
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)} // Fecha o modal quando o erro for resolvido
        />
      )}
    </main>)
  );
}                  