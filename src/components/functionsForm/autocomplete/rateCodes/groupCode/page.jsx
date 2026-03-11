"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios';

export default function RateGroupCodeAutocomplete({ label, style, onChange, selectedValue, setSelectedValue }) {
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
                value={selectedValue?.ratergrpExID?.toString() || ''}
                onChange={(value) => {
                    const selected = rateCode.find(rateCode => rateCode.ratergrpExID.toString() === value);
                    setSelectedValue(selected);
                    onChange(selected);
                }}
            >
                {rateCode.map((rateCode) => (
                    <AutocompleteItem key={rateCode.rategrpID} value={rateCode.ratergrpExID}>
                        {rateCode.ratergrpExID}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
