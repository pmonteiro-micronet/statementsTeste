"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function formsKnowledgeInsert() {

     //inserção na tabela forms of knowledge
    const [knowledge, setKnowledge] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputKnowledge = (event) => {
        setKnowledge({ ...knowledge, [event.target.name]: event.target.value })
    }
    function handleSubmitKnowledge(event) {
        event.preventDefault()
        if (!knowledge.Abreviature || !knowledge.Description || !knowledge.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/formsKnowledge', {
            data: {
                abreviature: knowledge.Abreviature,
                description: knowledge.Description,
                ordenation: knowledge.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputKnowledge, handleSubmitKnowledge
    };
}

export function formsKnowledgeEdit(idKnowledge) {

    //edição na tabela forms of knowledge
    const [valuesKnowledge, setValuesKnowledge] = useState({
        id: idKnowledge,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/formsKnowledge/' + idKnowledge)
            .then(res => {
                setValuesKnowledge({ ...valuesKnowledge, Abreviature: res.data.response.abreviature, Description: res.data.response.description, Ordenation: res.data.response.ordenation, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateKnowledge(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/formsKnowledge/' + idKnowledge, {
            data: {
                abreviature: valuesKnowledge.Abreviature,
                description: valuesKnowledge.Description,
                ordenation: valuesKnowledge.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateKnowledge, setValuesKnowledge, valuesKnowledge 
    };
}