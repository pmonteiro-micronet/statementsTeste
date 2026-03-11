"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function cancelTypeInsert() {

    //inserção na tabela tipo cancelamento
    const [cancelationType, setCancelationtype] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputCancelType = (event) => {
        setCancelationtype({ ...cancelationType, [event.target.name]: event.target.value })
    }
    function handleSubmitCancelType(event) {
        event.preventDefault()
        if (!cancelationType.Abreviature || !cancelationType.Description || !cancelationType.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/cancelationTypes', {
            data: {
                abreviature: cancelationType.Abreviature,
                description: cancelationType.Description,
                ordenation: cancelationType.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputCancelType, handleSubmitCancelType
    };
}

export function cancelTypeEdit(idCancelType) {
    //edição na tabela tipo de cancelamento
    const [valuesCancelType, setValuesCancelType] = useState({
        id: idCancelType,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/cancelationTypes/' + idCancelType)
            .then(res => {
                setValuesCancelType({ ...valuesCancelType, Abreviature: res.data.response.abreviature, Description: res.data.response.description, Ordenation: res.data.response.ordenation, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateCancelType(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/cancelationTypes/' + idCancelType, {
            data: {
                abreviature: valuesCancelType.Abreviature,
                description: valuesCancelType.Description,
                ordenation: valuesCancelType.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateCancelType, setValuesCancelType, valuesCancelType 
    };
}