"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function ReservationInsert(guestName, guestId, startDate, endDate, tipology, selectedDates) {
  const [filteredRoom, setFilteredRoom] = useState(null);
  const currentDate = new Date().toLocaleDateString('en-CA');
  const guestNumberDefault = 1;

  // Separando o nome completo em primeiro e segundo nome
  const nameParts = guestName.split(" ");
  const firstName = nameParts.length > 0 ? nameParts[0] : "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const initialReservationState = {
    CheckIn: startDate ? startDate : currentDate,
    CheckOut: endDate ? endDate : '',
    NightCount: '',
    GuestNumber: guestNumberDefault,
    GuestID: guestId,
    Language: '',
    Tipology: '',
    RoomNumber: '',
  };

  // Inserting into the client preference table
  const [reservation, setReservation] = useState(initialReservationState);

  useEffect(() => {
    setReservation(prevState => ({
      ...prevState,
      Tipology: tipology,
      GuestID: guestId
    }));
  }, [tipology, guestId]);

  // Atualiza o estado de firstName e lastName separadamente
  const [name, setName] = useState({
    firstName: firstName,
    lastName: lastName,
  });

  useEffect(() => {
    setName({ firstName, lastName });
  }, [firstName, lastName]);

  //preenchimento automatico do idioma atraves de autocomplete
  const handleLanguageSelect = (language) => {
    setReservation({
      ...reservation,
      Language: language.codeNr
    });
  };

  //preenchimento automatico da tipologia atraves de autocomplete
  const handleTipologySelect = (tipology) => {
    setReservation({
      ...reservation,
      Tipology: tipology.roomTypeID
    });
  };

  const handleInputReservation = (event) => {
    setReservation({ ...reservation, [event.target.name]: event.target.value });
  };

  const handleSubmitReservationForTab = (tabIndex, reservationData) => {
    axios.put(`/api/v1/frontOffice/reservations/roomsPlan`, {
      data: {
        checkInDate: reservationData.CheckIn,
        checkOutDate: reservationData.CheckOut,
        nightCount: reservationData.NightCount,
        adultCount: reservationData.GuestNumber,
        guestNumber: reservationData.GuestID,
        roomTypeNumber: reservationData.Tipology,
        roomNumber: reservationData.RoomNumber,
      }
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('Erro ao enviar requisições:', error);
      });
  };

  async function handleSubmitReservation(event) {
    if (!event.isTrusted) {
      return;
    }

    event.preventDefault();

    // Verifica se todos os campos estão preenchidos
    {/*if (!reservation.CheckIn || !reservation.CheckOut || !reservation.NightCount || !reservation.GuestNumber || !reservation.GuestID || !reservation.Tipology) {
      alert("Preencha os campos corretamente");
      return;
    }*/}

    // Envia uma solicitação para a API para cada tab
    selectedDates.forEach((dateRange, index) => {
      handleSubmitReservationForTab(index, {
        CheckIn: dateRange.start,
        CheckOut: dateRange.end,
        NightCount: dateRange.numberNights,
        GuestNumber: reservation.GuestNumber,
        GuestID: reservation.GuestID,
        Tipology: dateRange.tipologyID,
        RoomNumber: dateRange.roomName,
      });
    });
  }

  return {
    handleInputReservation, handleSubmitReservation, setReservation, reservation, handleLanguageSelect, handleTipologySelect, name
  };
}
