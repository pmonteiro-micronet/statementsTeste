"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function seasonsInsert() {

    //inserção na tabela RateCodes
    const [seasons, setSeasons] = useState({
        SortNo: '',
        Desc: '',
        StartDate: '',
        EndDate: ''
    })

    const handleInputSeasons = (event) => {
        setSeasons({ ...seasons, [event.target.name]: event.target.value })
    }
    function handleSubmitSeasons(event) {
        event.preventDefault()
        if (!seasons.SortNo || !seasons.Desc  || !seasons.StartDate || !seasons.EndDate ) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put(`/api/v1/prices/seasons`, {
            data: {
                sortNo: seasons.SortNo,
                desc: seasons.Desc,
                startDate: seasons.StartDate,
                endDate: seasons.EndDate,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return {
        handleInputSeasons, handleSubmitSeasons
    };
}

  export function seasonsEdit(idSeasons) {
      const [valuesSeasons, setValuesSeasons] = useState({
          id: idSeasons,
          SortNo: '',
          Desc: '',
          StartDate: '',
          EndDate: ''
      })

      useEffect(() => {
          axios.get("/api/v1/prices/seasons/" + idSeasons)
              .then(res => {
                //console.log("TESTE TESTE TESTE", res.data.response.raterName)
                setValuesSeasons({ ...valuesSeasons, SortNo: res.data.response.sortNo, Desc: res.data.response.desc, StartDate: res.data.response.startDate, EndDate: res.data.response.endDate })
              })
              .catch(err => console.log(err))
      }, [])

      function handleUpdateSeasons(e) {
          e.preventDefault()
          axios.patch(`/api/v1/prices/seasons/` + idSeasons, {
              data: {
                sortNo: valuesSeasons.SortNo,
                desc: valuesSeasons.Desc,
                startDate: valuesSeasons.StartDate,
                endDate: valuesSeasons.EndDate
              }
          })
              .catch(err => console.log(err))
      }

      return {
        handleUpdateSeasons, setValuesSeasons, valuesSeasons
      };
  }
