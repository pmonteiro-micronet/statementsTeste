"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function groupsInsert() {

    //inserção na tabela client preference
    const [group, setGroup] = useState({
        name: '',
        abreviature: ''
    })

    const handleInputGroup = (event) => {
        setGroup({ ...group, [event.target.name]: event.target.value })
    }
    async function handleSubmitGroup(event) {
        event.preventDefault()

        if (!group.name || !group.abreviature) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {
            // Envio da solicitação para criar o indivíduo
            const response = await axios.put('/api/v1/frontOffice/clientForm/groups', {
                data: {
                    name: group.name,
                    shortName: group.abreviature
                }
            });
            //console.log(response); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }

    }
    return {
        handleInputGroup, handleSubmitGroup
    };
}

export function groupsEdit(idIndividual) {
    //edição na tabela client preference
    const [valuesGroup, setValuesGroup] = useState({
        id: idIndividual,
        name: '',
        abreviature: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envio da solicitação para obter os dados do indivíduo
                const groupResponse = await axios.get("/api/v1/frontOffice/clientForm/groups/" + idIndividual);

                setValuesGroup({
                    ...valuesGroup,
                    name: groupResponse.data.response.name,
                    abreviature: groupResponse.data.response.shortName,
                });

                console.log(groupResponse); // Exibe as respostas do servidor no console
            } catch (error) {
                console.error('Erro ao enviar requisições:', error);
            }
        };

        fetchData();
    }, [idIndividual]);


    function handleUpdateGroup(e) {
        e.preventDefault()
        axios.patch(`/api/v1/frontOffice/clientForm/groups/` + idIndividual, {
            data: {
                name: valuesGroup.name,
                shortName: valuesGroup.abreviature
            }
        })
            .catch(err => console.log(err))

    }

    return {
        handleUpdateGroup, setValuesGroup, valuesGroup
    };
}
