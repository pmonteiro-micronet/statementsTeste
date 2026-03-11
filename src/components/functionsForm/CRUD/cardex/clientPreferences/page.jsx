"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function clientPreferencesInsert() {

     //inserção na tabela client preference
    const [customerPreferences, setCustomerPreferences] = useState({
        Description: '',
        Abreviature: '',
    })

    const handleInputCustomerPreferences = (event) => {
        setCustomerPreferences({ ...customerPreferences, [event.target.name]: event.target.value })
    }
    function handleSubmitCustomerPreferences(event) {
        event.preventDefault()
        if (!customerPreferences.Description || !customerPreferences.Abreviature) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/customerPreferences', {
            data: {
                description: customerPreferences.Description,
                abreviature: customerPreferences.Abreviature,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputCustomerPreferences, handleSubmitCustomerPreferences
    };
}

export function clientPreferencesEdits(idCustomerPreferences) {
    //edição na tabela client preference
    const [valuesCustomerPreferences, setValuesCustomerPreferences] = useState({
        id: idCustomerPreferences,
        Descrition: '',
        Abreviature: '',
    })

    useEffect(() => {
        axios.get("/api/v1/cardex/customerPreferences/" + idCustomerPreferences)
            .then(res => {
                setValuesCustomerPreferences({ ...valuesCustomerPreferences, Descrition: res.data.response.description, Abreviature: res.data.response.abreviature })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateCustomerPreferences(e) {
        e.preventDefault()
        axios.patch(`/api/v1/cardex/customerPreferences/` + idCustomerPreferences, {
            data: {
                description: valuesCustomerPreferences.Descrition,
                abreviature: valuesCustomerPreferences.Abreviature,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateCustomerPreferences, setValuesCustomerPreferences, valuesCustomerPreferences 
    };
}