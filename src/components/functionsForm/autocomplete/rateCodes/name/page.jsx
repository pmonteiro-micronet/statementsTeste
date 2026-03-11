"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function rateGroupNameAutocomplete({ label, style, onChange}) {

    const [rateCode, setRateCode] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/prices/priceManagement');
                const filteredData = res.data.response.filter(rateCode => rateCode.raterName !== "");
                setRateCode(filteredData);
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
                onSelectionChange={(value) => {
                    onChange(value);
                    //console.log("Selected value: ", value);
                }}
            >
                {rateCode.map((rateCode) => (
                    <AutocompleteItem key={rateCode.rategrpID} value={rateCode.rategrpID} onClick={() => onChange(rateCode)}>
                        {rateCode.raterName}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}