"use client"
import React, { useState, useEffect } from "react";
import {Select, SelectItem} from "@nextui-org/react";

import axios from 'axios';

export default function caracteristicsAutocomplete({ label, style, onChange}) {

    const [caracteristics, setCaracteristics] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/hotel/caracteristicas');
                const filteredData = res.data.response.filter(caracteristics => caracteristics.abreviature !== "");
                setCaracteristics(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, []);

    return (
        <div className={style}>
            <Select
                label={label}
                className="max-w-xs"
                variant="underlined"
                selectionMode="multiple"
                onChange={(value) => {
                    onChange(value);
                    //console.log("Selected value: ", value);
                }}
            >
                {caracteristics.map((caracteristics) => (
                    <SelectItem  key={caracteristics.characteristicID} value={caracteristics.characteristicID} onClick={() => onChange(caracteristics)}>
                        {caracteristics.abreviature}
                    </SelectItem >
                ))}
            </Select>
        </div>
    );
}