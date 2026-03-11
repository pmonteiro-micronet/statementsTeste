// ClientFormAutocomplete.js
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from 'axios';


export default function AccountGroupAutocomplete({ label, style, onChange }) {

    const [accountGroups, setAccountGroups] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('/api/v1/financialSetup/accountGroups');
                const filteredData = res.data.response.filter(accountGroups => accountGroups.accountsGroupsID !== "");
                setAccountGroups(filteredData);
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
          {accountGroups.map((accountGroups) => (
            <AutocompleteItem key={accountGroups.accountsGroupsID} value={accountGroups} textValue={accountGroups.accountsGroupsID.toString()} onClick={() => onChange(accountGroups)}>
              {accountGroups.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    );
}
