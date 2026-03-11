"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function characteristicsInsert(){

    //inserção na tabela carateristicas
    const [caracteristica, setCaracteristica] = useState({
        Description: '',
        Abreviature: '',
        Details: ''
    })

    const handleInput = (event) => {
        setCaracteristica({ ...caracteristica, [event.target.name]: event.target.value })
    }
    function handleSubmit(event) {
        event.preventDefault()
        if (!caracteristica.Description || !caracteristica.Abreviature || !caracteristica.Details) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/hotel/caracteristicas', {
            data: {
                description: caracteristica.Description,
                abreviature: caracteristica.Abreviature,
                details: caracteristica.Details
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInput , handleSubmit
    };
}

export function characteristicsEdit(idCarateristics){
    //edição na tabela carateristicas
    const [values, setValues] = useState({
        id: idCarateristics,
        Description: '',
        Abreviature: '',
        Details: ''
    })

    useEffect(() => {
        axios.get("/api/v1/hotel/caracteristicas/" + idCarateristics)
            .then(res => {
                setValues({ ...values, Description: res.data.response.description, Abreviature: res.data.response.abreviature, Details: res.data.response.details })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdate(e) {
        e.preventDefault()
        axios.patch(`/api/v1/hotel/caracteristicas/` + idCarateristics, {
            data: {
                description: values.Description,
                abreviature: values.Abreviature,
                details: values.Details
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdate, setValues, values 
    };
}