"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [reservas, setReservas] = useState([]); // Estado para armazenar as reservas
  const propertyID = 123; // Exemplo de ID de propriedade
  const today = new Date().toISOString().split('T')[0]; // Formata o dia atual como 'yyyy-mm-dd'

  const handleButtonClick = async () => {
    try {
      // Primeiro, chama a API /api/reservations/info para enviar os dados
      await axios.post('/api/reservations/info', {
        propertyID,
        data: today,
      });

      // Após o POST, chama a API GET para buscar as reservas
      const response = await axios.get('/api/reservations/checkouts');
      console.log('Reservas retornadas:', response.data); 

      // Atualiza o estado com as reservas retornadas
      setReservas(response.data.data); // Supondo que os dados estejam sob a chave 'data'

    } catch (error) {
      console.error('Erro ao enviar os dados ou buscar as reservas:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <button className='bg-red-200' onClick={handleButtonClick}>
        Ver Partidas
      </button>

      {/* Exibe as reservas */}
      <div>
        <h3>Reservas:</h3>
        <ul>
          {reservas.map((reserva, index) => (
            <li key={index}>{JSON.stringify(reserva)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
