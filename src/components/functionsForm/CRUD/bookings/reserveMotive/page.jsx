
"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function reserveMotiveInsert(idReservMotive) {

     //inserção na tabela motivo reserva
    const [reservMotive, setReservMotive] = useState({
        Abreviature: '',
        Description: '',
        Details: ''
    })

    const handleInputReservMotive = (event) => {
        setReservMotive({ ...reservMotive, [event.target.name]: event.target.value })
    }
    function handleSubmitReservMotive(event) {
        event.preventDefault()
        if (!reservMotive.Abreviature || !reservMotive.Description || !reservMotive.Details) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/reservationMotive', {
            data: {
                shortName: reservMotive.Abreviature,
                name: reservMotive.Description,
                className: reservMotive.Details,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputReservMotive, handleSubmitReservMotive
    };
}

export function reserveMotiveEdit(idReservMotive) {

    //edição na tabela motivo de reserva
    const [valuesReservMotive, setValuesReservMotive] = useState({
        id: idReservMotive,
        Abreviature: '',
        Description: '',
        Details: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/reservationMotive/' + idReservMotive)
            .then(res => {
                setValuesReservMotive({ ...valuesReservMotive, Abreviature: res.data.response.shortName, Description: res.data.response.name, Details: res.data.response.className, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateReservMotive(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/reservationMotive/' + idReservMotive, {
            data: {
                shortName: valuesReservMotive.Abreviature,
                name: valuesReservMotive.Description,
                className: valuesReservMotive.Details,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateReservMotive, setValuesReservMotive, valuesReservMotive 
    };
}
