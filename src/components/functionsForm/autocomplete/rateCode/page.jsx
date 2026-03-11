"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function RateGroupAutocomplete({ label, style, onChange, fieldName }) {

    const [price, setPrice] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/prices/priceManagement');
                const filteredData = res.data.response.filter(price => price.raterName !== "");
                setPrice(filteredData);
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
                {price.map((price) => (
                    <AutocompleteItem key={price.rategrpID} value={price} onClick={() => onChange(price, fieldName)}>
                        {price.raterName}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}