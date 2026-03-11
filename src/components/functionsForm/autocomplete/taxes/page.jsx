// ClientFormAutocomplete.js
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios';

export default function TaxesAutocomplete({ label, style, onChange }) {

    const [taxes, setTaxes] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/financialSetup/taxes');
                const filteredData = res.data.response.filter(taxes => taxes.taxesID !== "");
                setTaxes(filteredData);
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
            console.log("Selected value: ", value);
          }}
        >
          {taxes.map((taxes) => (
            <AutocompleteItem key={taxes.taxesID} value={taxes} textValue={taxes.taxesID.toString()} onClick={() => onChange(taxes)}>
              {taxes.taxesID}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    );
}
