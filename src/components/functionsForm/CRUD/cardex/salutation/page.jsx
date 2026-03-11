"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function salutationInsert() {

    //inserção na tabela reservation status
    const [salutation, setSalutation] = useState({
        Abreviature: '',
        Description: '',
        Title: '',
        Ordenation: '',
        Gender: '',
    })

    const handleInputSalutation = (event) => {
        setSalutation({ ...salutation, [event.target.name]: event.target.value })
    }
    function handleSubmitSalutation(event) {
        event.preventDefault()
        if (!salutation.Abreviature || !salutation.Description || !salutation.Title || !salutation.Ordenation || !salutation.Gender) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/salutation', {
            data: {
                abreviature: salutation.Abreviature,
                description: salutation.Description,
                title: salutation.Title,
                ordenation: salutation.Ordenation,
                gender: salutation.Gender,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return {
        handleInputSalutation, handleSubmitSalutation
    };
}

export function salutationEdit(idSalutation) {

    //edição na tabela reservation status
    const [valuesSalutation, setValuesSalutation] = useState({
        id: idSalutation,
        Abreviature: '',
        Description: '',
        Title: '',
        Ordenation: '',
        Gender: '',
    })

    useEffect(() => {
        axios.get('/api/v1/cardex/salutation/' + idSalutation)
            .then(res => {
                setValuesSalutation({ ...valuesSalutation, Abreviature: res.data.response.suffix, Description: res.data.response.salutationCode, Title: res.data.response.salutation, Ordenation: res.data.response.type, Gender: res.data.response.inet, })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateSalutation(e) {
        e.preventDefault()
        axios.patch('/api/v1/cardex/salutation/' + idSalutation, {
            data: {
                abreviature: valuesSalutation.Abreviature,
                description: valuesSalutation.Description,
                title: valuesSalutation.Title,
                ordenation: valuesSalutation.Ordenation,
                gender: valuesSalutation.Gender,
            }
        })
            .catch(err => console.log(err))
    }

    return {
        handleUpdateSalutation, setValuesSalutation, valuesSalutation
    };
}