"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function vipCodeInsert() {

    //inserção na tabela vipcode
    const [vipcode, setVipcode] = useState({
        Description: '',
    })

    const handleInputVipcode = (event) => {
        setVipcode({ ...vipcode, [event.target.name]: event.target.value })
    }
    function handleSubmitVipcode(event) {
        event.preventDefault()
        if (!vipcode.Description) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/vipcode', {
            data: {
                description: vipcode.Description,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputVipcode, handleSubmitVipcode
    };

}

export function vipCodeEdit(idVipcode) {
    //edição na tabela vipcode
    const [valuesVipcode, setValuesVipcode] = useState({
        id: idVipcode,
        Descrition: '',
    })

    useEffect(() => {
        axios.get("/api/v1/cardex/vipcode/" + idVipcode)
            .then(res => {
                setValuesVipcode({ ...valuesVipcode, Descrition: res.data.response.description })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateVipcode(e) {
        e.preventDefault()
        axios.patch(`/api/v1/cardex/vipcode/` + idVipcode, {
            data: {
                description: valuesVipcode.Descrition,
            }
        })
            .catch(err => console.log(err))
    }
    return { 
        handleUpdateVipcode, setValuesVipcode, valuesVipcode 
    };
}