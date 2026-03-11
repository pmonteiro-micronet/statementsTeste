"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function membersInsert() {

    //inserção na tabela members
    const [member, setMember] = useState({
        Description: '',
        Abreviature: '',
    })

    const handleInputMember = (event) => {
        setMember({ ...member, [event.target.name]: event.target.value })
    }
    function handleSubmitMember(event) {
        event.preventDefault()
        if (!member.Description || !member.Abreviature) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/members', {
            data: {
                description: member.Description,
                abreviature: member.Abreviature,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputMember, handleSubmitMember
    };

}

export function membersEdit(idMember) {

    //edição na tabela members
    const [valuesMember, setValuesMember] = useState({
        id: idMember,
        Descrition: '',
        Abreviature: '',
    })

    useEffect(() => {
        axios.get("/api/v1/cardex/members/" + idMember)
            .then(res => {
                setValuesMember({ ...valuesMember, Descrition: res.data.response.description, Abreviature: res.data.response.abreviature })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateMember(e) {
        e.preventDefault()
        axios.patch(`/api/v1/cardex/members/` + idMember, {
            data: {
                description: valuesMember.Descrition,
                abreviature: valuesMember.Abreviature,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateMember, setValuesMember, valuesMember 
    };
}