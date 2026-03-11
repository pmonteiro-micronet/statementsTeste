"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function SeasonsAutocomplete({ label, style, onChange}) {

    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/prices/seasons');
                const filteredData = res.data.response.filter(seasons => seasons.desc !== "");
                setSeasons(filteredData);
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
                    //console.log("Selected value: ", value);
                }}
            >
                {seasons.map((seasons) => (
                    <AutocompleteItem key={seasons.seasonID} value={seasons} onClick={() => onChange(seasons)}>
                        {seasons.desc}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}

