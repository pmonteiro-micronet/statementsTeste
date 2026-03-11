"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function professionInsert() {

    //inserção na tabela profession
    const [profession, setProfession] = useState({
        Group: '',
        Abreviature: '',
        Description: ''
    })

    const handleInputProfession = (event) => {
        setProfession({ ...profession, [event.target.name]: event.target.value })
    }
    function handleSubmitProfession(event) {
        event.preventDefault()
        if (!profession.Group || !profession.Abreviature || !profession.Description) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/profession', {
            data: {
                group: profession.Group,
                abreviature: profession.Abreviature,
                description: profession.Description
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputProfession, handleSubmitProfession
    };
}

export function professionEdit(idProfession) {
    //edição na tabela profession
    const [valuesProfession, setValuesProffesion] = useState({
        id: idProfession,
        Group: '',
        Abreviature: '',
        Description: '',
    })

    useEffect(() => {
        axios.get('/api/v1/cardex/profession/' + idProfession)
            .then(res => {
                setValuesProffesion({ ...valuesProfession, Group: res.data.response.gruppe, Abreviature: res.data.response.abreviature, Description: res.data.response.description })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateProfession(e) {
        e.preventDefault()
        axios.patch('/api/v1/cardex/profession/' + idProfession, {
            data: {
                group: valuesProfession.Group,
                abreviature: valuesProfession.Abreviature,
                description: valuesProfession.Description
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateProfession, setValuesProffesion, valuesProfession 
    };
}