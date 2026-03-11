"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function languageAutocomplete({ label, style, onChange}) {

    const [language, setLanguage] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/cardex/nationalities');
                const filteredData = res.data.response.filter(language => language.nation !== "");
                setLanguage(filteredData);
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
                {language.map((language) => (
                    <AutocompleteItem key={language.codeNr} value={language} onClick={() => onChange(language)}>
                        {language.nation}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}