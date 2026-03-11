// ClientFormAutocomplete.js
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios';

export default function ClientFormAutocomplete({ label, style, variant,  onChange }) {

    const [clientForm, setClientForm] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/frontOffice/clientForm/individuals');
                const filteredData = res.data.response.filter(client => client.cc !== "");
                setClientForm(filteredData);
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
          variant={variant}
          onChange={(value) => {
            onChange(value);
            //console.log("Selected value: ", value);
          }}
        >
          {clientForm.map((clientForm) => (
            <AutocompleteItem key={clientForm.guestProfileID} value={clientForm} onClick={() => onChange(clientForm)}>
              {clientForm.cc}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    );
}
