"use client";
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";

export default function HeaderAutocompleteNoFilter({
  label,
  style,
  onChange,
  placeholder, // Assume this is the ID you want to match
}) {
  const [priceHeader, setPriceHeader] = useState([]);
  const [placeholderDescription, setPlaceholderDescription] = useState(""); // New state to store the descriptionName

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/v1/prices/priceDescriptionHeader");
        const filteredData = res.data.response.filter(
          (header) => header.descriptionName !== ""
        );
        setPriceHeader(filteredData);

        // Find the header with the matching ID and set the descriptionName
        const matchingHeader = filteredData.find(
          (header) => header.priceDescriptionHeaderID === parseInt(placeholder)
        );
        if (matchingHeader) {
          setPlaceholderDescription(matchingHeader.descriptionName);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [placeholder]);

  // Moved the function definition outside of the return statement
  const getFilteredHeaders = () => {
    return priceHeader; // Assuming you want to return the entire array here
  };

  return (
    <div className={style}>
      <Autocomplete
        label={label}
        classNames={{
          base: "max-w-xs",
        }}
        variant="underlined"
        placeholder={placeholderDescription} // Use the new state variable here
        onSelectionChange={(value) => {
          console.log("Autocomplete onChange called:", value);
          onChange(value);
        }}
      >
        {getFilteredHeaders().map((header) => (
          <AutocompleteItem
            key={header.priceDescriptionHeaderID}
            value={header.descriptionName} // Use a simpler value to avoid issues with object reference
            onClick={() => onChange(header)}
          >
            {header.descriptionName}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}
