
"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function roomsInsert() {

    //inserção na tabela rooms
    const [room, setRoom] = useState({
        Label: '',
        Description: '',
        CharacteristcID: '',
        RoomTypeID: ''
    })

    //preenchimento automatico de tipologia atraves de autocomplete
    const handleTipologySelect = (tipology) => {
        setRoom({
            ...room,
            RoomTypeID: tipology,
        })
    };

    //preenchimento automatico das carateristicas atraves de autocomplete
    const handleCaracteristicSelect = (caracteristics) => {
        setRoom({
            ...room,
            CharacteristcID: [caracteristics],
        })
    };
    const handleInputRoom = (event) => {
        setRoom({ ...room, [event.target.name]: event.target.value })
    }

    async function handleSubmitRoom(event) {
        event.preventDefault()
        if (!room.Label || !room.Description) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {

            //alterar e concertar isto
            const roomCreationInfo = await axios.put('/api/v1/hotel/rooms', {
                data: {
                    Label: room.Label,
                    Description: room.Description,
                    roomType: room.RoomTypeID,
                }
            });

            // const newRecordRoomID = await roomCreationInfo.data.newRecord.roomID.toString();
            // Envio da solicitação para criar localidades
            // const caracteristicCreationInfo = await axios.put('/api/v1/hotel/rooms/roomCharacteristics', {
            //     data: {
            //         characteristicID: room.CharacteristcID,
            //         roomID: newRecordRoomID,
            //     }
            // });

            // console.log(roomCreationInfo, caracteristicCreationInfo); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }

    }
    return {
        handleInputRoom, handleSubmitRoom, handleCaracteristicSelect, handleTipologySelect
    };
}

export function roomsEdit(idRoom) {
    //edição na tabela rooms
    const [valuesRoom, setValuesRoom] = useState({
        id: idRoom,
        Label: '',
        RoomType: '',
        Description: ''
    })

    useEffect(() => {
        axios.get("/api/v1/hotel/rooms/" + idRoom)
            .then(res => {
                setValuesRoom({ ...valuesRoom, Label: res.data.response.label, RoomType: res.data.response.roomType, Description: res.data.response.description })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateRoom(e) {
        e.preventDefault()
        axios.patch(`/api/v1/hotel/rooms/` + idRoom, {
            data: {
                label: valuesRoom.Label,
                roomType: valuesRoom.RoomType,
                description: valuesRoom.Description
            }
        })
            .catch(err => console.log(err))
    }

    return {
        handleUpdateRoom, setValuesRoom, valuesRoom
    };
}

