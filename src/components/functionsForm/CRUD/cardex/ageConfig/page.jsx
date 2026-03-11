"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export function ageConfigEdit(idAgeConfig) {
  //edição na tabela ageConfig
  const [valuesAgeConfig, setValuesAgeConfig] = useState({
    id: idAgeConfig,
    Description: "",
  });

  useEffect(() => {
    axios
      .get("/api/v1/cardex/ageConfig/" + idAgeConfig)
      .then((res) => {
        setValuesAgeConfig({
          ...valuesAgeConfig,
          Description: res.data.response.ageConfigFieldDescription,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  function handleUpdateAgeConfig(e) {
    e.preventDefault();
    axios
      .patch(`/api/v1/cardex/ageConfig/` + idAgeConfig, {
        data: {
          ageConfigFieldDescription: valuesAgeConfig.Description,
        },
      })
      .catch((err) => console.log(err));
  }
  return {
    handleUpdateAgeConfig,
    setValuesAgeConfig,
    valuesAgeConfig,
  };
}
