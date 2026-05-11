"use client";
import React, { useState, useEffect } from 'react';
import { generateDate, months, daysOfWeek } from '@/app/util/tipologyPlan/week/weekcalendar';
import dayjs from 'dayjs';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import axios from 'axios';

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';

//imports de componentes
// import ReservationsForm from '@/components/modals/frontOffice/reservations/multiReservations/page';
// // import InputFieldControlled from '@/components/functionsForm/inputs/typeText/page';
// import IndividualForm from "@/components/modals/frontOffice/clientForm/individuals/page";
// import CompanyForm from "@/components/modals/frontOffice/clientForm/companies/page";
// import TravelGroupForm from "@/components/modals/frontOffice/clientForm/travelAgency/page";
// import GroupForm from "@/components/modals/frontOffice/clientForm/groups/page";
// import OthersForm from "@/components/modals/frontOffice/clientForm/others/page";
// import { BiSolidPencil } from "react-icons/bi";
// import { FiPlus, FiX } from 'react-icons/fi';
import { FaCalendarAlt, FaRegTrashAlt, FaBed, FaShoppingCart } from 'react-icons/fa';
// import { FaPlus } from "react-icons/fa6";
// import Modal from '@/components/modals/tipologyPlan/confirmationBoxs/page';
import { IoChevronBack } from "react-icons/io5";

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";
const translations = { en, pt, es };
// import { MdOutlineZoomOut } from "react-icons/md";

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaUser } from "react-icons/fa";

import { Popover, PopoverTrigger, PopoverContent, Button } from "@nextui-org/react";
// import { getMonth } from 'date-fns';


// Configurando plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PAYMENT_TYPES = ["Transfer", "Postal Order", "Credit Card", "Voucher", "Cash"];

export default function CalendarPage({ params }) {
  const resolvedParams = React.use(params); // Resolve the promise
  const { id } = resolvedParams;
  const propertyID = id;
  const [today, setToday] = useState(dayjs());
  const [weeks, setWeeks] = useState(generateDate(today.month(), today.year()));
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [roomTypeState, setRoomTypeState] = useState([]);
  const [roomCounts, setRoomCounts] = useState({});
  const [reservation, setReservation] = useState([]);
  const [selectionInfo, setSelectionInfo] = useState({ roomTypeID: null, dates: [] }); //seleção de uma linha
  // const [selectionRows, setSelectionRows] = useState({ roomTypeID: null, dates: [] }); //seleção de uma linha
  const [availability, setAvailability] = useState({});
  const [updatedAvailability, setUpdatedAvailability] = useState({});
  // const [dragStart, setDragStart] = useState(null);
  // const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [tipology, setTipology] = useState(null);

  const [startDate2, setStartDate2] = useState(null);
  const [endDate2, setEndDate2] = useState(null);

  const [selectedDates, setSelectedDates] = useState([]);


  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [cellsSelection, setCellsSelection] = useState([]);


  //FILTRO DE BOTOES 
  const [showButton, setShowButton] = useState(false);

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [totalOverbookings, setTotalOverbookings] = useState({});
  const [overbookings, setOverbookings] = useState({});

  const [finalSelectedCells, setFinalSelectedCells] = useState([]);

  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [guestName, setGuestName] = useState('');
  // const [isLoading, setIsLoading] = useState(true);
  // const [dataFetched, setDataFetched] = useState(false);
  const [query, setQuery] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGuestNameValid, setIsGuestNameValid] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState('');
