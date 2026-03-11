"use client"
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from 'axios';

export default function departmentAutocomplete({ label, style, onChange}) {

    const [department, setDepartment] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/financialSetup/departments');
                const filteredData = res.data.response.filter(department => department.departmentName !== "");
                setDepartment(filteredData);
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
                {department.map((department) => (
                    <AutocompleteItem key={department.departmentID} value={department} onClick={() => onChange(department)}>
                        {department.departmentName}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}

