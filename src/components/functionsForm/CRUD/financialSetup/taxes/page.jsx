"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function taxesInsert() {

     //inserção na tabela doctypes
    const [taxes, setTaxes] = useState({
        Cod: '',
        Abreviature: '',
        Description: '',
    })

    const handleInputTaxes = (event) => {
        setTaxes({ ...taxes, [event.target.name]: event.target.value })
    }
    function handleSubmitTaxes(event) {
        event.preventDefault()
        if (!taxes.Cod || !taxes.Abreviature || !taxes.Description) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/financialSetup/taxes', {
            data: {
            cod: taxes.Cod,
            description: taxes.Description,
            abreviature: taxes.Abreviature 
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputTaxes, handleSubmitTaxes
    };

}

export function taxesEdit(idTaxes) {
    //edição na tabela doctypes
    const [valuesTaxes, setValuesTaxes] = useState({
        id: idTaxes,
        Cod: '',
        Abreviature: '',
        Description: '',
    })

    useEffect(() => {
        axios.get("/api/v1/financialSetup/taxes/" + idTaxes)
            .then(res => {
                setValuesTaxes({ ...valuesTaxes, Cod: res.data.response.mainGroup, Abreviature: res.data.response.recordShortName, Description: res.data.response.recordName })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateTaxes(e) {
        e.preventDefault()
        axios.patch(`/api/v1/financialSetup/taxes/` + idTaxes, {
            data: {
                cod: valuesTaxes.Cod,
                abreviature: valuesTaxes.Abreviature,
                description: valuesTaxes.Description
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateTaxes, setValuesTaxes, valuesTaxes 
    };
}