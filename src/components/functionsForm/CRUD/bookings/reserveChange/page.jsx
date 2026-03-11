"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function reserveChangeInsert() {

    //inserção na tabela reservation change
    const [reservChange, setReservChange] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputReservChange = (event) => {
        setReservChange({ ...reservChange, [event.target.name]: event.target.value })
    }
    function handleSubmitReservChange(event) {
        event.preventDefault()
        if (!reservChange.Abreviature || !reservChange.Description || !reservChange.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/reservationChange', {
            data: {
                abreviature: reservChange.Abreviature,
                description: reservChange.Description,
                ordenation: reservChange.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputReservChange, handleSubmitReservChange
    };

}

export function reserveChangeEdit(idReservChange) {
    //edição na tabela reservation change
    const [valuesReservChange, setValuesReservChang] = useState({
        id: idReservChange,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/reservationChange/' + idReservChange)
            .then(res => {
                setValuesReservChang({ ...valuesReservChange, Abreviature: res.data.response.abreviature, Description: res.data.response.description, Ordenation: res.data.response.ordenation, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateReservChange(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/reservationChange/' + idReservChange, {
            data: {
                abreviature: valuesReservChange.Abreviature,
                description: valuesReservChange.Description,
                ordenation: valuesReservChange.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateReservChange, setValuesReservChang, valuesReservChange 
    };
}