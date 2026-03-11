"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function tipologysInsert() {

    //inserção na tabela roomtypes
    const [roomTypeState, setRoomTypeState] = useState({
        Name: '',
        Desc: '',
        RoomFeaturesDesc: '',
        TipologyGroup: ''
    })

    const handleSelect = (tipologyGroup) => {
        //console.log("ID do guestProfile selecionado:", clientForm.firstName);
        //console.log("ID do guestProfile selecionado:", clientForm.secondName);

        setRoomTypeState({
            ...roomTypeState,
            TipologyGroup: tipologyGroup.roomTypeGroupID,
        })
    };

    const handleInputRoomtype = (event) => {
        setRoomTypeState({ ...roomTypeState, [event.target.name]: event.target.value })
    }
    function handleSubmitRoomtype(event) {
        event.preventDefault()
        if (!roomTypeState.Name || !roomTypeState.Desc || !roomTypeState.RoomFeaturesDesc) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/hotel/tipologys', {
            data: {
                name: roomTypeState.Name,
                desc: roomTypeState.Desc,
                roomFeaturesDesc: roomTypeState.RoomFeaturesDesc,
                tipologyGroup: roomTypeState.TipologyGroup
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }

    return { 
        handleInputRoomtype, handleSubmitRoomtype, handleSelect
    };
}

export function tipologysEdit(idRoomtype) {
    //edição na tabela roomtypes
    const [valuesRoomtype, setValuesRoomtype] = useState({
        id: idRoomtype,
        Desc: '',
        Name: '',
        RoomFeaturesDesc: '',
        GroupID: '',
        RoomTypePlan: ''
    })

    useEffect(() => {
        axios.get("/api/v1/hotel/tipologys/" + idRoomtype)
            .then(res => {
                setValuesRoomtype({ ...valuesRoomtype, Desc: res.data.response.desc, Name: res.data.response.name, RoomFeaturesDesc: res.data.response.roomFeaturesDesc, GroupID: res.data.response.groupID, RoomTypePlan: res.data.response.roomTypePlan })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateRoomtype(e) {
        e.preventDefault()
        axios.patch(`/api/v1/hotel/tipologys/` + idRoomtype, {
            data: {
                desc: valuesRoomtype.Desc,
                name: valuesRoomtype.Name,
                roomFeaturesDesc: valuesRoomtype.RoomFeaturesDesc,
                groupID: valuesRoomtype.GroupID,
                roomTypePlan: valuesRoomtype.RoomTypePlan
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateRoomtype, setValuesRoomtype, valuesRoomtype 
    };
}