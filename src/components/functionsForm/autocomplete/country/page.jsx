"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function countryAutocomplete({ label, style, onChange, fieldName }) {

    const [country, setCountry] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/cardex/nationalities');
                const filteredData = res.data.response.filter(country => country.land !== "");
                setCountry(filteredData);
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
                    onChange(value, fieldName);
                    //console.log("Selected value: ", value);
                }}
            >
                {country.map((country) => (
                    <AutocompleteItem key={country.codeNr} value={country} onClick={() => onChange(country, fieldName)}>
                        {country.land}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}