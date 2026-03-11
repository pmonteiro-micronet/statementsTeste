"use client";
import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import axios from "axios";

export default function HeaderAutocomplete({
  label,
  style,
  onChange,
  placeholder,
  isDisabled,
  click,
}) {
  const [priceHeader, setPriceHeader] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'expired', 'future'
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/api/v1/prices/priceDescriptionHeader");
        const filteredData = res.data.response.filter(
          (header) => header.descriptionName !== ""
        );
        setPriceHeader(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  });

  // Function to filter headers based on the selected filter
  const getFilteredHeaders = () => {
    const now = new Date();

    return priceHeader.filter((header) => {
      const fromDate = new Date(header.validFrom);
      const untilDate = new Date(header.validUntil);

      if (filter === "expired") {
        return untilDate < now;
      } else if (filter === "future") {
        return fromDate > now;
      } else {
        return true; // Show all
      }
    });
  };

  return (
    <div className={style} onClick={click}>
      <Autocomplete
        label={label}
        classNames={{
          base: "max-w-xs text-white !important",
          selectorButton: "text-white",
          clearButton: "text-white",
        }}
        isDisabled={isDisabled}
        placeholder={showPlaceholder ? placeholder : ""} // Show placeholder based on state
        variant="underlined"
        inputProps={{
          classNames: {
            input: "!text-white",
            label: "!text-white",
          },
        }}
        onSelectionChange={(value) => {
          console.log("Autocomplete onChange called:", value);
          setShowPlaceholder(false);
          onChange(value);
        }}
      >
        {getFilteredHeaders().map((header) => (
          <AutocompleteItem
            key={header.priceDescriptionHeaderID}
            value={header.descriptionName}
            onClick={() => onChange(header)}
          >
            {header.descriptionName}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete
        label="Filter Headers"
        classNames={{
          base: "max-w-xs !text-white",
          selectorButton: "text-white",
          clearButton: "text-white",
        }}
        isDisabled={isDisabled}
        inputProps={{
          classNames: {
            input: "!text-white",
            label: "!text-white",
          },
        }}
        variant="underlined"
        onSelectionChange={(value) => {
          console.log("Filter onChange called:", value);
          setFilter(value);
        }}
        defaultSelectedKey={"all"}
      >
        <AutocompleteItem
          value="all"
          onClick={() => setFilter("all")}
          key={"all"}
        >
          Show All
        </AutocompleteItem>
        <AutocompleteItem
          value="expired"
          onClick={() => setFilter("expired")}
          key={"expired"}
        >
          Expired
        </AutocompleteItem>
        <AutocompleteItem
          value="future"
          onClick={() => setFilter("future")}
          key={"future"}
        >
          Future
        </AutocompleteItem>
      </Autocomplete>
    </div>
  );
}
