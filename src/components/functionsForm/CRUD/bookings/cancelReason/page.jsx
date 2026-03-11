"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function cancelReasonInsert() {

    //inserção na tabela razao cancelamento
    const [cancelation, setCancelation] = useState({
        Abreviature: '',
        Description: '',
        Details: ''
    })

    const handleInputCancelReason = (event) => {
        setCancelation({ ...cancelation, [event.target.name]: event.target.value })
    }
    function handleSubmitCancelReason(event) {
        event.preventDefault()
        if (!cancelation.Abreviature || !cancelation.Description || !cancelation.Details) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/cancelationReasons', {
            data: {
                shortName: cancelation.Abreviature,
                name: cancelation.Description,
                class: cancelation.Details,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputCancelReason, handleSubmitCancelReason
    };
}

export function cancelReasonEdit(idCancelReason) {
    //edição na tabela razão de cancelamento
    const [valuesCancelReason, setValuesCancelReason] = useState({
        id: idCancelReason,
        Abreviature: '',
        Description: '',
        Details: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/cancelationReasons/' + idCancelReason)
            .then(res => {
                setValuesCancelReason({ ...valuesCancelReason, Abreviature: res.data.response.shortName, Description: res.data.response.name, Details: res.data.response.class, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateCancelReason(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/cancelationReasons/' + idCancelReason, {
            data: {
                shortName: valuesCancelReason.Abreviature,
                name: valuesCancelReason.Description,
                class: valuesCancelReason.Details,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateCancelReason, setValuesCancelReason, valuesCancelReason 
    };
}