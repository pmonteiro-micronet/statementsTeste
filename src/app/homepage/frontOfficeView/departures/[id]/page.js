"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { IoMdInformationCircle } from "react-icons/io";
import { CgFormatIndentIncrease } from "react-icons/cg";

// import DepartureInfoForm from "@/components/modals/departures/info/page";
import "../../table.css";
import LoadingBackdrop from "@/components/Loader/page";

import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";

const translations = { en, pt, es };

export default function Page({ params }) {
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
console.log(isModalOpen);
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
        //teste

        await axios.get("/api/reservations/info", { //vai buscar as reservas para hoje e amanha
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

  // Chama a função sendDataToAPI ao carregar a página
  useEffect(() => {
    sendDataToAPI();
  }, [propertyID]);

  const sendResToAPI = async (ResNo) => {
  console.log("Enviando ResNumber para a API:", ResNo);
  const windowValue = 0;

  try {
    // 🔹 Faz a requisição para buscar dados da reserva
    const saveResponse = await axios.get("/api/reservations/info/specificReservation", {
      params: { ResNo, window: windowValue, propertyID },
    });

    console.log(`Dados enviados com sucesso para a reserva ${ResNo} com window: ${windowValue}`);
    console.log("Resposta da API:", saveResponse.data);

    // 🔹 Captura o corpo da resposta (pode ser objeto ou string)
    let updatedRecord = saveResponse.data?.data?.responseBody || saveResponse.data?.data;

    if (typeof updatedRecord === "string") {
      try {
        updatedRecord = JSON.parse(updatedRecord);
      } catch (err) {
        console.error("Erro ao fazer parse do JSON da API:", err);
        setErrorMessage("Erro ao processar os dados da reserva.");
        setIsErrorModalOpen(true);
        return;
      }
    }

    console.log("UPDATED RECORD:", updatedRecord);

    // 🔹 Pega GuestInfo dentro do objeto retornado
    const guestInfo = Array.isArray(updatedRecord?.["0"]?.GuestInfo)
      ? updatedRecord["0"].GuestInfo
      : [];

    console.log("GUESTINFO:", guestInfo);

    // ⚠️ Se não houver movimentos, mostra erro e encerra
    if (guestInfo.length === 0) {
      console.log("GuestInfo vazio → não há movimentos para mostrar.");
      setErrorMessage(t.frontOffice.inHouses.errors.windowA);
      setIsErrorModalOpen(true);
      return;
    }

    // 🔹 Se tudo ok, obtém o requestID e redireciona
    const updatedRequestID = updatedRecord?.requestID;
    if (updatedRequestID) {
      console.log("Statement atualizado com requestID:", updatedRequestID);
      router.push(`/homepage/jsonView?recordID=${updatedRequestID}&propertyID=${propertyID}`);
    } else {
      console.warn("Resposta da API não contém requestID.");
    }

  } catch (error) {
    console.error("Erro ao enviar dados ou buscar recordID:", error.response ? error.response.data : error.message);

    if (error.response) {
      if (error.response.status === 409) {
        console.warn("Registro já existente, buscando o requestID do registro existente.");
        const existingRequestID = error.response.data?.existingRequestID;

        if (existingRequestID) {
          console.log("Registro existente encontrado com requestID:", existingRequestID);
          router.push(`/homepage/jsonView?recordID=${existingRequestID}&propertyID=${propertyID}`);
        } else {
          console.error("Não foi possível encontrar o requestID do registro existente.");
        }

      } else if (error.response.status === 500) {
        setErrorMessage(t.frontOffice.inHouses.errors.noCommunication);
        setIsErrorModalOpen(true);

      } else {
        console.log("Erro inesperado:", error.response.data);
        setErrorMessage(t.frontOffice.inHouses.errors.support);
        setIsErrorModalOpen(true);
      }

    } else {
      console.log("Erro inesperado:", error.message);
      setErrorMessage(t.frontOffice.inHouses.errors.support);
      setIsErrorModalOpen(true);
    }
  }
};


  const [selectedReserva, setSelectedReserva] = useState(null);

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva); // Armazena os dados da reserva clicada
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReserva(null); // Limpa os dados ao fechar a modal
    window.location.reload(); // Recarrega a página
  };
console.log(selectedReserva, setSelectedReserva, handleOpenModal, handleCloseModal);
  // Função para pegar as reservas
  useEffect(() => {
    const fetchReservas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/reservations/checkouts/${propertyID}`);
        console.log("Response completo:", response);

        // Combinar todos os requestBody dentro de response.data.response
        const reservasArray = response.data.response.flatMap(item => {
          try {
            return JSON.parse(item.responseBody);
          } catch (err) {
            console.error("Erro ao fazer parse de requestBody:", item.responseBody, err);
            return [];
          }
        });

        console.log("Reservas após parse (todas as linhas):", reservasArray);

        // Se nenhuma reserva for encontrada
        if (reservasArray.length === 0) {
          console.warn("Nenhuma reserva encontrada após parse.");
          return;
        }

        // Filtrar reservas pela data atual
        const formattedCurrentDate = dayjs(currentDate).format('YYYY-MM-DD');
        const reservasFiltradas = reservasArray.filter(reserva => {
          if (!reserva.DateCO) {
            console.warn("DateCO está indefinido ou vazio para esta reserva:", reserva);
            return false;
          }

          const formattedDateCO = dayjs(reserva.DateCO).format('YYYY-MM-DD');
          return formattedDateCO === formattedCurrentDate;
        });

        console.log("Reservas para a data atual (antes de remover duplicatas):", reservasFiltradas);

        // Remover duplicatas com base no número da reserva (ResNo)
        const reservasUnicas = Array.from(
          new Map(reservasFiltradas.map(reserva => [reserva.ResNo, reserva])).values()
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
  }, [page, rowsPerPage, reservas]); // A dependência inclui `reservas`, que é onde as reservas filtradas estão

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
            <div className="flex justify-center mt-4">
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
          {/* Título "Departures List" separado do título dinâmico */}
          <h2 className="text-lg text-textPrimaryColor">{propertyName} : {t.frontOffice.departures.departureList}</h2>
        </div>

        <div className="mt-5 flex flex-col h-[calc(100vh-210px)]">
          {isLoading ? (
            (<LoadingBackdrop open={isLoading} />) 
          ) : reservas.length > 0 ? (
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left min-w-max border-collapse">
                <thead className="sticky top-0 z-30">
                  <tr className="bg-primary text-white h-16">
                    <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6]"><FaGear size={18} color="white" /></td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.departures.room}</td>
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
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.departures.travelAgency}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase w-64">{t.frontOffice.arrivals.company}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.departures.group}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.departures.notes}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.departures.resNo}</td>
                    <td className="pl-2 uppercase">{t.frontOffice.departures.departure}</td>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((reserva, index) => {
                    // Aqui, reserva já deve ser um objeto com as propriedades que você precisa
                    return (
                      <tr key={index} className="min-h-14 h-14 border-b border-[#e8e6e6] text-left text-textPrimaryColor hover:bg-primary-50">
                        <td className="h-14 pl-1 pr-1 w-8 border-r border-[#e6e6e6] align-middle text-center cursor-pointer">
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
                              isOpen={true}
                              className="relative z-10 text-textPrimaryColor"
                            >
                               <DropdownItem
                                  key="edit"
                                  onClick={() => {
                                    const queryParams = new URLSearchParams({
                                      room: reserva?.Room || '',
                                      dateCO: reserva?.DateCO || '',
                                      booker: reserva?.Booker || '',
                                      salutation: reserva?.Salutation || '',
                                      lastName: reserva?.LastName || '',
                                      firstName: reserva?.FirstName || '',
                                      roomType: reserva?.RoomType || '',
                                      resStatus: reserva?.resStatus || '',
                                      childs: reserva?.Childs || '',
                                      adults: reserva?.Adults || '',
                                      balance: reserva?.balance || '',
                                      country: reserva?.Country || ''
                                    }).toString();
                                    router.push(`/homepage/frontOfficeView/info?${queryParams}`);
                                  }}
                                >
                                  <div className="flex flex-row gap-2">
                                    <IoMdInformationCircle size={15} /> {t.frontOffice.inHouses.info}
                                  </div>
                                </DropdownItem>
                              <DropdownItem
                                key="show"
                                onClick={() => {
                                  if (reserva.ResNo) {
                                    sendResToAPI(reserva.ResNo);
                                  } else {
                                    console.warn("ReservationNumber não encontrado.");
                                  }
                                }}
                              >
                                <div className="flex flex-row gap-2">
                                  <CgFormatIndentIncrease size={15} /> {t.frontOffice.departures.statement}
                                </div>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                          {/* <DepartureInfoForm
                            buttonName={"Info"}
                            buttonColor={"transparent"}
                            modalHeader={`${t.frontOffice.infoModal.departure.title} ${selectedReserva?.ResNo}`}
                            formTypeModal={11}
                            roomNumber={selectedReserva?.Room}  // Passando o roomNumber
                            dateCO={selectedReserva?.DateCO}  // Passando a data de check-out (dateCO)
                            booker={selectedReserva?.Booker}
                            salutation={selectedReserva?.Salutation}
                            lastName={selectedReserva?.LastName}
                            firstName={selectedReserva?.FirstName}
                            roomType={selectedReserva?.RoomType}
                            resStatus={selectedReserva?.resStatus}
                            childs={selectedReserva?.Childs}
                            adults={selectedReserva?.Adults}
                            balance={selectedReserva?.balance}
                            country={selectedReserva?.Country}
                            isBackdropVisible={true}
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                          /> */}
                        </td>
                        <td className="h-14 pr-2 border-r border-[#e6e6e6] text-right truncate whitespace-nowrap overflow-hidden">{reserva.Room}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">
                          {`${reserva.LastName}, ${reserva.FirstName}`}
                        </td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">{reserva.Booker}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">{reserva.Company}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-40truncate whitespace-nowrap overflow-hidden">{reserva.Group}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-64 max-w-xs truncate whitespace-nowrap overflow-hidden">{reserva.Notes}</td>
                        <td className="h-14 pr-2 pr-2 border-r border-[#e6e6e6] text-righttruncate whitespace-nowrap overflow-hidden">{reserva.ResNo}</td>
                        <td className="h-14 text-right pr-2 truncate whitespace-nowrap overflow-hidden">{reserva.DateCO}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-textLabelColor">{t.frontOffice.departures.noReservations}</p>
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
          modalHeader={t.frontOffice.departures.attention}
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)} // Fecha o modal quando o erro for resolvido
        />
      )}
    </main>)
  );
}
