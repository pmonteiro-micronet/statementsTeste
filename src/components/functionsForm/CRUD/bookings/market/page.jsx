"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function marketInsert() {

     //inserção na tabela market
    const [market, setMarket] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputMarket = (event) => {
        setMarket({ ...market, [event.target.name]: event.target.value })
    }
    function handleSubmitMarket(event) {
        event.preventDefault()
        if (!market.Abreviature || !market.Description || !market.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/market', {
            data: {
                abreviature: market.Abreviature,
                description: market.Description,
                ordenation: market.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputMarket, handleSubmitMarket
    };
}

export function marketEdit(idMarket) {
    //edição na tabela market
    const [valuesMarket, setValuesMarket] = useState({
        id: idMarket,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/market/' + idMarket)
            .then(res => {
                setValuesMarket({ ...valuesMarket, Abreviature: res.data.response.name, Description: res.data.response.anzahi, Ordenation: res.data.response.group, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateMarket(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/market/' + idMarket, {
            data: {
                name: valuesMarket.Abreviature,
                anzahi: valuesMarket.Description,
                group: valuesMarket.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateMarket, setValuesMarket, valuesMarket 
    };
}