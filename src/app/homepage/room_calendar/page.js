"use client";
// import React, { useState, useEffect, useRef } from 'react';
// import { generateMonth, months, daysOfWeek } from '@/app/util/tipologyPlan/month/monthcalendar';
// import dayjs from 'dayjs';
// import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
// import axios from 'axios';

// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
// import isBetween from 'dayjs/plugin/isBetween';

// import ReservationsForm from '@/components/modals/frontOffice/reservations/multiReservations/roomsPlan/page';
// import InputFieldControlled from '@/components/functionsForm/inputs/typeText/page';
// import IndividualForm from "@/components/modals/frontOffice/clientForm/individuals/page";
// import CompanyForm from "@/components/modals/frontOffice/clientForm/companies/page";
// import TravelGroupForm from "@/components/modals/frontOffice/clientForm/travelAgency/page";
// import GroupForm from "@/components/modals/frontOffice/clientForm/groups/page";
// import OthersForm from "@/components/modals/frontOffice/clientForm/others/page";

// import en from "../../../../public/locales/english/common.json";
// import pt from "../../../../public/locales/portuguesPortugal/common.json";
// import es from "../../../../public/locales/espanol/common.json";

// import interact from 'interactjs';

// //imports de componentes
// import { FaCalendarAlt, FaRegTrashAlt, FaRegUserCircle, FaBed } from 'react-icons/fa';
// import { FaPlus } from "react-icons/fa6";
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

// import { MdOutlineZoomOut } from "react-icons/md";

// import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";

// // import { expansion } from "@/components/functionsForm/expansion/page";

// import { useTranslations } from 'next-intl';

// // import { ImWrench } from "react-icons/im";
// // import { GiBroom } from "react-icons/gi";
// // import { MdOutlineTouchApp } from "react-icons/md";
// // import { FaXmark, FaCheck } from "react-icons/fa6";
// // import { CgSearchFound } from "react-icons/cg";

// import { FaCircleMinus, FaCircleXmark, FaCircleExclamation } from "react-icons/fa6";
// import { FaCircle, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";

// // Configurando plugins
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isBetween);

// const translations = { en, pt, es };

