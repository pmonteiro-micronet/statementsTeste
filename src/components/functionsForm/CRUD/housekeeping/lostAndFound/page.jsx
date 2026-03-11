import { useState, useEffect } from "react";
import axios from "axios";

// Hook para inserção de registros de Achados e Perdidos
export default function useLostAndFoundInsert() {
    const [lostAndFound, setLostAndFound] = useState({
        hotelCode: '',
        roomNumber: '',
        customerID: '',
        referenceNumber: '',
        date: '',
        userName: '',
        isFound: '',
        foundDate: '',
        foundByUser: '',
        foundText: '',
        reportReference: '',
        location: '',
        document: '',
        submissionDate: '',
        submittedByUser: '',
        foundLocation: '',
        localText: ''
    });

    const handleInputChangeLostAndFound = (event) => {
        setLostAndFound({ ...lostAndFound, [event.target.name]: event.target.value });
    };

    const handleSubmitLostAndFound = (event) => {
        event.preventDefault();
        if(!lostAndFound.date || !lostAndFound.isFound || !lostAndFound.roomNumber || !lostAndFound.location || !lostAndFound.foundByUser || !lostAndFound.userName || !lostAndFound.description){
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/housekeeping/lostAndFound', {
            data: { 
                date: lostAndFound.date,
                isFound: lostAndFound.isFound,
                roomNumber: lostAndFound.roomNumber,
                location: lostAndFound.location,
                foundByUser: lostAndFound.foundByUser,
                userName: lostAndFound.userName,
                description: lostAndFound.description,
             }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err));
    };

    return { lostAndFound, handleInputChangeLostAndFound, handleSubmitLostAndFound };
}

// Hook para edição de registros de Achados e Perdidos
export function useLostAndFoundEdit(idLostandFound) {
    const [valueslostAndFound, setValuesLostAndFound] = useState({
        //hotelCode: '',
        roomNumber: '',
        //customerID: '',
        referenceNumber: idLostandFound,
        date: '',
        userName: '',
        isFound: '',
       // foundDate: '',
        foundByUser: '',
        //foundText: '',
       // reportReference: ,
        location: '',
        description: '',
        //document: '',
       // submissionDate: '',
        //submittedByUser: '',
        //foundLocation: '',
        //localText: ''
    });

    useEffect(() => {
        axios.get("/api/v1/housekeeping/lostAndFound/" + idLostandFound)
            .then(res => {
                setValuesLostAndFound({ ...valueslostAndFound, RoomNumber: res.data.response.roomNumber, Date: res.data.response.date, UserName: res.data.response.userName, IsFound: res.data.response.isFound, 
                    FoundByUser: res.data.response.foundByUser, Location: res.data.response.location, Description: res.data.response.description});
            })
            .catch(err => console.log(err));
    });

    const handleUpdateLostAndFound = (event) => {
        e.preventDefault();
        axios.patch("/api/v1/housekeeping/lostAndFound/" + idLostandFound, {
            data: {
                date: valueslostAndFound.Date,
                isFound: valueslostAndFound.IsFound,
                roomNumber: valueslostAndFound.RoomNumber,
                location: valueslostAndFound.Location,
                foundByUser: valueslostAndFound.FoundByUser,
                userName: valueslostAndFound.UserName,
                description: valueslostAndFound.Description,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err));
    };

    return { valueslostAndFound, setValuesLostAndFound, handleUpdateLostAndFound };
}