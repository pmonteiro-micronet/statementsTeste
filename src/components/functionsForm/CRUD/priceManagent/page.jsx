"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function priceManagementInsert() {

    //inserção na tabela RateCodes
    const [priceManagement, setPriceManagement] = useState({
        RateGroup: '',
        RateCode: '',
        //SpecialRate: '',
        Hotels: ''
    })

    const handleInputPriceManagement = (event) => {
        setPriceManagement({ ...priceManagement, [event.target.name]: event.target.value })
    }
    function handleSubmitPriceManagement(event) {
        event.preventDefault()
        if (!priceManagement.RateGroup || !priceManagement.RateCode  || !priceManagement.Hotels ) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put(`/api/v1/prices/priceManagement`, {
            data: {
                rateGroup: priceManagement.RateGroup,
                rateCode: priceManagement.RateCode,
                //specialRate: priceManagement.SpecialRate,
                hotels: priceManagement.Hotels,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return {
        handleInputPriceManagement, handleSubmitPriceManagement
    };
}

  export function priceManagementEdit(idPriceManagement) {
      const [valuesPriceManagement, setValuesPriceManagement] = useState({
          id: idPriceManagement,
          RateGroup: '',
          RateCode: '',
          //SpecialRate: '',
          Hotels: ''
      })

      useEffect(() => {
          axios.get("/api/v1/prices/priceManagement/" + idPriceManagement)
              .then(res => {
                console.log("TESTE TESTE TESTE", res.data.response.raterName)
                setValuesPriceManagement({ ...valuesPriceManagement, RateGroup: res.data.response.raterName, RateCode: res.data.response.ratergrpExID, Hotels: res.data.response.gdsCode })
              })
              .catch(err => console.log(err))
      }, [])

      function handleUpdatePriceManagement(e) {
          e.preventDefault()
          axios.patch(`/api/v1/prices/priceManagement/` + idPriceManagement, {
              data: {
                raterName: valuesPriceManagement.RateGroup,
                ratergrpExID: valuesPriceManagement.RateCode,
                gdsCode: valuesPriceManagement.Hotels,
              }
          })
              .catch(err => console.log(err))
      }

      return {
        handleUpdatePriceManagement, setValuesPriceManagement, valuesPriceManagement
      };
  }