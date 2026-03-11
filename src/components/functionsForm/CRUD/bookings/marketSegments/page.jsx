
"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function marketSegmentsInsert() {

     //inserção na tabela market segments
    const [marketSegment, setMarketSegment] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputMarketSegment = (event) => {
        setMarketSegment({ ...marketSegment, [event.target.name]: event.target.value })
    }
    function handleSubmitMarketSegment(event) {
        event.preventDefault()
        if (!marketSegment.Abreviature || !marketSegment.Description || !marketSegment.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/marketSegments', {
            data: {
                abreviature: marketSegment.Abreviature,
                description: marketSegment.Description,
                ordenation: marketSegment.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputMarketSegment, handleSubmitMarketSegment
    };
}

export function marketSegmentsEdit(idMarketSegment) {
    //edição na tabela market segments
    const [valuesMarketSegment, setValuesMarketSegment] = useState({
        id: idMarketSegment,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/marketSegments/' + idMarketSegment)
            .then(res => {
                setValuesMarketSegment({ ...valuesMarketSegment, Abreviature: res.data.response.abreviature, Description: res.data.response.description, Ordenation: res.data.response.ordenation, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateMarketSegment(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/marketSegments/' + idMarketSegment, {
            data: {
                abreviature: valuesMarketSegment.Abreviature,
                description: valuesMarketSegment.Description,
                ordenation: valuesMarketSegment.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateMarketSegment, setValuesMarketSegment, valuesMarketSegment 
    };
}