export default function CalendarPage() {
//   const [today, setToday] = useState(dayjs());
//   const currentYear = dayjs().year();
//   const currentMonth = dayjs().month();
//   // const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
//   const [weeks, setWeeks] = useState(generateMonth(today.month(), today.year()));
//   const [showModal, setShowModal] = useState(false);
//   // const [reservationRange, setReservationRange] = useState({ start: null, end: null });

//   const [roomTypeState, setRoomTypeState] = useState([]);
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [hkpStatus, setHkpStatus] = useState([]);

//   const [reservation, setReservation] = useState([]);

//   // const [dragStart, setDragStart] = useState(null);
//   // const [dragEnd, setDragEnd] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);

//   const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
//   console.log(currentWeekIndex);
//   const [isSelecting, setIsSelecting] = useState(false);

//   const [selectionInfo, setSelectionInfo] = useState({ roomID: null, dates: [] }); //seleção de uma linha

//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const [tipology, setTipology] = useState(null);

//   const [startDate2, setStartDate2] = useState(null);
//   const [endDate2, setEndDate2] = useState(null);
// console.log(endDate2);
//   const [selectedDates, setSelectedDates] = useState([]);


//   const [selectedRow, setSelectedRow] = useState(null);
//   console.log(selectedRow);
//   const [selectedCells, setSelectedCells] = useState([]);
//   const [cellsSelection, setCellsSelection] = useState([]);

//   const [finalSelectedCells, setFinalSelectedCells] = useState([]);

//   const [ctrlPressed, setCtrlPressed] = useState(false);
//   const [selectedColumn, setSelectedColumn] = useState(null);
// console.log(selectedColumn, setCtrlPressed);
//   // const [groupReservation, setRoomRevervation] = useState({}); // Estado para armazenar o número de quartos associados a cada tipo de quarto

//   const [nights, setNights] = useState([]);
// console.log(nights);
//   // const { toggleExpand, setIsExpanded, isExpanded } = expansion();

//   //FILTRO DE BOTOES 
//   const [showButton, setShowButton] = useState(false);

//   const [selectedRoomType, setSelectedRoomType] = useState('');
//   const [guestName, setGuestName] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   console.log(isLoading, setSelectedRoomType);
//   const [dataFetched, setDataFetched] = useState(false);
//   const [query, setQuery] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isGuestNameValid, setIsGuestNameValid] = useState(false);
//   const [selectedGuestId, setSelectedGuestId] = useState('');

//   const [isResizing, setIsResizing] = useState(false);
//   // const [newEndDate, setNewEndDate] = useState(null);
//   // const [resizedEndDate, setResizedEndDate] = useState(null);
//   const reservationRefs = useRef({});
//   // const resizerRefs = useRef({});


//   const [locale, setLocale] = useState("pt");
//   useEffect(() => {
//     // Carregar o idioma do localStorage
//     const storedLanguage = localStorage.getItem("language");
//     if (storedLanguage) {
//       setLocale(storedLanguage);
//     }
//   }, []);

//   // Carregar as traduções com base no idioma atual
//   const t = translations[locale] || translations["pt"]; // fallback para "pt"

//   /*-----ABRE O MODAL LATERAL-------------------------------------------- */
//   const handleToggleModal = () => {
//     setShowModal(!showModal);
//   };

//    /*------CHAMA A API DOS QUARTOS ------------------------------------------- */
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const resRooms = await axios.get(
//           `/api/room_calendar/rooms?propertyID=2`
//         );

//         const allRooms = resRooms.data; // 👈 AQUI
//         setRoomTypeState(allRooms);

//         console.log("quartos:", allRooms);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     getData();
//   }, []);

//   /*------CHAMA A API DAS TIPOLOGIAS ------------------------------------------- */
//   // useEffect(() => {
//   //   const getRoomTypes = async () => {
//   //     try {
//   //       const resRoomTypes = await axios.get(`/api/room_calendar/roomType`, {
//   //         params: { propertyID: 2 }
//   //       });

//   //       const allRoomTypes = resRoomTypes.data; // 👈 AQUI
//   //       setRoomTypes(allRoomTypes);

//   //       console.log("ROOM TYPES:", allRoomTypes);
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };

//   //   getRoomTypes();
//   // }, []);

//   const getRoomTypeName = (roomType) => {
//     const type = roomTypes.find(type => type.roomTypeID === roomType);
//     return type ? type.name : 'Unknown';
//   };


//   const renderHousekeepingStatus = (hskStatus) => {
//     let icon;

//     switch (hskStatus) {
//       case 1: // clean
//         icon = <FaCheckCircle color="lime" size={15} />;
//         break;
//       case 2: // dirty
//         icon = <FaCircleXmark color="red" size={15} />;
//         break;
//       case 3: // out of service
//         icon = <FaCircleMinus color="gray" size={15} />;
//         break;
//       case 4: // checked
//         icon = <FaQuestionCircle color="#00CED1" size={15} />;
//         break;
//       case 5: // touched
//         icon = <FaCircleExclamation color="orange" size={15} />;
//         break;
//       case 6: // cleaning
//         icon = <FaCircle color="#FFD700" size={15} />;
//         break;
//       case 10: // arranging room
//         icon = <FaCircle color="#FFD700" size={15} />;
//         break;
//       default:
//         icon = <FaCheckCircle color="lime" size={15} />;
//     }

//     return <div className="flex items-center gap-2">{icon}</div>;
//   };

//   /*----FUNÇÕES PARA NAVEGAR 1 MES PARA TRAS, PARA A FRENTE OU PARA IR PARA O ATUAL---------------------------------------------------------------------------- */
//   const goToPreviousMonth = () => {
//     const newToday = today.subtract(1, 'month');
//     setToday(newToday);
//     setWeeks(generateMonth(newToday.month(), newToday.year())); // Atualize weeks para o novo mês
//   };

//   const goToNextMonth = () => {
//     const newToday = today.add(1, 'month');
//     setToday(newToday);
//     setWeeks(generateMonth(newToday.month(), newToday.year())); // Atualize weeks para o novo mês
//   };

//   const goToCurrentMonth = () => {
//     const currentToday = dayjs();  // Pega a data atual
//     setToday(currentToday);        // Atualiza o estado today para a data atual
//     setWeeks(generateMonth(currentToday.month(), currentToday.year()));  // Regenera as semanas para o mês atual
//   };

//   /*------SELECIONA A LINHA, REMOVE O EVENTO E ALTERA/ACRESCENTA EVENTOS NO ARRAY--------------------------------------------------------------------- */
//   // Função para lidar com a seleção da linha
//   const handleRowSelection = (rowIndex) => {
//     const filteredCells = selectedCells.filter(cell => cell.row === rowIndex);
//     setSelectedCells(filteredCells);
//   };

//   const removeEvent = (index) => {
//     const updatedSelectedDates = [...selectedDates];
//     updatedSelectedDates.splice(index, 1);
//     setSelectedDates(updatedSelectedDates);
//   };

//   const updateDateRange = (index, field, value) => {
//     const updatedDates = [...selectedDates];
//     updatedDates[index][field] = value;
//     setSelectedDates(updatedDates);
//   };

//   /*------FUNÇÃO PARA CALCULAR O NRM DE NOITES QUE DEVERA APARECER NO MODAL LATERAL------------------------------------------------------------- */
//   //calcula o nrm de noites
//   const calculateNights = (start, end) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const diffTime = endDate - startDate;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };

//   /*-----FUNÇÃO PARA SELECIONAR, ARRASTAR E LARGAR AS CELULAS----------------------------------------------------------------------------- */
//   const handleMouseDown = (date, roomID, rowIndex, columnIndex) => {
//     const formattedDate = date.format('YYYY-MM-DD');
//     if (!isResizing) {
//       setSelectionInfo({ roomID, dates: [formattedDate] });

//       // Check if there are available rooms for the selected date and room type
//       //const availableRooms = updatedAvailability[roomTypeID][formattedDate];
//       setIsDragging(true);
//       setIsSelecting(true);
//       setStartDate(formattedDate);
//       setSelectedRow(rowIndex);
//       setSelectedColumn(columnIndex); // Definir a coluna selecionada
//       setSelectedCells([{ row: rowIndex, column: columnIndex }]);
//       const newSelectedCell = { row: rowIndex, column: columnIndex, date };
//       setCellsSelection([...cellsSelection, newSelectedCell]);
//       if (ctrlPressed) {
//         setSelectionInfo(prev => ({
//           roomID: prev.roomID,
//           dates: [...prev.dates, formattedDate]
//         }));
//         setStartDate2(formattedDate);
//       }
//     }
//   };

//   const handleMouseOver = (date, rowIndex, columnIndex) => {
//     if (!isResizing) {
//       if (isDragging && selectionInfo.roomID) {
//         setTipology(selectionInfo.roomID);
//         const formattedDate = date.format('YYYY-MM-DD');
//         setSelectedCells(prevCells => [...prevCells, { row: rowIndex, column: columnIndex }]);
//         if (!selectionInfo.dates.includes(formattedDate)) {
//           setSelectionInfo(prev => ({
//             ...prev,
//             dates: [...prev.dates, formattedDate]
//           }));
//         }
//         setSelectedRow(rowIndex); // Atualizar a linha selecionada
//         setSelectedColumn(columnIndex); // Atualizar a coluna selecionada
//       }
//     }
//   };

//   const handleMouseUp = (date) => {
//     if (!isResizing) {
//       if (isDragging) {
//         setIsDragging(false);
//         setShowModal(true);
//         setFinalSelectedCells(selectedCells);
//         const formattedDate = date.format('YYYY-MM-DD');
//         const selectedRoom = roomTypeState.find(t => t.roomID === selectionInfo.roomID);
//         const roomName = selectedRoom ? selectedRoom.label : '';
//         const roomID = selectedRoom ? selectedRoom.roomID : '';
//         const tipologyID = selectedRoom ? selectedRoom.roomType : '';

//         // Calcular o número de noites
//         const numberNights = calculateNights(startDate, formattedDate);
//         setNights(numberNights);

//         if (ctrlPressed) {
//           // Se a tecla Ctrl está pressionada, defina startDate2 e endDate2
//           setEndDate2(date.format('YYYY-MM-DD'), () => {
//             // O estado endDate2 foi atualizado, agora você pode acessá-lo com segurança
//             setSelectedDates((prevDates) => [...prevDates,
//             { start: startDate, end: formattedDate, roomName, roomID, tipologyID, numberNights },
//             { start: startDate2, end: formattedDate, roomName, roomID, tipologyID, numberNights },
//             ]);
//           });
//         } else {
//           // Se a tecla Ctrl não está pressionada, defina startDate e endDate
//           setEndDate(date.format('YYYY-MM-DD'));
//           // Usar o estado anterior para garantir que endDate tenha o valor atualizado
//           setSelectedDates((prevDates) => [...prevDates, { start: startDate, end: formattedDate, roomName, roomID, tipologyID, numberNights }]);
//         }

//         // Limpar seleção após o uso
//         setSelectionInfo({ roomID: null, dates: [] });
//       }
//     }
//   };

//  const fetchData = async () => {
//   try {
//     const response = await axios.get('/api/room_calendar/getreservationprotel', {
//       params: {
//         propertyID: 2,
//         startDate: '2026-03-01',
//         endDate: '2026-03-31'
//       }
//     });

//     if (Array.isArray(response.data.response)) {
//       const reservations = response.data.response;

//       const fetchGuestProfile = async (reservation) => {
//         try {
//           const guestProfileResponse = await axios.get(
//             `/api/v1/frontOffice/clientForm/individuals/${reservation.guestNumber}`
//           );

//           const firstName = guestProfileResponse.data.response.firstName;
//           const secondName = guestProfileResponse.data.response.secondName;

//           return {
//             ...reservation,
//             guestFirstName: firstName,
//             guestSecondName: secondName
//           };

//         } catch (error) {
//           console.error(
//             `Erro ao buscar perfil do hóspede para guestNumber ${reservation.guestNumber}:`,
//             error
//           );

//           return reservation;
//         }
//       };

//       const promises = reservations.map(fetchGuestProfile);
//       const updatedReservations = await Promise.all(promises);

//       setReservation(updatedReservations);

//     } else {
//       console.error('Dados de resposta inválidos:', response.data.response);
//     }

//   } catch (error) {
//     console.error('Erro ao buscar reservas:', error);
//   }
// };

//   const getCellUnderCursor = (clientX, clientY) => {
//     // Temporariamente oculta todas as divs de reserva
//     for (const key in reservationRefs.current) {
//       if (reservationRefs.current[key]) {
//         reservationRefs.current[key].style.visibility = 'hidden';
//       }
//     }
  
//     // Obtém todos os elementos na posição do cursor
//     const elements = document.elementsFromPoint(clientX, clientY);
  
//     // Encontra a célula da tabela subjacente
//     let targetCell;
//     for (const element of elements) {
//       if (element.id.startsWith('cell-')) {
//         targetCell = element;
//         break;
//       }
//     }
  
//     // Reexibe todas as divs de reserva
//     for (const key in reservationRefs.current) {
//       if (reservationRefs.current[key]) {
//         reservationRefs.current[key].style.visibility = 'visible';
//       }
//     }
  
//     return targetCell;
//   };
  
//   const handleMouseDownRightResize = async (event, reservationID, date, checkOutDate) => {
//     event.stopPropagation();
//     event.preventDefault();
  
//     setIsResizing(true);
  
//     const resizeableEle = reservationRefs.current[reservationID];
//     if (!resizeableEle) return;
  
//     const startDate = dayjs(date);
//     let localNewEndDate = dayjs(checkOutDate);
  
//     // Configuração do Interact.js para redimensionamento e arrasto
//     interact(resizeableEle)
//       .resizable({
//         edges: { right: true },
//         listeners: {
//           move(event) {
//             const newWidth = event.rect.width;
//             const targetCell = getCellUnderCursor(event.clientX, event.clientY);
  
//             if (targetCell && targetCell.id.startsWith('cell-')) {
//               const targetDay = parseInt(targetCell.id.replace('cell-', ''), 10);
//               if (!isNaN(targetDay)) {
//                 localNewEndDate = startDate.clone().date(targetDay);
//                 console.log("Nova data de término (durante move):", localNewEndDate.format('DD-MM-YYYY'));
//               }
//             }
  
//             if (newWidth >= 0) {
//               resizeableEle.style.width = `${newWidth}px`;
//             }
//           },
//           end(event) {
//             // Atualiza apenas no final do redimensionamento
//             if (localNewEndDate) {
//               console.log("Nova data de término (finalizada):", localNewEndDate.format('DD-MM-YYYY'));
//               updateReservation(reservationID, localNewEndDate);
//             }
//             setIsResizing(false); // Finaliza estado de redimensionamento
//           },
//         },
//         modifiers: [
//           interact.modifiers.restrictSize({
//             min: { width: 0 },
//           }),
//         ],
//       })
//       .draggable({
//         listeners: {
//           start(event) {
//             handleDragStart(event, reservationID);
//           },
//           move: (event) => {
//             const dropDate = this.props.dropDate; // ou de onde você obtém a data de drop
//             const roomType = this.props.roomType;
  
//             if (dropDate && roomType) {
//               handleDrop(event, dropDate, roomType);
//             } else {
//               console.warn('dropDate ou roomType não estão definidos.');
//             }
//           },
//           end(event) {
//             setIsResizing(false); // Atualiza o estado ao final do arrasto
//             console.log('Arrasto finalizado');
//           },
//         },
//       });
//   };
  
//   // Função de atualização da reserva
//   const updateReservation = async (reservationID, newDate) => {
//     try {
//       const response = await axios.patch(`/api/v1/frontOffice/reservations/roomsPlan/${reservationID}`, {
//         data: {
//           checkOutDate: newDate.format('YYYY-MM-DD'),
//         },
//       });
//       console.log('Reserva atualizada:', response.data);
//       console.log(`Reserva atualizada para o dia: ${newDate.format('DD-MM-YYYY')}`);
//     } catch (error) {
//       console.error('Erro ao atualizar reserva:', error);
//     }
//   };
  
  
//   // Função para lidar com o início do arrasto
//   const handleDragStart = (e, reservationID) => {
//     e.dataTransfer.setData('reservationID', reservationID);
//     const reservationElement = e.target;
//     const rect = reservationElement.getBoundingClientRect();
//     const offsetX = e.clientX - rect.left;
  
//     e.dataTransfer.setData('offsetX', offsetX);
//     e.dataTransfer.setData('width', reservationElement.offsetWidth);
//     e.target.style.opacity = 0.5; // Feedback visual
//   };

// // Função para lidar com o drop
// const handleDrop = async (e, dropDate, roomType) => {
//   e.preventDefault();
//   const reservationID = e.dataTransfer.getData('reservationID');
//   const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
//   const width = parseFloat(e.dataTransfer.getData('width'));

//   const dropCell = e.target.closest('td');
//   if (!dropCell) {
//     console.warn('Célula de destino não encontrada.');
//     return;
//   }

//   const dropCellRect = dropCell.getBoundingClientRect();
//   const leftPosition = e.clientX - dropCellRect.left - offsetX;
//   const rightPosition = leftPosition + width;

//   const cells = Array.from(dropCell.parentNode.children);
//   let targetCellCheckin;
//   let targetCellCheckout;

//   for (const cell of cells) {
//     const cellRect = cell.getBoundingClientRect();
//     if (cellRect.left <= dropCellRect.left + leftPosition && cellRect.right > dropCellRect.left + leftPosition) {
//       targetCellCheckin = cell;
//     }
//     if (cellRect.left <= dropCellRect.left + rightPosition && cellRect.right > dropCellRect.left + rightPosition) {
//       targetCellCheckout = cell;
//     }
//   }

//   if (!targetCellCheckin || !targetCellCheckout) {
//     console.warn('Célula alvo não encontrada.');
//     return;
//   }

//   // Obtém o dia do mês da célula alvo
//   const dayOfMonthCheckin = parseInt(targetCellCheckin.id.replace('cell-', ''), 10);
//   const dayOfMonthCheckout = parseInt(targetCellCheckout.id.replace('cell-', ''), 10);
//   if (isNaN(dayOfMonthCheckin) || isNaN(dayOfMonthCheckout)) {
//     console.warn('Dia do mês inválido.');
//     return;
//   }

//   // Calcula o novo check-in e check-out
//   const newCheckInDate = dayjs(dropDate).date(dayOfMonthCheckin).format('YYYY-MM-DD');
//   const newCheckOutDate = dayjs(dropDate).date(dayOfMonthCheckout).format('YYYY-MM-DD');
//   const roomNumber = roomType.label;

//   console.log(`Reserva ${reservationID} foi movida para check-in em ${newCheckInDate} e check-out em ${newCheckOutDate} no quarto ${roomType.label} id ${roomType.roomID}`);

//   // Atualiza a reserva na API
//   try {
//     const response = await axios.patch(`/api/v1/frontOffice/reservations/roomsPlan/${reservationID}`, {
//       data: {
//         checkInDate: newCheckInDate,
//         checkOutDate: newCheckOutDate,
//         roomNumber: roomNumber,
//       },
//     });
//     console.log('Reserva atualizada:', response.data);
//     // Atualize o estado das reservas na sua aplicação, se necessário
//   } catch (error) {
//     console.error('Erro ao atualizar reserva:', error);
//   }
// };

// const handleDragEnd = (e) => {
//   // Opcional: restaura o estilo do elemento após o drag
//   e.target.style.opacity = 1;
// };


// const renderReservations = (reservations, date, roomType) => {
//   if (!reservations) {
//     console.warn('Não há reservas para renderizar.');
//     return [];
//   }

//   const reservationsToRender = reservations.reduce((acc, reservation) => {
//     const checkInDate = dayjs(reservation.checkInDate);
//     const checkOutDate = dayjs(reservation.checkOutDate);

//     const isSameRoom = String(reservation.roomNumber) === roomType.label;

//     if (!isSameRoom) return acc;

//     const reservationStartMonth = checkInDate.month();
//     const reservationEndMonth = checkOutDate.month();

//     const currentMonth = date.month();

//     if (reservationStartMonth === currentMonth && reservationEndMonth === currentMonth) {
//       acc.push(reservation);
//     } else if (reservationStartMonth === currentMonth) {
//       acc.push({
//         ...reservation,
//         checkOutDate: checkInDate.endOf('month').toISOString(),
//       });
//     } else if (reservationEndMonth === currentMonth) {
//       acc.push({
//         ...reservation,
//         checkInDate: checkOutDate.startOf('month').toISOString(),
//       });
//     }

//     return acc;
//   }, []);

//   return reservationsToRender.map((reservation) => {
//     const checkInDate = dayjs(reservation.checkInDate);
//     const checkOutDate = dayjs(reservation.checkOutDate);

//     const checkInDay = checkInDate.date();
//     const checkOutDay = checkOutDate.date();

//     const startCellId = `cell-${checkInDay}`;
//     const endCellId = `cell-${checkOutDay}`;

//     const startCell = document.getElementById(startCellId);
//     const endCell = document.getElementById(endCellId);

//     if (!startCell || !endCell) {
//       console.warn(`Célula não encontrada: ${!startCell ? startCellId : endCellId}`);
//       return null;
//     }

//     const startCellRect = startCell.getBoundingClientRect();
//     const endCellRect = endCell.getBoundingClientRect();
//     const cellWidth = startCellRect.width;
//     const halfCellWidth = cellWidth / 2;

//     let leftStartPosition;
//     if (checkInDate.date() === 1) {
//       leftStartPosition = startCellRect.left + window.pageXOffset;
//     } else {
//       leftStartPosition = startCellRect.left + window.pageXOffset + halfCellWidth;
//     }

//     const leftEndPosition = endCellRect.left + window.pageXOffset + halfCellWidth;

//     const reservationWidth = leftEndPosition - leftStartPosition;

//     const style = {
//       position: 'absolute',
//       left: leftStartPosition,
//       width: reservationWidth,
//       marginTop: -20,
//       backgroundColor: 'red',
//       color: 'white',
//       padding: '1px',
//       borderRadius: '4px',
//       fontSize: '12px',
//       height: '40px',
//       cursor: 'move', // Indica que o elemento pode ser movido
//     };

//     const textContainerStyle = {
//       position: 'absolute',
//       left: 0,
//       top: 0,
//       bottom: 0,
//       width: 'calc(100% - 5px)', // Adjust width to accommodate resizer
//       display: 'flex',
//       flexDirection: 'column', // Ajustar para layout de coluna
//       alignItems: 'flex-start', // Alinhar texto à esquerda
//       paddingLeft: '5px', // Adjust padding as needed
//     };

//     const guestFirstName = reservation.guestFirstName || 'Nome do hóspede não disponível';
//     const guestSecondName = reservation.guestSecondName || 'Sobrenome do hóspede não disponível';

//     let reservationStatusColor = 'yellow';
//     if (reservation.reservationStatus === 1) {
//       reservationStatusColor = 'yellow';
//     } else if (reservation.reservationStatus === 2) {
//       reservationStatusColor = 'green';
//     } else if (reservation.reservationStatus === 3) {
//       reservationStatusColor = 'red';
//     } else if (reservation.reservationStatus === 4) {
//       reservationStatusColor = 'gray';
//     } else if (reservation.reservationStatus === 5) {
//       reservationStatusColor = 'white';
//     }

//     const formattedCheckInDate = checkInDate.format('DD.MM');
//     const formattedCheckOutDate = checkOutDate.format('DD.MM');

//     return (
//       <div
//         key={reservation.reservationID}
//         style={style}
//         className="absolute border border-black w-full h-full"
//         ref={(element) => (reservationRefs.current[reservation.reservationID] = element)}
//         draggable
//         onDragStart={(e) => handleDragStart(e, reservation.reservationID)}
//       >
//         <div style={{ background: reservationStatusColor }} className='border-1 border-black rounded-sm w-2 h-2 ml-1 mt-1'></div>
//         <div style={textContainerStyle} className='flex-col ml-3'>
//           <span>{`${guestSecondName}, ${guestFirstName}`}</span>
//           <span>{`${formattedCheckInDate} - ${formattedCheckOutDate}`}</span>
//         </div>
//         <div
//           onMouseDown={(e) => handleMouseDownRightResize(e, reservation.reservationID, reservation.checkOutDate, date)}
//           className="absolute bg-black cursor-ew-resize text-left"
//           style={{ right: 0, top: 0, bottom: 0, width: 5 }}
//         >
//           {/* Conteúdo do redimensionador */}
//         </div>
//       </div>
//     );
//   });
// };


// const updateAvailability = () => {
//   fetchData();
// }


// /*-----FUNÇÃO PARA O FILTRO DO ANO E DOS MESES-------------------------------------------------------------------------------------------- */
// const handleYearChange = (action) => {
//   let newYear;
//   if (action === 'increment') {
//     newYear = selectedYear + 1;
//   } else if (action === 'decrement') {
//     newYear = selectedYear - 1;
//   }

//   setSelectedYear(newYear);

//   // Atualiza a data para o primeiro dia do novo ano e mês atual
//   const newToday = dayjs().year(newYear).month(selectedMonth).date(1);
//   setToday(newToday);

//   // Regenera as semanas para o novo ano e mês
//   const newWeeks = generateMonth(newToday.month(), newToday.year());
//   setWeeks(newWeeks);

//   // Atualiza o índice da semana para a primeira semana do novo mês e ano
//   setCurrentWeekIndex(0);

//   updateAvailability(); // Atualiza a disponibilidade
// };

// const handleMonthChange = (month) => {
//   const newMonth = parseInt(month, 10);
//   setSelectedMonth(newMonth);

//   // Atualiza a data para o primeiro dia do novo mês e ano atual
//   const newToday = dayjs().year(selectedYear).month(newMonth).date(1);
//   setToday(newToday);

//   // Regenera as semanas para o novo mês e ano
//   const newWeeks = generateMonth(newToday.month(), newToday.year());
//   setWeeks(newWeeks);

//   // Atualiza o índice da semana para a primeira semana do novo mês e ano
//   setCurrentWeekIndex(0);

//   updateAvailability(); // Atualiza a disponibilidade
//   renderReservations(); // Atualiza a disponibilidade

// };

// // useEffect para atualizar os dados quando o mês ou o ano é alterado
// useEffect(() => {
//   const newToday = dayjs().year(selectedYear).month(selectedMonth).date(1);
//   setToday(newToday);

//   const newWeeks = generateMonth(newToday.month(), newToday.year());
//   setWeeks(newWeeks);

//   // Atualiza o índice da semana para a primeira semana do novo mês e ano
//   setCurrentWeekIndex(0);

//   updateAvailability(); // Atualiza a disponibilidade
// }, [selectedYear, selectedMonth]);  // Executa o efeito quando selectedYear ou selectedMonth mudar


// /*-----FUNÇÃO PARA TROCAR VISAO DA TABELA DE MES PARA SEMANAL------------------------------------------------------------------------------------ */
// const handleZoomOutClick = () => {
//   window.location.href = '/homepage/frontOffice/rooms_Plan/zoom_out';
// }


// /*------FUNÇÕES PARAS SELECIONAR O NOME DO HOSPEDE NO MODAL LATERAL------------------------------------------------------------------------------ */
// useEffect(() => {
//   const getData = async () => {
//     if (!dataFetched) {
//       setIsLoading(true);
//       try {
//         const res = await axios.get("/api/v1/frontOffice/clientForm/individuals");
//         const namesArray = res.data.response
//           .map(item => ({
//             id: item.guestProfileID,
//             secondName: item.secondName,
//             firstName: item.firstName
//           }))
//           .filter(item => item.secondName !== '' && item.firstName !== '');
//         setQuery(namesArray);
//         setDataFetched(true);
//       } catch (error) {
//         console.error("Erro ao encontrar as fichas de cliente:", error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   }
//   getData();
// }, [dataFetched]);

// const handleInputChange = (event) => {
//   setGuestName(event.target.value);
//   setSearchTerm(event.target.value);
//   setIsGuestNameValid(query.some(item => `${item.firstName} ${item.secondName}` === event.target.value));
// };

// const handleNameSelect = (selectedName, id) => {
//   setGuestName(selectedName);
//   setSelectedGuestId(id);
//   setSearchTerm('');
//   setIsGuestNameValid(filteredResults.some(item => `${item.firstName} ${item.secondName}` === selectedName));
// };

// const filteredResults = query.filter(item => {
//   const fullName = `${item.firstName} ${item.secondName}`.toLowerCase();
//   return fullName.includes(searchTerm.toLowerCase());
// });

return (
  <div>teste</div>
  // <div className='w-full' >
  //   {showModal && (
  //     <>
  //       <div className='fixed top-0 right-0 bg-lightBlue h-screen w-[22%] z-10'>
  //         <div className='mt-20 px-4 text-black bg-white border border-gray-300 rounded-lg mx-2'>
  //           <div className='flex flex-row items-center justify-between flex-wrap'>
  //             <FaRegUserCircle size={20} className={guestName.trim() === '' ? 'text-red-500' : 'text-black'} />
  //             <InputFieldControlled
  //               type={"text"}
  //               id={"guestName"}
  //               name={"guestName"}
  //               label={"Guest Name"}
  //               ariaLabel={"Guest Name"}
  //               style={"h-10 bg-transparent outline-none flex-grow "}
  //               value={guestName}
  //               onChange={handleInputChange}
  //             />
  //             <div className="flex-shrink-0">
  //               <FaPlus
  //                 size={15}
  //                 color='blue'
  //                 className='cursor-pointer'
  //                 onClick={() => setShowButton(!showButton)}
  //               />
  //             </div>
  //           </div>
  //           {/**AUTOCOMPLETE FEITO POR MUAH - pesquisa através de API */}
  //           {searchTerm && (
  //             <ul>
  //               {filteredResults.map((item, index) => (
  //                 <li key={item.id} onClick={() => handleNameSelect(item.firstName + ' ' + item.secondName, item.id)}>
  //                   {item.firstName} {item.secondName}
  //                 </li>
  //               ))}
  //             </ul>
  //           )}
  //         </div>
  //         {/* FILTROS PARA TIPOS DE GUEST FORMS */}
  //         {showButton && (
  //           <div className="flex flex-col justify-center items-center mt-2 gap-2 px-4">
  //             <p className='text-xs text-gray-500'>{"Guest Details"}</p>
  //             <div className='flex flex-row gap-2'>
  //               <IndividualForm
  //                 buttonName={"Individual"}
  //                 buttonColor={"transparent"}
  //                 buttonClass={"h-5 w-[6rem] px-1 rounded-2xl bg-gray-300 text-xs text-black border-2 border-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"}
  //                 formTypeModal={0}
  //               />
  //               <CompanyForm
  //                 buttonName={"Company"}
  //                 buttonColor={"transparent"}
  //                 buttonClass={"h-5 w-[6rem] px-1 rounded-2xl bg-gray-300 text-xs text-black border-2 border-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"}
  //                 formTypeModal={0}
  //               />
  //               <GroupForm
  //                 buttonName={"Group"}
  //                 buttonColor={"transparent"}
  //                 buttonClass={"h-5 w-[6rem] px-1 rounded-2xl bg-gray-300 text-xs text-black border-2 border-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"}
  //                 formTypeModal={0}
  //               />
  //             </div>
  //             <div className='flex flex-row gap-2'>
  //               <TravelGroupForm
  //                 buttonName={"Travel Group"}
  //                 buttonColor={"transparent"}
  //                 buttonClass={"h-5 w-[7rem] px-1 rounded-2xl bg-gray-300 text-xs text-black border-2 border-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"}
  //                 formTypeModal={0}
  //               />
  //               <OthersForm
  //                 buttonName={"Others"}
  //                 buttonColor={"transparent"}
  //                 buttonClass={"h-5 w-[6rem] px-1 rounded-2xl bg-gray-300 text-xs text-black border-2 border-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"}
  //                 formTypeModal={0}
  //               />
  //             </div>
  //           </div>
  //         )}
  //         <div className='mt-20' style={{ maxHeight: 'calc(100% - 8rem)', overflowY: 'auto' }}>
  //           <p className='text-xs text-gray-500 px-4'>{"Reservation Details"}</p>
  //           {selectedDates.map((dateRange, index) => (
  //             <div className={`bg-white border border-gray-300 text-sm px-4 py-1 rounded-lg mt-4 mx-2 ${index === selectedDates.length - 1 ? 'mb-10' : ''}`} key={index}>
  //               <div className='flex flex-row items-center justify-between border-b-3 border-gray py-2'>
  //                 <div className='flex flex-row items-center gap-4'>
  //                   <FaBed className='' size={25} color='gray' />
  //                   <p className='text-ml'>{dateRange.roomName}</p>
  //                 </div>
  //                 <div>
  //                   <FaRegTrashAlt className="cursor-pointer" size={15} color={'gray'} onClick={() => removeEvent(index)} />
  //                 </div>
  //               </div>
  //               <div className='flex flex-row justify-around py-1'>
  //                 <div className="flex flex-col gap-2">
  //                   <label>{"In:"}</label>
  //                   <input
  //                     className='outline-none'
  //                     type="date"
  //                     value={dateRange.start}
  //                     onChange={(e) => updateDateRange(index, 'start', e.target.value)}
  //                   />
  //                 </div>
  //                 <div className="flex flex-col gap-2">
  //                   <label>{"Out:"}</label>
  //                   <input
  //                     className='outline-none'
  //                     type="date"
  //                     value={dateRange.end}
  //                     onChange={(e) => updateDateRange(index, 'end', e.target.value)}
  //                   />
  //                 </div>
  //                 <div className='flex flex-row justify-between items-center py-1'>
  //                   <p className='text-sm px-3 text-center'>N: {calculateNights(dateRange.start, dateRange.end)}</p>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //         <div className='absolute bottom-0 w-full flex justify-center gap-40 p-4 bg-lightBlue'>
  //           <ReservationsForm
  //             formTypeModal={0}
  //             buttonName={"Reserve"}
  //             //buttonIcon={<FiPlus size={15} />}
  //             editIcon={<FaCalendarAlt size={25} color="white" />}
  //             buttonColor={"primary"}
  //             modalHeader={"Enter a Reservation"}
  //             startDate={`${startDate}`}
  //             endDate={`${endDate}`}
  //             tipology={`${tipology}`}
  //             selectedDates={selectedDates}
  //             selectedRoomType={selectedRoomType}
  //             disabled={!isGuestNameValid}
  //             guestName={guestName}
  //             guestId={selectedGuestId}
  //           />
  //           <button
  //             className="text-sm"
  //             onClick={handleToggleModal}>{"Cancel"}</button>
  //         </div>
  //       </div>
  //     </>
  //   )}
  //   <div className={`bg-primary ${showModal ? 'py-4' : 'py-2'}`}>
  //     <div className='flex justify-between items-center'>
  //       <p className='text-ml text-white px-4'><b>{"Rooms Plan"}</b></p>
  //       <div className='flex items-center gap-5'>
  //         <MdOutlineZoomOut size={20} color='white' className='cursor-pointer' onClick={handleZoomOutClick} />
  //         {!showModal && (
  //           <Popover placement="bottom" showArrow offset={10}>
  //             <PopoverTrigger>
  //               <Button color="transparent" className="">
  //                 <FaCalendarAlt
  //                   color='white'
  //                   size={15}
  //                   className='cursor-pointer'
  //                 />
  //               </Button>
  //             </PopoverTrigger>
  //             <PopoverContent className="w-[250px]">
  //               {(titleProps) => (
  //                 <div className="px-1 py-2 w-full">
  //                   <p className="text-small font-bold text-foreground" {...titleProps}>
  //                     {"Filter"}
  //                   </p>
  //                   <div className="mt-2 flex flex-col justify-around">
  //                     <div className="flex items-center justify-between">
  //                       <span className='text-center font-bold'>{selectedYear}</span>
  //                       <div className='flex flex-row gap-4'>
  //                         <button onClick={() => handleYearChange('decrement')} className='p-2'>
  //                           <IoIosArrowUp size={10} />
  //                         </button>
  //                         <button onClick={() => handleYearChange('increment')} className='p-2'>
  //                           <IoIosArrowDown size={10} />
  //                         </button>
  //                       </div>
  //                     </div>
  //                     {/**EXIBIÇÃO DOS MESES EM 3 COLUNAS E 4 LINHAS */}
  //                     <div className="mt-4 grid grid-cols-4 gap-2">
  //                       {months.map((month, index) => (
  //                         <button
  //                           key={index}
  //                           onClick={() => handleMonthChange(index)}
  //                           className={`p-2 text-center rounded-full w-12 h-12 hover:bg-primary`}
  //                         >
  //                           {month}
  //                         </button>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}
  //             </PopoverContent>
  //           </Popover>
  //         )}
  //         <GrFormPrevious className='w-5 h-5 cursor-pointer text-white' onClick={goToPreviousMonth} />
  //         <p className='cursor-pointer text-white' onClick={goToCurrentMonth}>{"Today"}</p>
  //         <GrFormNext className='w-5 h-5 cursor-pointer text-white' onClick={goToNextMonth} />
  //       </div>
  //     </div>
  //   </div>
  //   <table className='w-[100%] bg-tableCol'>
  //     <thead>
  //       <tr>
  //         <th className='w-[15%] bg-tableCol text-left px-4'>{"Room Plan"}</th>
  //         {weeks.days.map((day, index) => (
  //           <td key={index} className={`h-14 border-tableCol border-l-3 border-r-3 border-b-2 ${day.date.day() === 0 || day.date.day() === 6 ? "bg-primary-50" : "bg-lightBlueCol"} select-none ${day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : ""} select-none`}>
  //             <div className='flex flex-col justify-center text-center'>
  //               <span className="text-xs text-gray-400">{daysOfWeek[day.date.day()]}</span>
  //               <span className='text-sm font-bold'>{day.date.format('DD')}</span>
  //               <span className='text-xs text-gray-400'>{months[day.date.month()]}</span>
  //             </div>
  //           </td>
  //         ))}
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {roomTypeState.map((roomType, rowIndex) => (
  //         <tr key={roomType.zinr} onClick={() => handleRowSelection(rowIndex)}>
  //           <td className="text-xs w-full h-12 flex justify-between items-center px-4 border-b-2 bg-white">
  //             <div className='flex flex-col justify-left'>
  //                <span><b>{roomType.ziname}</b></span>
  //               <span className='text-gray-500'>{roomType.katCode}</span>
  //             </div>
  //             <span>{renderHousekeepingStatus(roomType.hskStatus)}</span>
  //           </td>
  //           {weeks.days.map((day, columnIndex) => {
  //             const dayOfMonth = day.date.date(); // Obtém o dia do mês
  //             const cellId = `cell-${dayOfMonth}`; // ID exclusivo para o dia do mês
  //             const monthSelected = day.date.format('MM'); // Obtém o mês selecionado
  //             const roomInfo = `${roomType.ziname} - ${roomType.katCode}`;; // Informação do quarto

  //             return (
  //               <td
  //                 key={cellId}
  //                 id={cellId}
  //                 title={`${cellId}.${monthSelected}\n#${roomInfo}`}
  //                 className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
  //             ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")} 
  //             ${selectionInfo.zinr === roomType.zinr && selectionInfo.dates.includes(day.date.format('YYYY-MM-DD')) ? "border-3 border-blue-600 rounded-lg" : ""}
  //             ${finalSelectedCells.some(cell => cell.row === rowIndex && cell.column === columnIndex) ? "bg-sky-400" : ""}
  //             select-none`}
  //                 onMouseDown={() => {
  //                   setIsSelecting(true);
  //                   handleMouseDown(day.date, roomType.zinr, rowIndex, columnIndex);
  //                   setCellsSelection([...cellsSelection, { row: rowIndex, column: columnIndex, date: day.date }]);
  //                 }}
  //                 onMouseOver={() => {
  //                   if (isSelecting) {
  //                     handleMouseOver(day.date, rowIndex, columnIndex);
  //                     setCellsSelection([...cellsSelection, { row: rowIndex, column: columnIndex, date: day.date }]);
  //                   }
  //                 }}
  //                 onMouseUp={() => {
  //                   setIsSelecting(false);
  //                   handleMouseUp(day.date);
  //                 }}
  //                 // Novos eventos para drag and drop
  //                 onDragOver={(e) => e.preventDefault()}  // Permite o drop
  //                 onDrop={(e) => handleDrop(e, day.date, roomType)}  // Lida com o drop
  //               >
  //                 {renderReservations(
  //                   reservation.filter((res) => Number(res.roomNumber) === Number(roomType.ziname)),
  //                   day.date,
  //                   roomType
  //                 )}
  //               </td>
  //             );
  //           })}
  //         </tr>
  //       ))}
  //     </tbody>

  //   </table>
  // </div>
);
}