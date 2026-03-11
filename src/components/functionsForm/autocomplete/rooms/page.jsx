"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios';

export default function RoomsAutocomplete({ label, style, onChange }) {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/hotel/rooms');
                const filteredData = res.data.response.filter(room => room.label !== "");
                setRooms(filteredData);
             } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
            getData();
    }, []);

    return (
        <div className={style}>
            <Autocomplete
                label={label}
                className="max-w-xs"
                variant="underlined"
                onChange={(value) => {
                    onChange(value);
                }}
            >
                {rooms.map((room) => (
                    <AutocompleteItem key={room.roomID}  value={room} onClick={() => onChange(room)}>
                        {room.label}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
