"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function maintenanceInsert() {

    //inserção na tabela maintenance
    const [maintenance, setMaintenance] = useState({
        Abreviature: '',
        Details: '',
        Description: ''
    })

    const handleInputMaintenance = (event) => {
        setMaintenance({ ...maintenance, [event.target.name]: event.target.value })
    }
    function handleSubmitMaintenance(event) {
        event.preventDefault()
        if (!maintenance.Abreviature || !maintenance.Details || !maintenance.Description) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/hotel/maintenance', {
            data: {
                abreviature: maintenance.Abreviature,
                details: maintenance.Details,
                description: maintenance.Description,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputMaintenance, handleSubmitMaintenance
    };
}

export function maintenanceEdit(idMaintenance){
    //edição na tabela maintenance
    const [valuesMaintenance, setValuesMaintenance] = useState({
        id: idMaintenance,
        Abreviature: '',
        Details: '',
        Description: ''
    })

    useEffect(() => {
        axios.get("/api/v1/hotel/maintenance/" + idMaintenance)
            .then(res => {
                setValuesMaintenance({ ...valuesMaintenance, Abreviature: res.data.response.abreviature, Details: res.data.response.details, Description: res.data.response.description })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateMaintenance(e) {
        e.preventDefault()
        axios.patch(`/api/v1/hotel/maintenance/` + idMaintenance, {
            data: {
                abreviature: valuesMaintenance.Abreviature,
                details: valuesMaintenance.Details,
                description: valuesMaintenance.Description
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateMaintenance, setValuesMaintenance, valuesMaintenance 
    };
}