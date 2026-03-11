"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function transferInsert() {

    //inserção na tabela transfers
    const [transfer, setTransfer] = useState({
        class: '',
        name: '',
        shortName: ''
    })

    const handleInputTransfer = (event) => {
        setTransfer({ ...transfer, [event.target.name]: event.target.value })
    }
    function handleSubmitTransfer(event) {
        event.preventDefault()
        if (!transfer.class || !transfer.name || !transfer.shortName) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/transfers', {
            data: {
                class: transfer.class,
                name: transfer.name,
                shortName: transfer.shortName
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputTransfer, handleSubmitTransfer
    };
}

export function transferEdit(idTransfer) {

    //edição na tabela transfers
    const [valuesTransfer, setValuesTransfer] = useState({
        id: idTransfer,
        Class: '',
        Name: '',
        ShortName: ''
    })

    useEffect(() => {
        axios.get("/api/v1/bookings/transfers/" + idTransfer)
            .then(res => {
                setValuesTransfer({ ...valuesTransfer, Class: res.data.response.class, Name: res.data.response.name, ShortName: res.data.response.shortName })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateTransfer(e) {
        e.preventDefault()
        axios.patch(`/api/v1/bookings/transfers/` + idTransfer, {
            data: {
                class: valuesTransfer.Class,
                name: valuesTransfer.Name,
                shortName: valuesTransfer.ShortName
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateTransfer, setValuesTransfer, valuesTransfer 
    };
}