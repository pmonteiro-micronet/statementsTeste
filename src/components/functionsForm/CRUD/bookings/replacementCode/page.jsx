"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function replacementCodeInsert() {

     //inserção na tabela replacement code
    const [replaceCode, setReplaceCode] = useState({
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    const handleInputReplaceCode = (event) => {
        setReplaceCode({ ...replaceCode, [event.target.name]: event.target.value })
    }
    function handleSubmitReplaceCode(event) {
        event.preventDefault()
        if (!replaceCode.Abreviature || !replaceCode.Description || !replaceCode.Ordenation) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/bookings/replacementCode', {
            data: {
                abreviature: replaceCode.Abreviature,
                description: replaceCode.Description,
                ordenation: replaceCode.Ordenation,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputReplaceCode, handleSubmitReplaceCode
    };
}

export function replacementCodeEdit(idReplaceCode) {

    //edição na tabela replacement code
    const [valuesReplaceCode, setValuesReplaceCode] = useState({
        id: idReplaceCode,
        Abreviature: '',
        Description: '',
        Ordenation: ''
    })

    useEffect(() => {
        axios.get('/api/v1/bookings/replacementCode/' + idReplaceCode)
            .then(res => {
                setValuesReplaceCode({ ...valuesReplaceCode, Abreviature: res.data.response.abreviature, Description: res.data.response.description, Ordenation: res.data.response.ordenation, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateReplaceCode(e) {
        e.preventDefault()
        axios.patch('/api/v1/bookings/replacementCode/' + idReplaceCode, {
            data: {
                abreviature: valuesReplaceCode.Abreviature,
                description: valuesReplaceCode.Description,
                ordenation: valuesReplaceCode.Ordenation,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateReplaceCode, setValuesReplaceCode, valuesReplaceCode 
    };
}