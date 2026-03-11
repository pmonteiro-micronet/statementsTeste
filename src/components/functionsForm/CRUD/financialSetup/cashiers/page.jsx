"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function cashiersInsert() {

     //inserção na tabela doctypes
    const [cashiers, setCashiers] = useState({
        Cod: '',
        Abreviature: '',
        Password: '',
    })

    const handleInputCashiers = (event) => {
        setCashiers({ ...cashiers, [event.target.name]: event.target.value })
    }
    function handleSubmitCashiers(event) {
        event.preventDefault()
        if (!cashiers.Cod || !cashiers.Abreviature || !cashiers.Password) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/financialSetup/cashiers', {
            data: {
            cod: cashiers.Cod,
            password: cashiers.Password,
            abreviature: cashiers.Abreviature 
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputCashiers, handleSubmitCashiers
    };

}

export function cashiersEdit(idCashiers) {
    //edição na tabela doctypes
    const [valuesCashiers, setValuesCashiers] = useState({
        id: idCashiers,
        Cod: '',
        Abreviature: '',
        Password: '',
    })

    useEffect(() => {
        axios.get("/api/v1/financialSetup/cashiers/" + idCashiers)
            .then(res => {
                setValuesCashiers({ ...valuesCashiers, Cod: res.data.response.extCashierId, Abreviature: res.data.response.cashierName, Password: res.data.response.password })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateCashiers(e) {
        e.preventDefault()
        axios.patch(`/api/v1/financialSetup/cashiers/` + idCashiers, {
            data: {
                cod: valuesCashiers.Cod,
                abreviature: valuesCashiers.Abreviature,
                password: valuesCashiers.Password
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateCashiers, setValuesCashiers, valuesCashiers 
    };
}