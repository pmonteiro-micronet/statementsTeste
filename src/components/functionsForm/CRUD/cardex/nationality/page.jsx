"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function nationalityInsert() {

    //inserção na tabela nationality
    const [nacionality, setNacionality] = useState({
        Nation: '',
        Statnr: '',
        Ordenation: '',
        Group: '',
        Isocode: '',
        Fo: '',
        Nationality: '',
    })

    const handleInputNacionality = (event) => {
        setNacionality({ ...nacionality, [event.target.name]: event.target.value })
    }
    function handleSubmitNacionality(event) {
        event.preventDefault()
        if (!nacionality.Nation.trim() || !nacionality.Statnr.trim() || !nacionality.Ordenation.trim() || !nacionality.Group.trim() || !nacionality.Isocode.trim() || !nacionality.Fo.trim() || !nacionality.Nationality.trim()) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/nationalities', {
            data: {
                nation: nacionality.Nation,
                statnr: nacionality.Statnr,
                ordenation: nacionality.Ordenation,
                group: nacionality.Group,
                isocode: nacionality.Isocode,
                fo: nacionality.Fo,
                nationality: nacionality.Nationality,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputNacionality, handleSubmitNacionality
    };
}

export function nationalityEdit(idNacionality) {
    //edição na tabela nationality
    const [valuesNacionality, setValuesNationality] = useState({
        id: idNacionality,
        Nation: '',
        Statnr: '',
        Ordenation: '',
        Group: '',
        Isocode: '',
        Fo: '',
        Nationality: '',
    })

    useEffect(() => {
        axios.get('/api/v1/cardex/nationalities/' + idNacionality)
            .then(res => {
                setValuesNationality({ ...valuesNacionality, Nation: res.data.response.land, Statnr: res.data.response.statNr, Ordenation: res.data.response.brkopftyp, Group: res.data.response.gruppe, Isocode: res.data.response.isocode, Fo: res.data.response.showFO, Nationality: res.data.response.nation })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateNationality(e) {
        e.preventDefault()
        axios.patch('/api/v1/cardex/nationalities/' + idNacionality, {
            data: {
                nation: valuesNacionality.Nation,
                statnr: valuesNacionality.Statnr,
                ordenation: valuesNacionality.Ordenation,
                group: valuesNacionality.Group,
                isocode: valuesNacionality.Isocode,
                fo: valuesNacionality.Fo,
                nationality: valuesNacionality.Nationality,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateNationality, setValuesNationality, valuesNacionality 
    };
}