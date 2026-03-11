"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PriceDescriptionInsert() {
  const [tipologyGroup, setTipologyGroup] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [priceDescription, setPriceDescription] = useState({
    Ref: "",
    Nome: "",
    RateCodeName: "",
    Valid: 0,
    Inicio: "",
    Fim: "",
    Property: "",
    BillText: "",
    RevenueAccount: "",
    PricesTypology: [],
    PricesRooms: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tipologyRes, roomsRes] = await Promise.all([
          axios.get("/api/v1/hotel/tipologys"),
          axios.get("/api/v1/hotel/rooms"),
        ]);

        const filteredTipology = tipologyRes.data.response.filter(
          (tipology) => tipology.label !== ""
        );
        const filteredRooms = roomsRes.data.response.filter(
          (room) => room.label !== ""
        );

        setTipologyGroup(filteredTipology);
        setRooms(filteredRooms);

        setPriceDescription((prev) => ({
          ...prev,
          PricesTypology: filteredTipology.map((tipology) => ({
            Typology: tipology.roomTypeID,
            Preco1: "",
            Preco2: "",
            Preco3: "",
            Preco4: "",
            Preco5: "",
            Preco6: "",
          })),
          PricesRooms: filteredRooms.map((room) => ({
            Room: "",
            PrecoQuarto1: "",
            PrecoQuarto2: "",
            PrecoQuarto3: "",
            PrecoQuarto4: "",
            PrecoQuarto5: "",
            PrecoQuarto6: "",
          })),
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRateNameSelect = (value) => {
    setPriceDescription((prev) => ({
      ...prev,
      RateCodeName: value,
    }));
  };

  console.log("CARALHO", priceDescription.RateCodeName);
  const handleInputPriceDescription = (event) => {
    const { name, value } = event.target;
    setPriceDescription((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputPriceDescriptionPrices = (index, event) => {
    const { name, value } = event.target;
    setPriceDescription((prev) => {
      const newPrices = [...prev.PricesTypology];
      newPrices[index] = {
        ...newPrices[index],
        [name]: value,
      };
      return {
        ...prev,
        PricesTypology: newPrices,
      };
    });
  };

  const handleInputPriceDescriptionRooms = (index, event) => {
    const { name, value } = event.target;
    setPriceDescription((prev) => {
      const newPricesRooms = [...prev.PricesRooms];
      newPricesRooms[index] = {
        ...newPricesRooms[index],
        [name]: value,
      };
      return {
        ...prev,
        PricesRooms: newPricesRooms,
      };
    });
  };

  const handleCheckboxChange = (event) => {
    setPriceDescription((prev) => ({
      ...prev,
      [event.target.name]: +event.target.checked,
    }));
  };

  const handleSubmitPriceDescription = async (event) => {
    event.preventDefault();
    console.log(priceDescription);

    if (
      !priceDescription.Ref ||
      !priceDescription.Nome ||
      !priceDescription.RateCodeName ||
      !priceDescription.Inicio ||
      !priceDescription.Fim ||
      !priceDescription.Property ||
      !priceDescription.BillText ||
      !priceDescription.RevenueAccount
    ) {
      alert("Preencha os campos corretamente");
      return;
    }
    

    try {
      const headerCreationInfo = await axios.put('/api/v1/prices/priceDescriptionHeader', {
        data: {
          ref: priceDescription.Ref,
          descriptionName: priceDescription.Nome,
          priceCode: priceDescription.RateCodeName,
          valid: priceDescription.Valid,
          validFrom: priceDescription.Inicio,
          validUntil: priceDescription.Fim,
          property: priceDescription.Property,
          billText: priceDescription.BillText,
          revenueAccount: priceDescription.RevenueAccount,
        },
      });
      const headerCreationID = headerCreationInfo.data.newRecord.priceDescriptionHeaderID;

      await axios.put('/api/v1/prices/priceDescriptionPrices', {
        data: priceDescription.PricesTypology.map(price => ({
          priceDescriptionID: headerCreationID,
          Typology: price.Typology,
          Preco1: price.Preco1,
          Preco2: price.Preco2,
          Preco3: price.Preco3,
          Preco4: price.Preco4,
          Preco5: price.Preco5,
          Preco6: price.Preco6,
        })),
      });

      await axios.put('/api/v1/prices/priceDescriptionRooms', {
        data: priceDescription.PricesRooms.map((price, index) => ({
          priceDescriptionID: headerCreationID,
          Room: index,
          PrecoQuarto1: price?.PrecoQuarto1 || '',
          PrecoQuarto2: price?.PrecoQuarto2 || '',
          PrecoQuarto3: price?.PrecoQuarto3 || '',
          PrecoQuarto4: price?.PrecoQuarto4 || '',
          PrecoQuarto5: price?.PrecoQuarto5 || '',
          PrecoQuarto6: price?.PrecoQuarto6 || '',
        })),
      });
      
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return {
    handleInputPriceDescription,
    handleInputPriceDescriptionPrices,
    handleInputPriceDescriptionRooms,
    handleSubmitPriceDescription,
    handleRateNameSelect,
    handleCheckboxChange,
    priceDescription,
    tipologyGroup,
    rooms,
  };
}
