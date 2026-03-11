
"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function typesGroupsInsert() {

    //inserção na tabela tipology group
    const [roomtypesgroups, setRoomtypesgroups] = useState({
        Label: '',
    })

    const handleInputTypesgroups = (event) => {
        setRoomtypesgroups({ ...roomtypesgroups, [event.target.name]: event.target.value })
    }
    function handleSubmitTypesgroups(event) {
        event.preventDefault()
        if (!roomtypesgroups.Label) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/hotel/tipologyGroup', {
            data: {
                label: roomtypesgroups.Label,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }

    return {
        handleInputTypesgroups, handleSubmitTypesgroups
    };

}

export function typesGroupsEdit(idTypesgroups) {
    //edição na tabela tipology group
    const [valuesTypesgroups, setValuesTypesGroups] = useState({
        id: idTypesgroups,
        Label: '',
    })

    useEffect(() => {
        axios.get("/api/v1/hotel/tipologyGroup/" + idTypesgroups)
            .then(res => {
                setValuesTypesGroups({ ...valuesTypesgroups, Label: res.data.response.label })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateTypesgroups(e) {
        e.preventDefault()
        axios.patch(`/api/v1/hotel/tipologyGroup/` + idTypesgroups, {
            data: {
                label: valuesTypesgroups.Label,
            }
        })
            .catch(err => console.log(err))
    }

    return {
        handleUpdateTypesgroups, setValuesTypesGroups, valuesTypesgroups 
    };
}

