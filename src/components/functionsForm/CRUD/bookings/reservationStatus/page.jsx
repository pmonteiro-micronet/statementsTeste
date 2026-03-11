"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function reservationStatusInsert() {

     //inserção na tabela reservation status
     const [reservStatus, setReservStatus] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputReservStatus = (event) => {
        setReservStatus({ ...reservStatus, [event.target.name]: event.target.value })
    }
    function handleSubmitReservStatus(event) {
        event.preventDefault()
        if (!reservStatus.Abreviature || !reservStatus.Description || !reservStatus.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/reservationStatus', {
            data: {
                resbez: reservStatus.Abreviature,
                resmark: reservStatus.Description,
                reschar: reservStatus.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputReservStatus, handleSubmitReservStatus
    };
}

export function reservationStatusEdit(idReservStatus) {

    //edição na tabela reservation status
    const [valuesReservStatus, setValuesReservStatus] = useState({
        id: idReservStatus,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/reservationStatus/' + idReservStatus)
            .then(res => {
                setValuesReservStatus({ ...valuesReservStatus, Abreviature: res.data.response.resbez, Description: res.data.response.resmark, Ordenation: res.data.response.reschar, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateReservStatus(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/reservationStatus/' + idReservStatus, {
            data: {
                resbez: valuesReservStatus.Abreviature,
                resmark: valuesReservStatus.Description,
                reschar: valuesReservStatus.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateReservStatus, setValuesReservStatus, valuesReservStatus 
    };
}