console.log(selectedRoomType, setSelectedRoomType, guestName, setGuestName, query, setQuery, searchTerm, setSearchTerm, isGuestNameValid, setIsGuestNameValid, selectedGuestId, setSelectedGuestId);
  const [isSelecting, setIsSelecting] = useState(false);
  const [groupReservation, setRoomRevervation] = useState({}); // Estado para armazenar o número de quartos associados a cada tipo de quarto

  const [nights, setNights] = useState([]);
  console.log(updatedAvailability, selectedRow, endDate2);
  console.log(query, setQuery, setGuestName, setSelectedRoomType, selectedColumn, overbookings, years, nights, setRoomRevervation, setSearchTerm, setIsGuestNameValid, setSelectedGuestId, setSelectedGuestId);
  const [locale, setLocale] = useState("pt");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [roomTypeGroups, setRoomTypeGroups] = useState([]);
  const [allDays, setAllDays] = useState([]);
  const [selectedTipology, setSelectedTipology] = useState(null);
  const [rateFilter, setRateFilter] = useState("website");
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [errors, setErrors] = useState({});

  const [rates, setRates] = useState({});
  const [cartItems, setCartItems] = useState([]); // { product, key, qty }
  const [cartQuantities, setCartQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    paymentType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
console.log(rates, setRates, cartItems, setCartItems, cartQuantities, setCartQuantities, showCart, setShowCart, formData, setFormData, errors, setErrors);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.paymentType) newErrors.paymentType = "Payment type is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    // Datas da reserva: usa selectedDates ou fallback de selecionado manualmente
    const selectedDateRange = selectedDates[0] || null;
    const checkin = selectedDateRange?.start || "";
    const checkout = selectedDateRange?.end || "";
    const nights = selectedDateRange
      ? calculateNights(selectedDateRange.start, selectedDateRange.end)
      : 1;

    // Se não houver cartItems, usa selectedRoom como item único
    const normalizedItems = cartItems.length
      ? cartItems
      : selectedRoom
      ? [{ product: selectedRoom, qty: 1 }]
      : [];

    const items = normalizedItems.map((it) => ({
      roomId: it.product.roomId,
      rateId: it.product.rateId,
      roomName: it.product.roomName,
      quantity: it.qty,
      price: (it.product.baseRate || 0) * it.qty * nights,
      ratePerNight: it.product.baseRate,
      totalForItem: (it.product.baseRate || 0) * it.qty * nights,
    }));

    const total = items.reduce((sum, it) => sum + it.totalForItem, 0);

    const bookingData = {
      booking: formData,
      items,
      dates: {
        checkin,
        checkout,
        nights,
        adults: selectedDateRange?.adults || 1,
      },
      total,
    };

    try {
      setLoading(true);

      const response = await axios.post('/api/reservations/ota/book', {
        propertyID,
        bookingData
      });

      if (response.data.success) {
        alert(`Booking submitted successfully!\nReservation ID: ${response.data.reservationId}`);

        // reset tudo
        setShowCart(false);
        setCartItems([]);
        setCartQuantities({});
        setShowModal(false);
      }

    } catch (err) {
      console.error('Booking submission error:', err);
      alert(`Booking failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
  const key = product.roomName + "-" + product.rateDescription; // ou qualquer ID único
  setCartItems((prev) => {
    const exists = prev.find((it) => it.key === key);
    if (exists) {
      return prev.map((it) =>
        it.key === key ? { ...it, qty: it.qty + 1 } : it
      );
    } else {
      return [...prev, { product, key, qty: 1 }];
    }
  });
};

const removeFromCart = (key) => {
  setCartItems((prev) => prev.filter((it) => it.key !== key));
};

  console.log(roomTypeGroups, error, searchTerm, setShowButton, showButton, selectedTipology);
  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"
  console.log("t", t);
  const handleToggleModal = () => {
    if (showModal) {
      // está a fechar → limpa seleção
      clearSelection();
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    const getData = async () => {
      try {

        // buscar tipologias
        const resTipologies = await axios.get(`/api/room_calendar/roomType`, {
          params: { propertyID }
        });

        const tipologies = resTipologies.data;

        // buscar quartos
        const resRooms = await axios.get(`/api/room_calendar/rooms`, {
          params: { propertyID }
        });

        const rooms = resRooms.data;

        // agrupar quartos por tipologia
        const roomCounts = {};
        const tipologyMap = {};

        rooms.forEach((room) => {
          const tipology = tipologies.find(
            (t) => Number(t.katnr) === Number(room.katnr)
          );

          if (!tipology) return;

          // contar quartos
          roomCounts[room.katnr] = (roomCounts[room.katnr] || 0) + 1;

          // guardar tipologia única
          if (!tipologyMap[room.katnr]) {
            tipologyMap[room.katnr] = {
              katnr: room.katnr,
              tipologyCode: tipology.kat,
              tipologyName: tipology.bez
            };
          }
        });

        const uniqueTipologies = Object.values(tipologyMap);

        setRoomTypeState(uniqueTipologies);
        setRoomCounts(roomCounts);

        // reservas
        const resBookings = await axios.get('/api/room_calendar/getreservationprotel', {
          params: {
            propertyID,
            startDate: '2026-03-01',
            endDate: '2026-03-31'
          }
        });
        console.log("reservas22:", resBookings);
        setReservation(resBookings.data);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    // Atualizar o updatedAvailability sempre que o availability for atualizado
    setUpdatedAvailability(prev => {
      const newUpdatedAvailability = { ...prev };
      for (const roomTypeID in availability) {
        for (const date in availability[roomTypeID]) {
          newUpdatedAvailability[roomTypeID] = {
            ...newUpdatedAvailability[roomTypeID],
            [date]: availability[roomTypeID][date]
          };
        }
      }
      return newUpdatedAvailability;
    });
  }, [availability]);

  const updateAvailability = () => {

    if (!reservation || !weeks[currentWeekIndex]) return;

    let updatedAvailability = {};
    let dailyOverbookings = {};

    roomTypeState.forEach(roomType => {

      const roomTypeID = roomType.katnr;

      weeks[currentWeekIndex].forEach(day => {

        const dayFormat = day.date.format('YYYY-MM-DD');

        const filteredReservations = reservation.filter(res =>
          dayjs(res.checkInDate).startOf('day').isSameOrBefore(day.date) &&
          dayjs(res.checkOutDate).endOf('day').subtract(2, 'hours').isAfter(day.date) &&
          Number(res.roomTypeNumber) === Number(roomTypeID)
        );
        console.log("reservas:", reservation);
        console.log("roomTypeState:", roomTypeState);
        console.log("roomCounts:", roomCounts);
        const reservedRooms = filteredReservations.length;
        const totalRooms = roomCounts[roomTypeID] || 0;
        const availableRooms = totalRooms - reservedRooms;

        if (!updatedAvailability[roomTypeID]) {
          updatedAvailability[roomTypeID] = {};
        }

        updatedAvailability[roomTypeID][dayFormat] = availableRooms;

        if (!dailyOverbookings[dayFormat]) {
          dailyOverbookings[dayFormat] = 0;
        }

        if (availableRooms < 0) {
          dailyOverbookings[dayFormat] += Math.abs(availableRooms);
        }

      });

    });

    setAvailability(updatedAvailability);
    setTotalOverbookings(dailyOverbookings);
    setOverbookings(dailyOverbookings);
  };

  useEffect(() => {
    updateAvailability(); // Recalculate whenever dependencies change
  }, [roomTypeState, roomCounts, reservation, currentWeekIndex]);

  // Funções para navegar entre as semanas
  const goToPreviousWeek = () => {
    let newToday = today;
    let newIndex = currentWeekIndex - 1;

    if (currentWeekIndex === 0) {
      newToday = today.subtract(1, 'month');
      const newWeeks = generateDate(newToday.month(), newToday.year());
      newIndex = newWeeks.length - 1;  // Vá para a última semana do mês anterior
      setWeeks(newWeeks);  // Atualize weeks
    }

    setToday(newToday);
    setCurrentWeekIndex(newIndex);
    updateAvailability(); // Atualize a disponibilidade quando a semana mudar
  };

  const goToNextWeek = () => {
    let newToday = today;
    let newIndex = currentWeekIndex + 1;

    if (currentWeekIndex === weeks.length - 1) {
      newToday = today.add(1, 'month');
      const newWeeks = generateDate(newToday.month(), newToday.year());
      newIndex = 0;  // Vá para a primeira semana do próximo mês
      setWeeks(newWeeks);  // Atualize weeks
    }

    setToday(newToday);
    setCurrentWeekIndex(newIndex);
    updateAvailability(); // Atualize a disponibilidade quando a semana mudar
  };


  const goToCurrentWeek = () => {
    const currentToday = dayjs();  // Pega a data atual
    setToday(currentToday);  // Atualiza o estado today para a data atual
    const newWeeks = generateDate(currentToday.month(), currentToday.year());  // Regenera as semanas para o mês atual
    setWeeks(newWeeks);

    // Calcula o índice da semana que contém o dia atual
    // const startOfMonth = currentToday.startOf('month');
    // const daysSinceStartOfMonth = currentToday.diff(startOfMonth, 'day');
    // const currentWeekIndex = Math.floor(daysSinceStartOfMonth / 7);

    // Encontre a semana que contém o dia de hoje
    const weekIndex = newWeeks.findIndex(week =>
      week.some(day => day.date.isSame(currentToday, 'day'))
    );

    setCurrentWeekIndex(weekIndex);  // Atualiza o índice da semana
    updateAvailability();  // Atualiza a disponibilidade
  };

  // Função para lidar com a atualização do número de quartos associados a um determinado tipo de quarto
  // const handleRoomCountUpdate = (katnr, count) => {
  //   setRoomRevervation(prevCounts => ({
  //     ...prevCounts,
  //     [katnr]: count
  //   }));

  //   console.log(`Número de quartos atualizado para a tipologia ${katnr}: ${count}`);
  // };

  //calcula o nrm de noites
  const calculateNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const handleMouseDown = (date, roomTypeID, rowIndex, columnIndex) => {
    const formattedDate = date.format('YYYY-MM-DD');
    setSelectionInfo({ roomTypeID, dates: [formattedDate] });
    setIsDragging(true);
    setIsSelecting(true);
    setStartDate(formattedDate);
    setSelectedRow(rowIndex);
    setSelectedColumn(columnIndex); // Define a coluna selecionada
    setSelectedCells([{ row: rowIndex, column: columnIndex }]);
    const newSelectedCell = { row: rowIndex, column: columnIndex, date };
    setCellsSelection([...cellsSelection, newSelectedCell]);
    if (ctrlPressed) {
      setSelectionInfo(prev => ({
        roomTypeID: prev.roomTypeID,
        dates: [...prev.dates, formattedDate]
      }));
      setStartDate2(formattedDate);
    }
  };

  const handleMouseOver = (date, rowIndex, columnIndex) => {
    if (isDragging && selectionInfo.roomTypeID) {
      setTipology(selectionInfo.roomTypeID);
      const formattedDate = date.format('YYYY-MM-DD');
      setSelectedCells(prevCells => [...prevCells, { row: rowIndex, column: columnIndex }]);
      if (!selectionInfo.dates.includes(formattedDate)) {
        setSelectionInfo(prev => ({
          ...prev,
          dates: [...prev.dates, formattedDate]
        }));
      }
      setSelectedRow(rowIndex); // Atualiza a linha selecionada
      setSelectedColumn(columnIndex); // Atualiza a coluna selecionada
    }
  };

  const handleMouseUp = (date) => {
    if (isDragging) {
      setIsDragging(false);
      setShowModal(true);

      setFinalSelectedCells([...selectedCells]); // copia atual
      console.log("selecionado:", [...selectedCells]);

      const formattedDate = date.format('YYYY-MM-DD');
      const selectedTipology = roomTypeState.find(
        t => t.katnr === selectionInfo.roomTypeID
      );
      const tipologyName = selectedTipology ? selectedTipology.tipologyName : '';
      const tipologyID = selectedTipology ? selectedTipology.katnr : '';
      setSelectedTipology(tipologyName);
      console.log("tipologia selecionada:", tipologyName, tipologyID);
      // Extrair o segundo número (valor) do objeto groupReservation
      const groupNumber = Object.values(groupReservation)[0] || '';

      // Calcular o número de noites
      const numberNights = calculateNights(startDate, formattedDate);
      setNights(numberNights);

      if (ctrlPressed) {
        // Se a tecla Ctrl está pressionada, defina startDate2 e endDate2
        setEndDate2(date.format('YYYY-MM-DD'), () => {
          // O estado endDate2 foi atualizado, agora você pode acessá-lo com segurança
          setSelectedDates((prevDates) => [...prevDates,
          { start: startDate, end: formattedDate, tipologyName, tipologyID, groupNumber, numberNights },
          { start: startDate2, end: formattedDate, tipologyName, tipologyID, groupNumber, numberNights },
          ]);
        });
      } else {
        // Se a tecla Ctrl não está pressionada, defina startDate e endDate
        setEndDate(date.format('YYYY-MM-DD'));
        // Usar o estado anterior para garantir que endDate tenha o valor atualizado
        setSelectedDates((prevDates) => [...prevDates, { start: startDate, end: formattedDate, tipologyName, tipologyID, groupNumber, numberNights }]);
        triggerSearchFromSelection(startDate, formattedDate, tipologyName);
      }

      // Limpar seleção após o uso
      setSelectionInfo({ roomTypeID: null, dates: [] });
    }
  };


  useEffect(() => {
    if (!isDragging && startDate && endDate) {
      console.log("Data de início:", startDate);
      console.log("Data de fim:", endDate);
      console.log("Tipologia:", tipology);
    }
  }, [isDragging, startDate, endDate, tipology]);

  // const setCurrentWeekToCurrentDate = () => {
  //   const currentToday = dayjs();  // Pega a data atual
  //   const newWeeks = generateDate(currentToday.month(), currentToday.year());  // Regenera as semanas para o mês atual
  //   setWeeks(newWeeks);
  //   setToday(currentToday);

  //   // Calcula o índice da semana atual dentro do mês
  //   const startOfMonth = currentToday.startOf('month');
  //   const daysSinceStartOfMonth = currentToday.diff(startOfMonth, 'day');
  //   const newCurrentWeekIndex = Math.floor(daysSinceStartOfMonth / 7);

  //   setCurrentWeekIndex(newCurrentWeekIndex);  // Atualiza o índice da semana
  // };


  // Função para lidar com o pressionamento da tecla Ctrl
  const handleKeyDown = (event) => {
    if (event.key === 'Control') {
      setCtrlPressed(true);
    }
  };

  // Função para lidar com a liberação da tecla Ctrl
  const handleKeyUp = (event) => {
    if (event.key === 'Control') {
      setCtrlPressed(false);
    }
  };

  // Adicionando event listeners quando o componente é montado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Removendo event listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Função para lidar com a seleção da linha
  const handleRowSelection = (rowIndex) => {
    const filteredCells = selectedCells.filter(cell => cell.row === rowIndex);
    setSelectedCells(filteredCells);
  };

  const removeEvent = (index) => {
    const updatedSelectedDates = [...selectedDates];
    updatedSelectedDates.splice(index, 1);
    setSelectedDates(updatedSelectedDates);
  };

  const updateDateRange = (index, field, value) => {
    const updatedDates = [...selectedDates];
    updatedDates[index][field] = value;
    setSelectedDates(updatedDates);
  };

  // const handleInputChange = (event) => {
  //   setGuestName(event.target.value);
  //   setSearchTerm(event.target.value);
  //   setIsGuestNameValid(query.some(item => `${item.firstName} ${item.secondName}` === event.target.value));
  // };

  //RESOLVER ISTO DEPOIS
  // useEffect(() => {
  //   const getData = async () => {
  //     if (!dataFetched) {
  //       setIsLoading(true);
  //       try {
  //         const res = await axios.get("/api/frontOffice/clientForm/individuals");
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

  // const handleNameSelect = (selectedName, id) => {
  //   setGuestName(selectedName);
  //   setSelectedGuestId(id);
  //   setSearchTerm('');
  //   setIsGuestNameValid(filteredResults.some(item => `${item.firstName} ${item.secondName}` === selectedName));
  // };

  // useEffect(() => {
  //   console.log("Selected Guest ID:", selectedGuestId);
  // }, [selectedGuestId]);

  // const filteredResults = query.filter(item => {
  //   const fullName = `${item.firstName} ${item.secondName}`.toLowerCase();
  //   return fullName.includes(searchTerm.toLowerCase());
  // });

  /*const formatDateToDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatDateToInput = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `20${year}-${month}-${day}`;
  };

  const handleDateChange = (index, field, value) => {
    const formattedDate = formatDateToInput(value);
    updateDateRange(index, field, formattedDate);
  };*/

  // const showAlert = (message) => {
  //   alert(message);
  // };

  const handleYearChange = (action) => {
    let newYear;
    if (action === 'increment') {
      newYear = selectedYear + 1;
    } else if (action === 'decrement') {
      newYear = selectedYear - 1;
    }

    setSelectedYear(newYear);

    // Atualiza a data para o primeiro dia do novo ano e mês atual
    const newToday = dayjs().year(newYear).month(selectedMonth).date(1);
    setToday(newToday);

    // Regenera as semanas para o novo ano e mês
    const newWeeks = generateDate(newToday.month(), newToday.year());
    setWeeks(newWeeks);

    // Atualiza o índice da semana para a primeira semana do novo mês e ano
    setCurrentWeekIndex(0);

    updateAvailability(); // Atualiza a disponibilidade
  };

  const handleMonthChange = (month) => {
    const newMonth = parseInt(month, 10);
    setSelectedMonth(newMonth);

    // Atualiza a data para o primeiro dia do novo mês e ano atual
    const newToday = dayjs().year(selectedYear).month(newMonth).date(1);
    setToday(newToday);

    // Regenera as semanas para o novo mês e ano
    const newWeeks = generateDate(newToday.month(), newToday.year());
    setWeeks(newWeeks);

    // Atualiza o índice da semana para a primeira semana do novo mês e ano
    setCurrentWeekIndex(0);

    updateAvailability(); // Atualiza a disponibilidade
  };

  // useEffect para atualizar os dados quando o mês ou o ano é alterado
  useEffect(() => {
    const newToday = dayjs().year(selectedYear).month(selectedMonth).date(1);
    setToday(newToday);

    const newWeeks = generateDate(newToday.month(), newToday.year());
    setWeeks(newWeeks);

    // Atualiza o índice da semana para a primeira semana do novo mês e ano
    setCurrentWeekIndex(0);

    updateAvailability(); // Atualiza a disponibilidade
  }, [selectedYear, selectedMonth]);  // Executa o efeito quando selectedYear ou selectedMonth mudar

  // const handleZoomOutClick = () => {
  //   window.location.href = '/homepage/frontOffice/tipology_Plan/zoom_out';
  // }

  const clearSelection = () => {
    setFinalSelectedCells([]);
    setCellsSelection([]);
    setSelectionInfo({
      roomTypeID: null,
      dates: [],
    });
    setSelectedDates([]);
  };

  const triggerSearchFromSelection = async (start, end, tipology) => {
    const nights = calculateNights(start, end);

    const newForm = {
      checkin: start,
      checkout: end,
      nights,
      adults: 1, // ou outro valor default
    };

    await handleSearch(newForm, tipology);
  };

  const handleSearch = async (customForm, tipologyParam) => {
  // aqui usamos apenas o customForm
  const activeForm = customForm; // já que não há form global
  setError(null);
  setLoading(true);
  setProducts([]);
  setRoomTypeGroups([]);
  setSelectedRoomType(null);

  try {
    const days = [];
    const start = new Date(activeForm.checkin);

    const nights =
      Number(activeForm.nights) ||
      calculateNights(activeForm.checkin, activeForm.checkout) ||
      1;

    for (let i = 0; i < nights; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(formatDate(d));
    }

    setAllDays(days);

    const maxAdults = Number(activeForm.adults) || 1;
    const requests = [];

    for (const day of days) {
      const nextDay = formatDate(new Date(new Date(day).getTime() + 24 * 60 * 60 * 1000));
      for (let persons = 1; persons <= maxAdults; persons++) {
        requests.push(
          axios
            .post("/api/reservations/ota/available_products", {
              propertyID,
              checkin: day,
              checkout: nextDay,
              adults: persons,
            })
            .then((r) => ({ day, persons, res: r }))
        );
      }
    }

    const results = await Promise.all(requests);

    // Processar produtos como antes
    const productsArray = [];

    results.forEach(({ day, persons, res }) => {
      const data = res.data.products ? res.data : res.data.data || {};
      const dayProducts = data.products || [];
      const rooms = data.rooms || [];

      const roomIdToCount = {};
      rooms.forEach((r) => {
        const roomId = r.roomId?.value ?? r.roomId;
        const count = r.count?.value ?? r.count ?? 0;
        roomIdToCount[roomId] = count;
      });

      dayProducts.forEach((p) => {
        const roomId = p.roomId?.value ?? p.roomId;
        const rateId = p.rateId?.value ?? p.rateId;
        const roomName = p.roomName ?? "Unknown";
        const roomType = p.roomType ?? "Unknown";
        const currency = p.currency?.value ?? "EUR";
        let dailyAmount = Number(p.baseRate?.amountAfterTax ?? p.baseRate ?? 0);

        if (p.baseDailyAmounts?.baseDailyAmount) {
          const arr = Array.isArray(p.baseDailyAmounts.baseDailyAmount)
            ? p.baseDailyAmounts.baseDailyAmount
            : [p.baseDailyAmounts.baseDailyAmount];

          const found = arr.find((d) => (d.day?.value ?? d.day) === day);
          if (found) dailyAmount = Number(found.amountAfterTax ?? dailyAmount);
        }

        productsArray.push({
          roomId,
          rateId,
          roomName,
          roomType,
          rateDescription: p.rateDescription,
          currency,
          baseRate: dailyAmount,
          persons,
          available: roomIdToCount[roomId] ?? 0,
          raw: p,
          day,
        });
      });
    });

    const normalize = (str) =>
      str
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const filteredProducts = productsArray.filter((p) => {
      if (!tipologyParam) return true;

      const roomName = normalize(p.roomName);
      const roomType = normalize(p.roomType);
      const tipology = normalize(tipologyParam);
      console.log("Comparando:", { roomName, roomType, tipology });

      return roomName.includes(tipology) || roomType.includes(tipology);
    });

    setProducts(filteredProducts);

    // Populate rates for calendar display
    const newRates = {};
    productsArray.forEach((p) => {
      const roomType = p.roomType;
      const found = roomTypeState.find(
        (rt) => rt.tipologyName === roomType || rt.tipologyCode === roomType
      );
      if (found) {
        const katnr = found.katnr;
        const day = p.day;
        const rate = p.baseRate;
        // Determine filter key based on roomName
        const filterKey = p.roomName.toLowerCase().includes("website")
          ? "website"
          : p.roomName.toLowerCase().includes("booking")
          ? "booking"
          : "all";
        if (!newRates[katnr]) newRates[katnr] = {};
        if (!newRates[katnr][day]) newRates[katnr][day] = {};
        newRates[katnr][day][filterKey] = rate;
      }
    });
    setRates(newRates);
  } catch (err) {
    console.error(err);
    setError("Erro ao procurar disponibilidade");
  } finally {
    setLoading(false);
  }
};

const handleSearchCalendar = async (customForm) => {
  const activeForm = customForm;

  setError(null);
  setLoading(true);
  setProducts([]);

  try {
    // 🔹 Gerar dias
    const days = [];
    const start = new Date(activeForm.checkin);
    const nights = Number(activeForm.nights) || 1;

    for (let i = 0; i < nights; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(formatDate(d));
    }

    setAllDays(days);

    const requests = [];

    // 🔹 Requests por dia
    for (const day of days) {
      const nextDay = formatDate(
        new Date(new Date(day).getTime() + 24 * 60 * 60 * 1000)
      );

      requests.push(
        axios
          .post("/api/reservations/ota/available_products", {
            propertyID,
            checkin: day,
            checkout: nextDay,
            adults: 1,
          })
          .then((r) => ({ day, res: r }))
      );
    }

    const results = await Promise.all(requests);

    // 🔥 ARRAY FINAL DE PRODUCTS (SEM FILTROS)
    const productsArray = [];

    results.forEach(({ day, res }) => {
      const data = res.data.products ? res.data : res.data.data || {};
      const dayProducts = data.products || [];
      const rooms = data.rooms || [];

      // 🔹 disponibilidade por roomId
      const roomIdToCount = {};
      rooms.forEach((r) => {
        const roomId = r.roomId?.value ?? r.roomId;
        const count = r.count?.value ?? r.count ?? 0;
        roomIdToCount[roomId] = count;
      });

      dayProducts.forEach((p) => {
        const roomId = p.roomId?.value ?? p.roomId;

        let dailyAmount = Number(
          p.baseRate?.amountAfterTax ?? p.baseRate ?? 0
        );

        // 🔹 preço por dia específico
        if (p.baseDailyAmounts?.baseDailyAmount) {
          const arr = Array.isArray(p.baseDailyAmounts.baseDailyAmount)
            ? p.baseDailyAmounts.baseDailyAmount
            : [p.baseDailyAmounts.baseDailyAmount];

          const found = arr.find(
            (d) => (d.day?.value ?? d.day) === day
          );

          if (found) {
            dailyAmount = Number(
              found.amountAfterTax ?? dailyAmount
            );
          }
        }

        // 🔥 GUARDA TUDO — SEM FILTROS
        productsArray.push({
          roomId,
          rateId: p.rateId?.value ?? p.rateId,
          roomName: p.roomName ?? "",
          roomType: p.roomType ?? "",
          rateDescription: p.rateDescription,
          currency: p.currency?.value ?? "EUR",
          baseRate: dailyAmount,
          available: roomIdToCount[roomId] ?? 0,
          day,
          raw: p,
        });
      });
    });

    // 🔥 SET FINAL
    setProducts(productsArray);

    console.log("✅ PRODUCTS FINAL:", productsArray);

  } catch (err) {
    console.error(err);
    setError("Erro ao procurar disponibilidade");
  } finally {
    setLoading(false);
  }
};

// useEffect permanece igual
useEffect(() => {
  if (!roomTypeState.length) return;

  const calendarDays = weeks[currentWeekIndex].map(day => day.date.toDate());
  if (calendarDays.length === 0) return;

  const newForm = {
    checkin: calendarDays[0],
    checkout: calendarDays[calendarDays.length - 1],
    nights: calendarDays.length,
    adults: 1,
  };

  handleSearchCalendar(newForm);
}, [currentWeekIndex, roomTypeState]);

  return (
    <div className='w-full'>
      {showModal && (
        <div className='fixed top-0 right-0 bg-lightBlue h-screen w-[30%] z-10 flex flex-col'>

          {/* 🔥 SCROLL PRINCIPAL */}
          <div className="flex-1 overflow-y-auto mt-4 px-2 min-h-0 pb-28">

            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <>
                <div className='flex items-center justify-between px-2'>
                  <p className='text-xs text-gray-500'>Reservation Details</p>
                  <div className='relative'>
                    <button
                      onClick={() => setShowCart((prev) => !prev)}
                      className='relative p-2 hover:bg-gray-200 rounded-full transition'
                    >
                      <FaShoppingCart size={18} />
                      {cartItems.length > 0 && (
                        <span className='absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center'>
                          {cartItems.length}
                        </span>
                      )}
                    </button>
                    {showCart && (
                      <div className='absolute right-0 mt-1 p-2 bg-white border rounded shadow-lg w-64 z-30'>
                        <div className='flex justify-between items-center mb-2'>
                          <h4 className='text-sm font-semibold'>Cart Items</h4>
                          <button onClick={() => setShowCart(false)} className='text-xs text-gray-500'>Close</button>
                        </div>
                        <div className='max-h-48 overflow-auto'>
                          {cartItems.length === 0 ? (
                            <p className='text-xs text-gray-500'>Carrinho vazio</p>
                          ) : (
                            cartItems.map((item) => (
                              <div key={item.key} className='flex justify-between items-center text-xs mb-1'>
                                <div>
                                  <p className='font-medium'>{item.product.roomName}</p>
                                  <p>{item.qty} x {item.product.baseRate?.toFixed(2) ?? '0.00'}</p>
                                </div>
                                <button
                                  className='text-red-500 hover:text-red-700'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.key);
                                  }}
                                >
                                  Remover
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDates.map((dateRange, index) => (
                  <div
                    key={index}
                    className='bg-white border border-gray-300 text-sm px-4 py-2 rounded-lg mt-4'
                  >
                    <div className='flex justify-between items-center py-2'>
                      <div className='flex items-center gap-4'>
                        <FaBed size={25} color='gray' />
                        <p>{dateRange.tipologyName}</p>
                      </div>

                      <FaRegTrashAlt
                        className="cursor-pointer"
                        size={15}
                        color='gray'
                        onClick={() => removeEvent(index)}
                      />
                    </div>

                    <div className='flex justify-around py-1'>
                      <div className="flex flex-col gap-1">
                        <label>In:</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            updateDateRange(index, 'start', e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label>Out:</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            updateDateRange(index, 'end', e.target.value)
                          }
                        />
                      </div>

                      <div className='flex items-center'>
                        <p>N: {calculateNights(dateRange.start, dateRange.end)}</p>
                      </div>

                      <div className='flex flex-row items-center gap-2'>
                        <FaUser size={15} />
                        <p>1</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* AVAILABLE ROOMS */}
                <div className="sticky top-0 bg-lightBlue z-10 mt-6 py-2">
                  <p className="text-xs text-gray-500">Available Rooms</p>
                </div>

                {loading && <p className="text-sm text-gray-400">Loading...</p>}
                {!loading && products.length === 0 && (
                  <p className="text-sm text-gray-400">No rooms available</p>
                )}

                {!loading && products.length > 0 && (
                  <div className="w-full my-4">
                    <div className="overflow-x-auto">

                      <div className="mb-3">
                        <label className="mr-2 font-medium">Tarifa:</label>
                        <select
                          value={rateFilter}
                          onChange={(e) => setRateFilter(e.target.value)}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="website">Website</option>
                          <option value="booking">Booking</option>
                          <option value="all">Todas</option>
                        </select>
                      </div>

                      <table className="min-w-full border text-sm">
                        <thead>
                          <tr className="bg-primary text-white sticky top-0 z-10">
                            <th className="border px-2 py-2">Room Name</th>
                            <th className="border px-2 py-2">Available</th>
                            {allDays.map((day) => (
                              <th key={day} className="border px-2 py-2">{day}</th>
                            ))}
                            <th className="border px-2 py-2">Total</th>
                          </tr>
                        </thead>

                        <tbody>
                          {(() => {
                            const filteredProducts = products.filter((product) => {
                              if (rateFilter === "all") return true;
                              const name = product.roomName.toLowerCase();
                              if (rateFilter === "website") return name.includes("website");
                              if (rateFilter === "booking") return name.includes("booking");
                              return true;
                            });

                            const grouped = filteredProducts.reduce((acc, product) => {
                              const key = product.roomName;
                              if (!acc[key]) acc[key] = [];
                              acc[key].push(product);
                              return acc;
                            }, {});

                            return Object.entries(grouped).map(([roomName, group], index) => {
                              const dailyMap = {};
                              let available = 0;

                              group.forEach((p) => {
                                dailyMap[p.day] = Number(p.baseRate);
                                available = Math.max(available, Number(p.available));
                              });

                              const currency = group[0].currency || "EUR";

                              const formatAmount = (amt) => {
                                if (!Number.isFinite(amt)) return "-";
                                return amt.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) + ` ${currency}`;
                              };

                              const total = Object.values(dailyMap).reduce((s, v) => s + (v || 0), 0);

                              const isSelectedCart = cartItems.some((item) => item.product.roomName === roomName && item.product.rateId === group[0]?.rateId);
                              return (
                                <tr
                                  key={roomName + index}
                                  className={`hover:bg-gray-50 cursor-pointer ${isSelectedCart ? 'bg-blue-100' : ''}`}
                                  onClick={() => {
                                    const selected = {
                                      roomId: group[0]?.roomId,
                                      rateId: group[0]?.rateId,
                                      roomName,
                                      roomType: group[0]?.roomType,
                                      rateDescription: group[0]?.rateDescription,
                                      baseRate: group[0]?.baseRate,
                                      currency: group[0]?.currency,
                                      total,
                                      available,
                                    };
                                    setSelectedRoom(selected);
                                    addToCart(selected);
                                  }}
                                >
                                <td className="border px-2 py-2">{roomName}</td>
                                <td className="border px-2 py-2 text-center">{available}</td>

                                {allDays.map((day) => (
                                  <td key={`${roomName}-${day}`} className="border px-2 py-2 text-center">
                                    {dailyMap[day] !== undefined ? formatAmount(dailyMap[day]) : "-"}
                                  </td>
                                ))}

                                <td className="border px-2 py-2 text-center font-semibold">
                                  {formatAmount(total)}
                                </td>
                              </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="w-full space-y-6 text-textPrimaryColor">

                <button
                  className="text-sm rounded"
                  onClick={() => setStep(1)}
                >
                  <IoChevronBack />
                </button>

                {/* Personal Information */}
                <div>
                  <h3 className="font-semibold text-base mb-4 text-gray-800">Personal Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="John"
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="font-semibold text-base mb-4 text-gray-800">Address Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.postalCode ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="12345"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="New York"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.country ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      <option value="">-- Select Country --</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-base mb-4 text-gray-800">Payment Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Payment *</label>
                    <select
                      name="paymentType"
                      value={formData.paymentType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.paymentType ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      <option value="">-- Select Payment Type --</option>
                      {PAYMENT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.paymentType && <p className="text-red-500 text-xs mt-1">{errors.paymentType}</p>}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    <span>Items in cart: </span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="text-sm text-gray-700 mb-2">
                      {cartItems.map((item) => (
                        <div key={item.key} className="flex justify-between">
                          <span>{item.product.roomName} x{item.qty}</span>
                          <span>{(item.product.baseRate * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : selectedRoom ? (
                    <div className="text-sm text-gray-700 mb-2">
                      <p className="font-medium">{selectedRoom.roomName} x1</p>
                    </div>
                  ) : null}

                  <div className="text-lg font-semibold flex justify-between text-gray-800">
                    <span>Total:</span>
                    <span>
                      {cartItems.length > 0
                        ? `${cartItems.reduce((sum, it) => sum + (it.product.baseRate || 0) * it.qty, 0).toFixed(2)} ${cartItems[0]?.product.currency || 'EUR'}`
                        : selectedRoom
                        ? `${(selectedRoom.total || 0).toFixed(2)} ${selectedRoom.currency}`
                        : '0'}
                    </span>
                  </div>
                </div>
              </div>

            )}

            <div className="h-10" />
          </div>

          {/* 🔥 FOOTER */}
          <div className='absolute bottom-0 w-full flex justify-center gap-10 p-4 bg-lightBlue border-t'>

            {step === 1 && (
              <button
                className={`text-sm px-4 py-2 rounded ${selectedDates.length === 0 || !selectedRoom
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-primary text-white"
                  }`}
                disabled={selectedDates.length === 0 || !selectedRoom}
                onClick={() => setStep(2)}
              >
                Reserve
              </button>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <button
                  className="text-sm bg-primary text-white px-4 py-2 rounded"
                  onClick={handleSubmit}
                >
                  Reserve
                </button>
              </>
            )}

            {/* SEMPRE VISÍVEL */}
            <button
              className="text-sm px-4 py-2 rounded border border-gray-400"
              onClick={handleToggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={`transition-all duration-300 ${showModal ? 'w-[65%]' : 'w-full'}`}>

        {/* HEADER */}
        <div className={`bg-primary ${showModal ? 'py-4' : 'py-2'}`}>
          <div className='flex justify-between items-center'>
            <p className='text-ml text-white px-4'><b>{"Typology plan"}</b></p>
            <div className='flex items-center gap-5'>

              {!showModal && (
                <Popover placement="bottom" showArrow offset={10}>
                  <PopoverTrigger>
                    <Button color="transparent">
                      <FaCalendarAlt color='white' size={15} className='cursor-pointer' />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[250px]">
                    {(titleProps) => (
                      <div className="px-1 py-2 w-full">
                        <p className="text-small font-bold text-foreground" {...titleProps}>
                          {"Filter"}
                        </p>

                        <div className="mt-2 flex flex-col justify-around">
                          <div className="flex items-center justify-between">
                            <span className='text-center font-bold'>{selectedYear}</span>

                            <div className='flex flex-row gap-4'>
                              <button onClick={() => handleYearChange('decrement')} className='p-2'>
                                <IoIosArrowUp size={10} />
                              </button>
                              <button onClick={() => handleYearChange('increment')} className='p-2'>
                                <IoIosArrowDown size={10} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-4 gap-2">
                            {months.map((month, index) => (
                              <button
                                key={index}
                                onClick={() => handleMonthChange(index)}
                                className="p-2 text-center rounded-full w-12 h-12 hover:bg-primary"
                              >
                                {month}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              )}

              <GrFormPrevious className='w-5 h-5 cursor-pointer text-white' onClick={goToPreviousWeek} />
              <p className='cursor-pointer text-white' onClick={goToCurrentWeek}>Today</p>
              <GrFormNext className='w-5 h-5 cursor-pointer text-white' onClick={goToNextWeek} />
            </div>
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className='w-full bg-tableCol'>
            <thead>
              <tr>
                {/*CABEÇALHO DA TABELA C/ FORMATAÇÃO DE DATA */}
                <th className='w-[15%] bg-tableCol text-left px-4'>
                  {`${weeks[currentWeekIndex][0].date.format("DDMMM").toUpperCase()} - 
${weeks[currentWeekIndex][weeks[currentWeekIndex].length - 1].date.format("DDMMM").toUpperCase()}`}
                </th>
                {weeks[currentWeekIndex].map((day, index) => (
                  <td key={index} className={`w-[5%] h-14 border-tableCol border-l-3 border-r-3 border-b-2 ${day.date.day() === 0 || day.date.day() === 6 ? "bg-tableColWeekend" : "bg-lightBlueCol"} select-none 
              ${day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : ""} select-none`}>
                    <div className='flex flex-col justify-center text-center'>
                      <span className="text-xs text-gray-400">{daysOfWeek[day.date.day()]}</span>
                      <span className='text-sm font-bold'>{day.date.format('DD')}</span>
                      <span className='text-xs text-gray-400'>{months[day.date.month()]}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {/*EXIBE AS TIPOLOGIAS E O NRM DE QUARTOS ASSOCIADOS A CADA UMA */}
              {roomTypeState.map((roomType, rowIndex) => (
                <tr key={roomType.katnr} onClick={() => handleRowSelection(rowIndex)}>
                 <td className='text-xs w-full h-10 flex items-center justify-between px-4 border-b-2 bg-white'>
  <span>{roomType.tipologyCode}</span>
  <div className='flex flex-row items-center gap-2'>
    <span>{roomCounts[roomType.katnr] || 0}</span>
    {/* <span><BiSolidPencil size={15} color='gray' onClick={() => {
      const newCount = prompt("Enter the number of rooms:");
      if (newCount !== null && !isNaN(newCount)) {
        handleRoomCountUpdate(roomType.katnr, parseInt(newCount));
      }
    }} /></span> */}
  </div>
</td>
{weeks[currentWeekIndex].map((day, index) => {
  const formattedDate = day.date.format('YYYY-MM-DD');

  const availableRooms = availability[roomType.katnr]?.[formattedDate] ?? 0;

  const normalize = (str) =>
    str?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Cores de seleção
  const isSelected =
    selectionInfo.roomTypeID === roomType.katnr &&
    selectionInfo.dates.includes(formattedDate);

  const isCellSelected = finalSelectedCells.some(
    (cell) => cell.row === rowIndex && cell.column === index
  );

  // Produtos para esta célula — **sempre calculados, independente da seleção**
  const cellProducts = products.filter((p) => {
    const matchesDay = p.day === formattedDate;

    const matchesTipologyInName =
      normalize(p.roomName).includes(normalize(roomType.tipologyName)) ||
      normalize(p.roomName).includes(normalize(roomType.tipologyCode));

    const rateType = p.roomName?.toLowerCase().includes("website")
      ? "website"
      : p.roomName?.toLowerCase().includes("booking")
      ? "booking"
      : "all";

    const matchesRateFilter =
      rateFilter === "all" || rateFilter === rateType;

    return matchesDay && matchesTipologyInName && matchesRateFilter;
  });

  // Preço mínimo da célula — sempre visível
  const rate =
    cellProducts.length > 0
      ? Math.min(...cellProducts.map((p) => p.baseRate))
      : null;

  return (
    <td
      key={index}
      style={{ backgroundColor: isCellSelected ? "#f5bb88" : "" }}
      className={`
        text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg
        ${(day.date.day() === 0 || day.date.day() === 6)
          ? "bg-lightBlueCol"
          : day.date.isSame(today, "day")
          ? "bg-primary bg-opacity-30"
          : "bg-white"}
        ${isSelected ? "border-3 border-blue-600 rounded-lg" : ""}
        select-none
      `}
      onMouseDown={() => {
        setIsSelecting(true);
        handleMouseDown(day.date, roomType.katnr, rowIndex, index);
        setCellsSelection([...cellsSelection, { row: rowIndex, column: index, date: day.date }]);
      }}
      onMouseOver={() => {
        if (isSelecting) {
          handleMouseOver(day.date, rowIndex, index);
          setCellsSelection([...cellsSelection, { row: rowIndex, column: index, date: day.date }]);
        }
      }}
      onMouseUp={() => {
        setIsSelecting(false);
        handleMouseUp(day.date);
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <span className='text-xs'>{availableRooms}</span>
        <span className="text-[10px] text-gray-500">
          {rate != null ? `${Number(rate).toFixed(2)}€` : "-"}
        </span>
      </div>
    </td>
  );
})}
                </tr>
              ))}
              <tr>
                {/*LINHA SEPARADORA DA GRELHA */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'></td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}></td>
                  );
                })}
              </tr>
              <tr>
                {/*DAY USE LINHA */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"Day Use"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/* CALCULA O NÚMERO DE QUARTOS DISPONÍVEIS */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"Total Available"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  const totalAvailable = roomTypeState.reduce((acc, roomType) => {
                    return acc + (availability[roomType.katnr]?.[day.date.format('YYYY-MM-DD')] || 0);
                  }, 0);
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                  ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}
                    >
                      {totalAvailable}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {/* TOTAL OVERBOOKING */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"Total Overbooking"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  const dayFormat = day.date.format('YYYY-MM-DD');
                  const totalOverbooking = totalOverbookings[dayFormat] || 0;
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg
                  ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")}
                  `}>
                      {totalOverbooking}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {/*ALLOT - NON DED/NOT PU */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"ALLOT - NON DED/NOT PU"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*ALLOT - NON DED/PU */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"ALLOT - NON DED/PU"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*ALLOT - DEDUCT/NOT PU */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"ALLOT - DEDUCT/NOT PU"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*ALLOT - DEDUCT/PU */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"ALLOT - DEDUCT/PU"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*OUT OF ORDER*/}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"OUT OF ORDER"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*OPTION - DEDUCT*/}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"OPTION - DEDUCT"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*OPTION - NON DEDUCT*/}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"OPTION - NON DEDUCT"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*CONFIRMED - DEDUCT*/}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"CONFIRMED - DEDUCT"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}>0</td>
                  );
                })}
              </tr>
              <tr>
                {/*CALCULA O NRM DE QUARTOS FISICOS DISPONIVEIS*/}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"Physically Available"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  const totalAvailable = roomTypeState.reduce((acc, roomType) => {
                    return acc + (availability[roomType.katnr]?.[day.date.format('YYYY-MM-DD')] || 0);
                  }, 0);
                  return (
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                  ${(day.date.day() === 0 || day.date.day() === 6) ? "bg-lightBlueCol" : (day.date.isSame(today, 'day') ? "bg-primary bg-opacity-30" : "bg-white")
                        }`}
                    >
                      {totalAvailable}
                    </td>
                  );
                })}
              </tr>
              <tr>
                {/*
            CALCULA A % DE QUARTOS JÁ OCUPADOS
            O% - TODOS OS QUARTOS LIVRES | 100% - TODOS OS QUARTOS OCUPADOS
            */}
                <td className='text-xs w-full h-8 flex justify-between items-center px-4 border-b-2 bg-white'>
                  <span>{"Occupancy"}</span>
                </td>
                {weeks[currentWeekIndex].map((day, index) => {
                  // const totalAvailableRooms = roomTypeState.reduce((acc, roomType) => {
                  //   return acc + (availability[roomType.katnr]?.[day.date.format('YYYY-MM-DD')] || 0);
                  // }, 0);
                  const totalOccupiedRooms = roomTypeState.reduce((acc, roomType) => {
                    const availableRooms = availability[roomType.katnr]?.[day.date.format('YYYY-MM-DD')] || 0;
                    const occupiedRooms = (roomCounts[roomType.katnr] || 0) - availableRooms;
                    return acc + occupiedRooms;
                  }, 0);
                  const totalRooms = roomTypeState.reduce((acc, roomType) => acc + (roomCounts[roomType.katnr] || 0), 0);
                  const dailyOccupancyPercentage = totalRooms > 0 ? Math.round((totalOccupiedRooms / totalRooms) * 100) : 0;

                  return (
                    /*
                    PINTA A CELULA DE ACORDO COM A %
                    VERDE 0 A 49
                    AMARELO 50 A 69
                    VERMELHO 70 A 100
                    */
                    <td
                      key={index}
                      className={`text-center text-sm border-l-3 border-r-3 border-b-2 rounded-lg 
                  ${dailyOccupancyPercentage <= 49 ? "bg-green bg-opacity-30" : ""} 
                  ${dailyOccupancyPercentage >= 50 && dailyOccupancyPercentage <= 69 ? "bg-yellow-100" : ""} 
                  ${dailyOccupancyPercentage >= 70 ? "bg-red-200" : ""} 
                  border-tableCol select-none`}>
                      {dailyOccupancyPercentage}%
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}