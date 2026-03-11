"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function knowledgeMethodInsert() {

     //inserção na tabela knowledge method
     const [knowledgeMethod, setKnowledgeMethod] = useState({
        description: '',
        abreviature: '',
    })

    const handleInputKnowledgeMethod = (event) => {
        setKnowledgeMethod({ ...knowledgeMethod, [event.target.name]: event.target.value })
    }
    function handleSubmitKnowledgeMethod(event) {
        event.preventDefault()
        if (!knowledgeMethod.description || !knowledgeMethod.abreviature) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/cardex/knowledgeMethod', {
            data: {
                description: knowledgeMethod.description,
                abreviature: knowledgeMethod.abreviature,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputKnowledgeMethod, handleSubmitKnowledgeMethod
    };
}

export function knowledgeMethodEdit(idKnowledgeMethod) {
    //edição na tabela knowledge method
    const [valuesKnowledgeMethod, setValuesKnowledgeMethod] = useState({
        id: idKnowledgeMethod,
        Descrition: '',
        Abreviature: '',
    })

    useEffect(() => {
        axios.get("/api/v1/cardex/knowledgeMethod/" + idKnowledgeMethod)
            .then(res => {
                setValuesKnowledgeMethod({ ...valuesKnowledgeMethod, Descrition: res.data.response.description, Abreviature: res.data.response.abreviature })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateKnowledgeMethod(e) {
        e.preventDefault()
        axios.patch(`/api/v1/cardex/knowledgeMethod/` + idKnowledgeMethod, {
            data: {
                description: valuesKnowledgeMethod.Descrition,
                abreviature: valuesKnowledgeMethod.Abreviature,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateKnowledgeMethod, setValuesKnowledgeMethod, valuesKnowledgeMethod 
    };
}