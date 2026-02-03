"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import {  DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
// import { CiViewList } from "react-icons/ci";
import { MdCleanHands } from "react-icons/md";
import {
  CiCircleCheck,
  CiWarning,
} from "react-icons/ci";
import { AiFillInfoCircle } from "react-icons/ai";

import { FaCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";


import { FaGear } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

import HousekeepingInfoForm from "@/components/modals/housekeeping/info/page";
import HousekeepingMaintenanceForm from "@/components/modals/housekeeping/maintenance/page";
import HousekeepingInsertMaintenanceForm from "@/components/modals/housekeeping/insertMaintenance/page";

// import HousekeepingTracesForm from "@/components/modals/housekeeping/traces/page";

import "../../frontOfficeView/table.css";
import LoadingBackdrop from "@/components/Loader/page";
import { PiCoatHanger } from "react-icons/pi";

// import dayjs from 'dayjs';

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";

import { MdComputer } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { HiMiniArrowsUpDown } from "react-icons/hi2";

import { GoArrowLeft, GoArrowRight } from "react-icons/go";

import { IoMdExpand } from "react-icons/io";


import { FaRegHourglass } from "react-icons/fa6";

const translations = { en, pt, es };

export default function InHouses({ params }) {  // Renomeado para InHouses
  const resolvedParams = React.use(params); // Resolve the promise
  const { id } = resolvedParams;
  const propertyID = id;
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // const [currentDate] = useState(today);
  // const [reservas, setReservas] = useState([]);

  // const [postSuccessful, setPostSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMaintenanceOpen, setIsModalMaintenanceOpen] = useState(false);
  const [isModalInsertMaintenanceOpen, setIsModalInsertMaintenanceOpen] = useState(false);

  // const [isModalTracesOpen, setIsModalTracesOpen] = useState(false);


  const [errorMessage, setErrorMessage] = useState('');
  console.log("Error Message State:", setErrorMessage);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Controle do modal de erro

  const [locale, setLocale] = useState("pt");

  const [housekeeping, setHousekeeping] = useState([]);

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"

  const [propertyName, setPropertyName] = useState([]);

  const [selectedReserva, setSelectedReserva] = useState(null);

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva); // Armazena os dados da reserva clicada
    setIsModalOpen(true);
  };
  const handleOpenMaintenanceModal = (reserva) => {
    setSelectedReserva(reserva); // Armazena os dados da reserva clicada
    setIsModalMaintenanceOpen(true);
  };

  // const handleOpenTracesModal = (reserva) => {
  //   setSelectedReserva(reserva); // Armazena os dados da reserva clicada
  //   setIsModalTracesOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReserva(null); // Limpa os dados ao fechar a modal
    window.location.reload(); // Recarrega a página
  };

  const handleCloseMaintenanceModal = () => {
    setIsModalMaintenanceOpen(false);
    setSelectedReserva(null); // Limpa os dados ao fechar a modal
    window.location.reload(); // Recarrega a página
  };

  const handleCloseInsertMaintenanceModal = () => {
    setIsModalInsertMaintenanceOpen(false);
    window.location.reload(); // Recarrega a página
  };
  // const handleCloseTracesModal = () => {
  //   setIsModalTracesOpen(false);
  //   setSelectedReserva(null); // Limpa os dados ao fechar a modal
  //   window.location.reload(); // Recarrega a página
  // };

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

  useEffect(() => {
    const fetchHousekeeping = async () => {
      try {
        setIsLoading(true);

        const response = await axios.post(
          "/api/reservations/housekeeping/gethousekeeping",
          { propertyID }
        );

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log("Housekeeping raw:", response.data);

          // 🔹 Filtra para manter apenas a última linha de cada quarto + hóspede + data
          const filteredHousekeeping = Object.values(
            response.data.reduce((acc, item) => {
              // Chave única por quarto interno + hóspede + arrivalDate
              const key = `${item.IDQuartoInterno}_${item.GuestName}_${item.ArrivalDate}`;

              // Substitui sempre, garantindo que a última linha do backend fique
              acc[key] = item;

              return acc;
            }, {})
          );

          console.log("Housekeeping filtered:", filteredHousekeeping);
          setHousekeeping(filteredHousekeeping); // 👈 só os únicos
        } else {
          setHousekeeping([]);
          console.warn("Nenhum dado encontrado ou dados inválidos para o propertyID:", propertyID);
        }
      } catch (error) {
        console.error(
          "Erro ao buscar housekeeping:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyID) {
      fetchHousekeeping();
    }
  }, [propertyID]);

  // UseMemo para preparar os dados filtrados de acordo com a paginação
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return housekeeping.slice(start, end); // Filtra os housekeeping com base na página atual e número de linhas por página
  }, [page, rowsPerPage, housekeeping]); // A dependência inclui `housekeeping`, que é onde os dados estão

  const pages = Math.ceil(housekeeping.length / rowsPerPage); // Calcula o número total de páginas com base no total de housekeeping

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Função chamada quando o botão de refresh é clicado
  const handleRefreshClick = () => {
    window.location.reload();
  };

  // const handleRefreshClick = async () => {
  //   try {
  //     setIsLoading(true); // Ativa o loading
  //     await sendDataToAPI([today, tomorrowDate]); // Faz a requisição de dados
  //     router.refresh(); // Recarrega a página sem alterar a URL
  //   } catch (error) {
  //     console.error("Erro ao tentar fazer refresh:", error);
  //   } finally {
  //     setIsLoading(false); // Garante que o loading seja desativado
  //   }
  // };

  // const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('');

  // const sortedItems = [...reservas].sort((a, b) => {
  //   if (sortField === 'guestName') {
  //     const nameA = `${a.LastName}, ${a.FirstName}`.toLowerCase();
  //     const nameB = `${b.LastName}, ${b.FirstName}`.toLowerCase();

  //     if (sortOrder === 'asc') return nameA.localeCompare(nameB);
  //     else return nameB.localeCompare(nameA);
  //   }
  //   return 0; // padrão se nenhum campo for selecionado
  // });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // const [isOpen, setIsOpen] = useState(false);
  // console.log(isOpen);
  // const dropdownRef = useRef(null);

  // Fecha dropdown ao clicar fora
  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //       setOpenDropdownIndex(null);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [setOpenDropdownIndex]);

  // const toggleDropdown = (e) => {
  //   e.stopPropagation();
  //   const newState = !isOpen;
  //   setIsOpen(newState);
  //   setOpenDropdownIndex(newState ? index : null);
  // };

  const estadoEstadiaIcon = {
    0: <GoArrowRight size={18} title="Chegada" color="green" />,
    1: <FaRegHourglass size={18} title="Permanência" />,
    2: <GoArrowLeft size={18} title="Partida" color="red" />,
    null: <IoMdExpand size={14} title="Vazio" />,
  };

  const estadoLimpezaConfig = {
    1: { icon: <FaCircle size={20} color="green" />, title: "Limpo" },
    2: { icon: <FaCircle size={20} color="red" />, title: "Sujo" },
    3: { icon: <CiWarning size={20} />, title: "Fora de serviço" },
    4: { icon: <FaCircle size={20} color="blue" />, title: "Pronto" },
    5: { icon: <FaCircle size={20} color="orange" />, title: "Usado" },
    6: { icon: <FaCircle size={20} color="yellow" />, title: "Limpeza em execução" },
    10: { icon: <FaCircle size={20} color="gray" />, title: "Arrumar quarto" },
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

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshClick}
                className="text-white bg-primary rounded-lg cursor-pointer p-2"
              >
                <MdOutlineRefresh size={20} />
              </button>
              <button
                onClick={() => setIsModalInsertMaintenanceOpen(true)}
                className="text-white bg-primary rounded-lg cursor-pointer p-2"
              >
                <FaPlus size={20} />
              </button>
              <HousekeepingInsertMaintenanceForm
                buttonName={t.frontOffice.housekeeping.maintenance}
                buttonColor="transparent"
                modalHeader={t.modals.housekeeping.maintenance.title + " - Res. No.: " + selectedReserva?.IDReserva}
                formTypeModal={11}
                propertyID={propertyID}
                isBackdropVisible
                isOpen={isModalInsertMaintenanceOpen}
                onClose={handleCloseInsertMaintenanceModal}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg text-textPrimaryColor">{propertyName} : {t.frontOffice.housekeeping.title}</h2>
        </div>

        <div className="mt-5 flex flex-col h-[calc(100vh-210px)]">
          {isLoading ? (
            (<LoadingBackdrop open={isLoading} />) // Exibe o carregamento enquanto os dados estão sendo carregados
          ) : housekeeping.length > 0 ? (
            <div className="overflow-auto flex-grow">
              <table className="w-full text-left min-w-max border-collapse">
                <thead className="sticky top-0 z-30">
                  <tr className="bg-primary text-white h-16">
                    <td className="pl-2 pr-2 h-full border-r border-[#e6e6e6]">
                      <div className="w-full h-full flex justify-center items-center">
                        <FaGear size={18} color="white" />
                      </div>
                    </td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.housekeeping.arrival}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.housekeeping.departure}</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.frontOffice.housekeeping.room}</td>
                    <td
                      className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase cursor-pointer select-none"
                      onClick={() => toggleSort("guestName")}
                    >
                      <div className="flex justify-between items-center gap-1">
                        {t.frontOffice.housekeeping.guestName}
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
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase w-14">HSK</td>
                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                      <div className="flex items-center justify-center h-full">
                        <MdComputer size={20} title="HK Status" />
                      </div>
                    </td>

                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                      <div className="flex items-center justify-center h-full">
                        <HiMiniArrowsUpDown size={20} title="Stay Status" />
                      </div>
                    </td>

                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                      <div className="flex items-center justify-center h-full">
                        <MdCleanHands size={20} title="Room Status" />
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={`${item.IDReserva}-${index}`}
                      className="min-h-14 h-14 border-b border-[#e8e6e6] text-textPrimaryColor hover:bg-primary-50 cursor-pointer"
                      onClick={() => handleOpenModal(item)}
                    >
                     <td className="pl-1 pr-1 w-10 border-r border-[#e6e6e6] align-middle text-center">
  <div className="flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
    <Dropdown
      isOpen={openDropdownIndex === index}
      onOpenChange={(open) => setOpenDropdownIndex(open ? index : null)}
    >
      <DropdownTrigger>
        <button
          className="p-1 rounded flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownIndex(index);
          }}
        >
          <BsThreeDotsVertical size={20} className="text-gray-600" />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Room Actions"
        closeOnSelect={true}
        className="text-gray-700"
      >
        {/* Manutenção */}
        <DropdownItem
          key="maintenance"
          onClick={() => {
            handleOpenMaintenanceModal(item);
          }}
        >
          <div className="flex flex-row gap-2 items-center">
            <HiOutlineWrenchScrewdriver size={16} />
            <span>Manutenção</span>
          </div>
        </DropdownItem>

        {/* Info */}
        <DropdownItem
          key="info"
          onClick={() => {
            handleOpenModal(item);
          }}
        >
          <div className="flex flex-row gap-2 items-center">
            <AiFillInfoCircle size={16} />
            <span>Info</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</td>


                      
                      {/* Other Cells */}
                      <td className="h-14 text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{item.ArrivalDate?.split("T")[0]}</td>
                      <td className="h-14 text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{item.DepartureDate?.split("T")[0]}</td>
                      <td className="text-right pr-2 w-28 truncate whitespace-nowrap overflow-hidden">{item.IDQuarto}</td>
                      <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] truncate whitespace-nowrap overflow-hidden">
                        {`${item.GuestName}`}
                      </td>
                      <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-14 truncate whitespace-nowrap overflow-hidden">
                        {item.Lavandaria === 1 && <PiCoatHanger size={20} title="Changing sheets" />}
                      </td>
                      <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                        <div className="flex items-center justify-center h-full">
                          {item.EstadoQuarto === 1 ? (
                            <CiLock size={20} title="Occupied" />
                          ) : (
                            <CiCircleCheck size={20} title="Free" />
                          )}
                        </div>
                      </td>

                      <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                        <div className="flex items-center justify-center h-full">
                          {estadoEstadiaIcon[item.EstadoEstadia ?? null]}
                        </div>
                      </td>

                      <td className="h-14 pl-2 pr-2 border-r border-[#e6e6e6] w-14">
                        <div className="flex items-center justify-center h-full">
                          {estadoLimpezaConfig[item.EstadoLimpeza] && (
                            <span title={estadoLimpezaConfig[item.EstadoLimpeza].title}>
                              {estadoLimpezaConfig[item.EstadoLimpeza].icon}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Modals */}
                  <HousekeepingInfoForm
                    buttonName={t.frontOffice.housekeeping.info}
                    buttonColor="transparent"
                    modalHeader={"R. " + selectedReserva?.IDReserva}
                    formTypeModal={11}
                    hskStatus={selectedReserva?.EstadoQuarto}
                    roomStatus={selectedReserva?.EstadoLimpeza}
                    priority={selectedReserva?.Prioridade}
                    roomType={selectedReserva?.Tipologia}
                    stayStatus={selectedReserva?.EstadoEstadia}
                    laundry={selectedReserva?.Lavandaria}
                    guestName={selectedReserva?.GuestName}
                    from={selectedReserva?.ArrivalDate}
                    to={selectedReserva?.DepartureDate}
                    propertyID={propertyID}
                    room={selectedReserva?.IDQuartoInterno}
                    isBackdropVisible
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddMaintenance={handleOpenMaintenanceModal}
                    selectedReserva={selectedReserva}
                  />

                  <HousekeepingMaintenanceForm
                    buttonName={t.frontOffice.housekeeping.maintenance}
                    buttonColor="transparent"
                    modalHeader={t.modals.housekeeping.maintenance.title + " - Res. No.: " + selectedReserva?.IDReserva}
                    formTypeModal={11}
                    propertyID={propertyID}
                    roomID={selectedReserva?.IDQuarto}
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
                    isBackdropVisible
                    isOpen={isModalMaintenanceOpen}
                    onClose={handleCloseMaintenanceModal}
                  />

                  {/* <HousekeepingTracesForm
                    buttonName={t.frontOffice.housekeeping.traces}
                    buttonColor="transparent"
                    modalHeader={t.modals.housekeeping.traces.title + " - Res. No.: " + selectedReserva?.ResNo}
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
                    isBackdropVisible
                    isOpen={isModalTracesOpen}
                    onClose={handleCloseTracesModal}
                  /> */}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-textLabelColor">{t.frontOffice.housekeeping.noReservations}</p>
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
          modalHeader={t.frontOffice.housekeeping.attention}
          errorMessage={errorMessage}
          onClose={() => setIsErrorModalOpen(false)} // Fecha o modal quando o erro for resolvido
        />
      )}
    </main>)
  );
}