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

import InHousesInfoForm from "@/components/modals/inhouses/info/page";
import "../../table.css";
import LoadingBackdrop from "@/components/Loader/page";

import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";

const translations = { en, pt, es };

export default function InHouses({ params }) {  // Renomeado para InHouses
  const resolvedParams = React.use(params); // Resolve the promise
  const { id } = resolvedParams;
  const propertyID = id;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split("T")[0];

  const [currentDate] = useState(today);
  const [reservas, setReservas] = useState([]);
  const [postSuccessful, setPostSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Controle do modal de erro

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

  const router = useRouter();
  console.log(router);

  const [propertyName, setPropertyName] = useState([]);

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

        setPostSuccessful(true);

        // Aguarda um curto tempo antes de buscar as reservas para garantir que os dados sejam atualizados no backend
        setTimeout(fetchReservas, 1000);

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
    const saveResponse = await axios.get("/api/reservations/info/specificReservation", {
      params: { ResNo, window: windowValue, propertyID },
    });

    console.log(`Dados enviados com sucesso para a reserva ${ResNo} com window: ${windowValue}`);
    console.log("Resposta da API ao salvar statement:", saveResponse.data);

    // 🔹 Pegando o body corretamente, que pode ser objeto ou string
    let updatedRecord = saveResponse.data?.data?.responseBody || saveResponse.data?.data;

    // 🔹 Se for string, parseia para objeto
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

    console.log("UPDATEDRECORD:", updatedRecord);

    // 🔎 Agora guestInfo deve existir dentro da chave "0"
    const guestInfo = Array.isArray(updatedRecord["0"]?.GuestInfo)
      ? updatedRecord["0"].GuestInfo
      : [];

    console.log("GUESTINFO:", guestInfo);

    if (guestInfo.length === 0) {
      console.warn("GuestInfo vazio → não há movimentos para mostrar.");
      setErrorMessage(t.frontOffice.inHouses.errors.windowA);
      setIsErrorModalOpen(true);
      return;
    }

    // Continua fluxo normal: pega requestID fora do array
    const requestID = updatedRecord?.requestID;
    if (requestID) {
      console.log("Statement atualizado com requestID:", requestID);
      router.push(`/homepage/jsonView?recordID=${requestID}&propertyID=${propertyID}`);
    } else {
      console.warn("Resposta da API não contém requestID.");
    }

  } catch (error) {
    console.error("Erro ao enviar os dados ou buscar o recordID:", error.response ? error.response.data : error.message);

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

  // Função para pegar as reservas
  const fetchReservas = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get(`/api/reservations/inHouses/${propertyID}`);
    console.log("Response completo:", response);

    // Parse das reservas adicionando requestID e propertyID
    const reservasArray = response.data.response.flatMap(item => {
      try {
        const parsed = JSON.parse(item.responseBody);

        // Se parsed for array, adiciona os IDs a cada reserva
        return Array.isArray(parsed)
          ? parsed.map(reserva => ({
              ...reserva,
              requestID: item.requestID,
              propertyID: item.propertyID,
            }))
          : [];
      } catch (err) {
        console.error("Erro ao fazer parse de requestBody:", item.responseBody, err);
        return [];
      }
    });

    console.log("Reservas após parse (todas as linhas):", reservasArray);

    if (reservasArray.length === 0) {
      console.warn("Nenhuma reserva encontrada após parse.");
      setIsLoading(false);
      return;
    }

    const today = dayjs(currentDate, 'YYYY-MM-DD', true);
    console.log("Data atual formatada:", today.format());

    const reservasFiltradas = reservasArray.filter(reserva => {
      const requestDateTime = dayjs(reserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');
      const isSameDay = requestDateTime.isSame(today, 'day');
      console.log(`Reserva: ${reserva.LastName}, RequestDateTime: ${requestDateTime.format()}`);
      return isSameDay;
    });

    console.log("Reservas filtradas pela data atual:", reservasFiltradas);

    // Agrupar por LastName + Room e pegar a mais recente
    const seen = new Map();

    reservasFiltradas.forEach(reserva => {
      const key = `${reserva.LastName}-${reserva.Room}`;
      const requestDateTime = dayjs(reserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');

      if (!seen.has(key)) {
        seen.set(key, reserva);
      } else {
        const existingReserva = seen.get(key);
        const existingDate = dayjs(existingReserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');

        if (requestDateTime.isAfter(existingDate)) {
          seen.set(key, reserva);
        }
      }
    });

    const reservasMaisRecentes = Array.from(seen.values());
    console.log("Reservas mais recentes para o dia de hoje:", reservasMaisRecentes);

    setReservas(reservasMaisRecentes);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error.message);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    if (postSuccessful) {
      fetchReservas();
    }
  }, [postSuccessful]);


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

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('');

  const sortedItems = [...reservas].sort((a, b) => {
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

    const fetchPropertyDetails = async (propertyID) => {
      try {
        const response = await axios.get(`/api/properties?propertyID=${propertyID}`);
  
        if (response.data && response.data.response) {
          console.log("RESPOSTA DE PROPERTY DETAILS:", response);
  
          // Busca o objeto no array cujo propertyID seja igual ao que você passou
          const property = response.data.response.find(
            (prop) => prop.propertyID === Number(propertyID)
          );
  
          if (property) {
            return property;
          }
  
          throw new Error("Nenhuma propriedade encontrada com esse ID.");
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
  
  return (
    (<main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
      {isLoading && <LoadingBackdrop open={isLoading} />}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex justify-between items-center w-full">
          <div className="header-container flex items-center justify-between w-full">
            <div className="flex">
              <button
                onClick={() => setCurrentDate(today)}
                className={`px-4 py-2 bg-primary text-white rounded-lg`}
              >
                {new Date(today).toLocaleDateString()}
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={handleRefreshClick}
                className="text-white bg-primary rounded-lg cursor-pointer p-2"
              >
                <MdOutlineRefresh size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg text-textPrimaryColor">{propertyName} : {t.frontOffice.inHouses.title}</h2>
        </div>

        <div className="mt-5 flex flex-col h-[calc(100vh-210px)]">
          {isLoading ? (
            (<LoadingBackdrop open={isLoading} />) // Exibe o carregamento enquanto os dados estão sendo carregados
          ) : reservas.length > 0 ? (
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left min-w-max border-collapse">
                <thead className="sticky top-0 z-30">
                  <tr className="bg-primary text-white h-16">
                    <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6]"><FaGear size={18} color="white" /></td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.arrival}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.departure}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.room}</td>
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
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.company}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.notes}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.inHouses.resNo}</td>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((reserva, index) => {
                    const isOpen = openDropdownIndex === index;
                    // Aqui, reserva já deve ser um objeto com as propriedades que você precisa
                    return (
                      <tr key={index} onClick={() => setOpenDropdownIndex(index)} className="min-h-14 h-14 border-b border-[#e8e6e6] text-textPrimaryColor text-left hover:bg-primary-50">
                        <td className="pl-1 pr-1 w-8 border-r border-[#e6e6e6] align-middle text-center">
                          <div className="flex items-center justify-center w-full h-full">
                            <Dropdown isOpen={isOpen} onOpenChange={(open) => setOpenDropdownIndex(open ? index : null)}>
                              <DropdownTrigger>
                                <Button
                                  variant="light"
                                  className="flex justify-center items-center w-auto min-w-0 p-0 m-0 relative z-10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdownIndex(index);
                                  }}
                                >
                                  <BsThreeDotsVertical size={20} className="text-textPrimaryColor" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Static Actions"
                                closeOnSelect={true}
                                isOpen={true}
                                className="relative z-10 text-textPrimaryColor"
                              >
                                <DropdownItem key="edit" onClick={() => handleOpenModal(reserva)}>
                                  <div className="flex flex-row gap-2">
                                    <IoMdInformationCircle size={15}/> {t.frontOffice.inHouses.info}
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
                                  <CgFormatIndentIncrease size={15}/> {t.frontOffice.inHouses.statement}
                                  </div>
                                </DropdownItem>
                                 <DropdownItem
                                key="rf"
                                onClick={async () => {
                                  // Busca os detalhes da propriedade
                                  const propertyDetails = await fetchPropertyDetails(propertyID);
                                  console.log("PROPERTY ID:", propertyID);
                                  console.log("Detalhes da propriedade:", propertyDetails);

                                  if (!propertyDetails) {
                                    console.error("Não foi possível encontrar os detalhes da propriedade.");
                                    return;
                                  }

                                  // Verifica se a propriedade está acessível
                                  const isVerified = await verifyProperty(propertyDetails);

                                  if (isVerified) {
                                    // Redireciona caso seja verificado com sucesso
                                    const url = `/homepage/frontOfficeView/registrationForm?propertyID=${reserva.propertyID}&requestID=${reserva.requestID}&resNo=${reserva.ResNo}&profileID=${reserva.ProfileID}`;

                                    console.log("👉 URL de redirecionamento:", url);
                                    router.push(
                                      `/homepage/frontOfficeView/registrationForm?propertyID=${reserva.propertyID}&requestID=${reserva.requestID}&resNo=${reserva.ResNo}&profileID=${reserva.ProfileID}`
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
                          </div>

                          <InHousesInfoForm
                            buttonName={t.frontOffice.inHouses.info}
                            buttonColor={"transparent"}
                            modalHeader={"Res. No.: " + selectedReserva?.ResNo}
                            formTypeModal={11}
                            roomNumber={selectedReserva?.Room}
                            dateCI={selectedReserva?.DateCI}
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
                          />

                        </td>
                        <td className="h-14 text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{reserva.DateCI}</td>
                        <td className="h-14 text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{reserva.DateCO}</td>
                        <td className="text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{reserva.Room}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">
                          {`${reserva.LastName}, ${reserva.FirstName}`}
                        </td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-32 truncate whitespace-nowrap overflow-hidden">{reserva.Company}</td>
                        <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] max-w-xs truncate whitespace-nowrap overflow-hidden">{reserva.Notes}</td>
                        <td className="h-14 pr-2 pr-2 border-r border-[#e6e6e6] text-right w-20 truncate whitespace-nowrap overflow-hidden">{reserva.ResNo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-textLabelColor">{t.frontOffice.inHouses.noReservations}</p>
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