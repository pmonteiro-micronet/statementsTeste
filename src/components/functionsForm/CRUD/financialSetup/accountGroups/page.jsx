"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function accountGroupInsert() {

     //inserção na tabela client preference
    const [accountGroups, setAccountGroups] = useState({
        Cod: '',
        Abreviature: '',
        Description: '',
        Order: ''
    })

    const handleInputAccountGroups = (event) => {
        setAccountGroups({ ...accountGroups, [event.target.name]: event.target.value })
    }
    function handleSubmitAccountGroups(event) {
        event.preventDefault()
        if (!accountGroups.Cod || !accountGroups.Abreviature || !accountGroups.Description || !accountGroups.Order) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/financialSetup/accountGroups', {
            data: {
                Cod: accountGroups.Cod,
                Abreviature: accountGroups.Abreviature,
                Description: accountGroups.Description,
                Order: accountGroups.Order,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputAccountGroups, handleSubmitAccountGroups
    };
}

export function accountGroupsEdit(idAccountGroups) {
    //edição na tabela client preference
    const [valuesAccountGroups, setValuesAccountGroups] = useState({
        id: idAccountGroups,
        Cod: '',
        Abreviature: '',
        Description: '',
        Order: ''
    })

    useEffect(() => {
        axios.get("/api/v1/financialSetup/accountGroups/" + idAccountGroups)
            .then(res => {
                setValuesAccountGroups({ ...valuesAccountGroups, Cod: res.data.response.ord1, Abreviature: res.data.response.name, Description: res.data.response.ord2, Order: res.data.response.dontShow })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateAccountGroups(e) {
        e.preventDefault()
        axios.patch(`/api/v1/financialSetup/accountGroups/` + idAccountGroups, {
            data: {
                Cod: valuesAccountGroups.Cod,
                Abreviature: valuesAccountGroups.Abreviature,
                Description: valuesAccountGroups.Description,
                Order: valuesAccountGroups.Order,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateAccountGroups, setValuesAccountGroups, valuesAccountGroups 
    };
}