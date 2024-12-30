"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@nextui-org/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";

import DepartureInfoForm from "@/components/modals/departures/info/page";
import "../../table.css";
import LoadingBackdrop from "@/components/Loader/page";

import { useRouter } from "next/navigation";
import dayjs from 'dayjs';

export default function InHouses({ params }) {  // Renomeado para InHouses
  const { id } = params;
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

  const router = useRouter();

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

        await axios.get("/api/reservations/info", {
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
      // Faz a requisição para enviar os dados do statement
      const saveResponse = await axios.get("/api/reservations/inHouses/reservations_4_tat", {
        params: {
          ResNo,
          window: windowValue,
          propertyID,
        },
      });

      console.log(`Dados enviados com sucesso para a reserva ${ResNo} com window: ${windowValue}`);
      console.log("Resposta da API ao salvar statement:", saveResponse.data);

      // Aguarda brevemente para dar tempo à base de dados sincronizar o novo registro
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms de atraso opcional

      // Após o envio, busca o recordID do último registro
      const response = await axios.get("/api/get_jsons");
      console.log("Resposta da API ao buscar registros:", response.data);

      // Buscar o último `requestID` na lista de respostas
      const lastRecord = response.data.response.sort((a, b) => b.requestID - a.requestID)[0]; // Ordena por requestID desc
      if (lastRecord && lastRecord.requestID) {
        const lastRecordID = lastRecord.requestID;

        // Redireciona para a página jsonView com os parâmetros na URL
        router.push(`/homepage/jsonView?recordID=${lastRecordID}&propertyID=${propertyID}`);
      } else {
        console.warn("RecordID não encontrado na resposta da API.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // O status 409 indica conflito, ou seja, o registro já existe
        console.warn("Registro já existente, buscando o requestID do registro existente.");

        // Extraia o requestID do erro, se a API o fornecer
        const existingRequestID = error.response.data?.existingRequestID;

        if (existingRequestID) {
          console.log("Registro existente encontrado com requestID:", existingRequestID);

          // Redireciona para a página jsonView com o requestID do registro existente
          router.push(`/homepage/jsonView?recordID=${existingRequestID}&propertyID=${propertyID}`);
        } else {
          console.error(
            "Não foi possível encontrar o requestID do registro existente.",
            error.response.data
          );
        }
      } else {
        console.error(
          "Erro ao enviar os dados ou buscar o recordID:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // Função para pegar as reservas
  useEffect(() => {
    const fetchReservas = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/reservations/inHouses/${propertyID}`);
        console.log("Response completo:", response);
  
        // Parse das reservas
        const reservasArray = response.data.response.flatMap(item => {
          try {
            return JSON.parse(item.requestBody);
          } catch (err) {
            console.error("Erro ao fazer parse de requestBody:", item.requestBody, err);
            return [];
          }
        });
  
        console.log("Reservas após parse (todas as linhas):", reservasArray);
  
        if (reservasArray.length === 0) {
          console.warn("Nenhuma reserva encontrada após parse.");
          setIsLoading(false);
          return; // Interrompe a execução se não houver reservas
        }
  
        // Obtemos a data atual no formato YYYY-MM-DD
        const today = dayjs(currentDate, 'YYYY-MM-DD', true);
        console.log("Data atual formatada:", today.format());
  
        // Filtramos as reservas para pegar apenas as que têm a data no campo requestDateTime igual à data atual
        const reservasFiltradas = reservasArray.filter(reserva => {
          const requestDateTime = dayjs(reserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');
          
          // Compara apenas a data, sem considerar a hora
          const isSameDay = requestDateTime.isSame(today, 'day');
  
          console.log(`Reserva: ${reserva.LastName}, RequestDateTime: ${requestDateTime.format()}`);
          return isSameDay;
        });
  
        console.log("Reservas filtradas pela data atual:", reservasFiltradas);
  
        // Agora vamos agrupar as reservas por 'LastName' e 'Room' e pegar a mais recente de cada grupo
        const reservasMaisRecentes = [];
  
        // Usando um Map para garantir que, para cada combinação LastName + Room, só a reserva mais recente seja adicionada
        const seen = new Map();
  
        reservasFiltradas.forEach(reserva => {
          const key = `${reserva.LastName}-${reserva.Room}`;
          const requestDateTime = dayjs(reserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');
  
          if (!seen.has(key)) {
            seen.set(key, reserva);
          } else {
            const existingReserva = seen.get(key);
            const existingDate = dayjs(existingReserva.requestDateTime, 'YYYY-MM-DD HH:mm:ss');
  
            // Se a reserva atual for mais recente, substituímos a existente
            if (requestDateTime.isAfter(existingDate)) {
              seen.set(key, reserva);
            }
          }
        });
  
        // Agora, obtemos todas as reservas mais recentes
        reservasMaisRecentes.push(...seen.values());
  
        console.log("Reservas mais recentes para o dia de hoje:", reservasMaisRecentes);
        setReservas(reservasMaisRecentes);
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
  const handleRefreshClick = () => {
    sendDataToAPI([today, tomorrowDate]); // Envia os dados ao clicar no botão
  };

  return (
    <main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex justify-between items-center w-full">
          <div className="header-container flex items-center justify-between w-full">
            {/* Div para o conteúdo centralizado */}
            <div className="flex items-center space-x-4 mx-auto">
              <h2 className="text-xl text-textPrimaryColor">{propertyName} : In Houses List</h2>
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

        <div className="mt-5">
          {reservas.length > 0 ? (
            <div className="overflow-auto md:overflow-visible">
              <LoadingBackdrop open={isLoading} />
              {!isLoading && (
                <table className="w-full text-left mb-5 min-w-full md:min-w-0 border-collapse">
                  <thead>
                    <tr className="bg-primary text-white h-12">
                      <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6]"><FaGear size={18} color="white" /></td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">ARRIVAL</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">DEPARTURE</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">LAST NAME</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">FIRST NAME</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">COMPANY</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">NOTES</td>
                      <td className="pl-2 pr-2 border-r border-[#e6e6e6]">RES. NO.</td>
                    </tr>
                  </thead>
                  <tbody>
                  {reservas.map((reserva, index) => {
                      // Aqui, reserva já deve ser um objeto com as propriedades que você precisa
                      return (
                        <tr key={index} className="h-10 border-b border-[#e8e6e6] text-textPrimaryColor text-left hover:bg-primary-50">
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
                                isOpen={true}
                                className="relative z-10 text-textPrimaryColor"
                              >
                                <DropdownItem key="edit" onClick={() => handleOpenModal()}>
                                  Info
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
                                  Statement
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
                          <td className="text-right pr-2 w-28">{reserva.DateCO}</td>
                          <td className="text-right pr-2 w-28">{reserva.DateCO}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-40">{reserva.LastName}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-40">{reserva.FirstName}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-32">{reserva.Company}</td>
                          <td className="pl-2 pr-2 border-r border-[#e6e6e6] max-w-xs truncate">{reserva.Notes}</td>
                          <td className="pr-2 pr-2 border-r border-[#e6e6e6] text-right w-20">{reserva.ResNo}</td>
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
    </main>
  );
}
