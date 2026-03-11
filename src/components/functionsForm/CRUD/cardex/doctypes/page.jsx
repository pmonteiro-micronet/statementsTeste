"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function doctypesInsert() {

     //inserção na tabela doctypes
    const [doctypes, setDoctypes] = useState({
        Name: '',
        ShortName: '',
    })

    const handleInputDoctypes = (event) => {
        setDoctypes({ ...doctypes, [event.target.name]: event.target.value })
    }
    function handleSubmitDoctypes(event) {
        event.preventDefault()
        if (!doctypes.Name || !doctypes.ShortName) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/doctypes', {
            data: {
                name: doctypes.Name,
                shortName: doctypes.ShortName,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputDoctypes, handleSubmitDoctypes
    };

}

export function doctypesEdit(idDoctypes) {
    //edição na tabela doctypes
    const [valuesDoctypes, setValuesDoctypes] = useState({
        id: idDoctypes,
        Name: '',
        ShortName: '',
    })

    useEffect(() => {
        axios.get("/api/v1/cardex/doctypes/" + idDoctypes)
            .then(res => {
                setValuesDoctypes({ ...valuesDoctypes, Name: res.data.response.name, ShortName: res.data.response.shortName })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateDoctypes(e) {
        e.preventDefault()
        axios.patch(`/api/v1/cardex/doctypes/` + idDoctypes, {
            data: {
                name: valuesDoctypes.Name,
                shortName: valuesDoctypes.ShortName,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateDoctypes, setValuesDoctypes, valuesDoctypes 
    };
}