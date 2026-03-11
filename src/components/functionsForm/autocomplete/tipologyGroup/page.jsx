// ClientFormAutocomplete.js
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";

export default function TipologyGroupAutocomplete({ label, style, onChange }) {
  const [tipologyGroup, setTipologyGroup] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/v1/hotel/tipologyGroup");
        const filteredData = res.data.response.filter(
          (tipologyGroup) => tipologyGroup.label !== ""
        );
        setTipologyGroup(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        {tipologyGroup.map((tipologyGroup) => (
          <AutocompleteItem
            key={tipologyGroup.roomTypeGroupID}
            value={tipologyGroup}
            onClick={() => onChange(tipologyGroup)}
          >
            {tipologyGroup.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}
