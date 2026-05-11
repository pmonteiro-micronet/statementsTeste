'use client'

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Importar ícone de voltar
import { IoArrowBack } from 'react-icons/io5';

const translations = {
  pt: {
    title: 'Informações da Reserva',
    room: 'Quarto',
    checkInDate: 'Data de Check-in',
    checkOutDate: 'Data de Check-out',
    booker: 'Responsável da Reserva',
    salutation: 'Saudação',
    lastName: 'Sobrenome',
    firstName: 'Nome',
    roomType: 'Tipo de Quarto',
    status: 'Status',
    totalPax: 'Total de Hóspedes',
    balance: 'Saldo',
    country: 'País'
  },
  en: {
    title: 'Reservation Information',
    room: 'Room',
    checkInDate: 'Check-in Date',
    checkOutDate: 'Check-out Date',
    booker: 'Booker',
    salutation: 'Salutation',
    lastName: 'Last Name',
    firstName: 'First Name',
    roomType: 'Room Type',
    status: 'Status',
    totalPax: 'Total Guests',
    balance: 'Balance',
    country: 'Country'
  },
  es: {
    title: 'Información de la Reserva',
    room: 'Habitación',
    checkInDate: 'Fecha de Check-in',
    checkOutDate: 'Fecha de Check-out',
    booker: 'Responsable de la Reserva',
    salutation: 'Saludo',
    lastName: 'Apellido',
    firstName: 'Nombre',
    roomType: 'Tipo de Habitación',
    status: 'Estado',
    totalPax: 'Total de Huéspedes',
    balance: 'Saldo',
    country: 'País'
  }
};

export default function InfoPage() {
  const router = useRouter();
  const [locale, setLocale] = useState('pt');
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLocale(storedLanguage);
    }

    // Ler os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const data = {
      room: params.get('room'),
      dateCI: params.get('dateCI'),
      dateCO: params.get('dateCO'),
      booker: params.get('booker'),
      salutation: params.get('salutation'),
      lastName: params.get('lastName'),
      firstName: params.get('firstName'),
      roomType: params.get('roomType'),
      resStatus: params.get('resStatus'),
      totalPax: params.get('totalPax'),
      adults: params.get('adults'),
      childs: params.get('childs'),
      balance: params.get('balance'),
      country: params.get('country')
    };
    setReservationData(data);
  }, []);

  const t = translations[locale] || translations.pt;

  const getTotalPax = () => {
    if (reservationData.totalPax) {
      return reservationData.totalPax;
    }
    
    const adults = parseInt(reservationData.adults) || 0;
    const childs = parseInt(reservationData.childs) || 0;
    const total = adults + childs;
    
    return total > 0 ? total : '-';
  };

  if (!reservationData) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <main className="flex flex-col h-full overflow-hidden p-0 m-0 bg-background">
      <div className="flex-grow overflow-y-auto p-6">
        <div className="w-full">
          {/* Botão de voltar */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-primary rounded-lg"
            >
              <IoArrowBack size={20} />
              Back
            </button>
          </div>

          <h1 className="text-xl font-bold text-textPrimaryColor mb-8">{t.title}</h1>

          {/* Container principal com layout similar ao registration form */}
          <div className="space-y-4">
            {/* Cards em coluna ocupando metade da largura à esquerda */}
            <div className="flex flex-col gap-4 w-1/2">
              {/* Informações da Reserva */}
              <div className="w-full bg-cardColor py-4 px-4 rounded-lg">
                <p className="text-[#f7ba83] mb-4 text-lg font-semibold">{t.room} & {t.roomType}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.room}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.room || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.roomType}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.roomType || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.status}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.resStatus || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">
                      {reservationData.dateCO ? t.checkOutDate : t.checkInDate}
                    </span>
                    <span className="text-textPrimaryColor text-base font-medium">
                      {reservationData.dateCO || reservationData.dateCI || '-'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.totalPax}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{getTotalPax()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.balance}</span>
                    <span className="text-textPrimaryColor text-base font-medium font-semibold">{reservationData.balance || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Informações do Hóspede */}
              <div className="w-full bg-cardColor py-4 px-4 rounded-lg">
                <p className="text-[#f7ba83] mb-4 text-lg font-semibold">{t.firstName} & {t.lastName}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.salutation}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.salutation || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.firstName}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.firstName || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.lastName}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.lastName || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.booker}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.booker || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs mb-1 font-medium">{t.country}</span>
                    <span className="text-textPrimaryColor text-base font-medium">{reservationData.country || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}