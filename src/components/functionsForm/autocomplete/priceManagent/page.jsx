"use client";
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

import axios from "axios";

export default function PriceManagementGroupAutocomplete({
  label,
  style,
  onChange,
}) {
  const [tipology, setTipology] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/v1/hotel/tipologys");
        const filteredData = res.data.response.filter(
          (tipology) => tipology.name !== ""
        );
        setTipology(filteredData);
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
          //console.log("Selected value: ", value);
        }}
      >
        {tipology.map((tipology) => (
          <AutocompleteItem
            key={tipology.roomTypeID}
            value={tipology}
            onClick={() => onChange(tipology)}
          >
            {tipology.name}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}
