import { useState } from "react";
import axios from "axios";

export default function ratesPlannerInsert(
  startDate,
  endDate,
  room,
  tipology,
  header
) {
  // inserção na tabela RateCodes
  console.log(header);
  const [ratesPlanner, setRatesPlanner] = useState({
    validFrom: startDate || "",
    validUntil: endDate || "",
    roomID: room || "",
    tipology: tipology,
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    p5: "",
    p6: "",
    child1: "",
    child2: "",
    child3: "",
    child4: "",
    extraBed: "",
    selectedHeaderID: header,
  });

  const [selectedHeaderIDNoFilter, setSelectedHeaderIDNoFilter] = useState({
    ID: "",
  });

  const handleHeaderChangeNoFilter = (header) => {
    setSelectedHeaderIDNoFilter({
      ID: header,
    });
  };

  const handleInputRatesPlanner = (event) => {
    setRatesPlanner({
      ...ratesPlanner,
      [event.target.name]: event.target.value,
    });
  };

  const [forcedUpdate, setForcedUpdate] = useState(0);

  const handleConfirm = () => {
    setForcedUpdate(1);
  };

  const handleCancel = () => {
    setForcedUpdate(0);
  };

  async function handleSubmitRatesPlanner(event) {
    event.preventDefault();

    // Verifica se o campo roomID está preenchido
    const adjustedRatesPlanner = { ...ratesPlanner };
    if (adjustedRatesPlanner.roomID) {
      // Se roomID estiver preenchido, tipologyID deve ficar em branco
      adjustedRatesPlanner.tipologyID = "";
    }

    // Validação dos campos p1 a p6
    if (
      !adjustedRatesPlanner.p1 ||
      !adjustedRatesPlanner.p2 ||
      !adjustedRatesPlanner.p3 ||
      !adjustedRatesPlanner.p4 ||
      !adjustedRatesPlanner.p5 ||
      !adjustedRatesPlanner.p6 ||
      !adjustedRatesPlanner.child1 ||
      !adjustedRatesPlanner.child2 ||
      !adjustedRatesPlanner.child3 ||
      !adjustedRatesPlanner.child4 ||
      !adjustedRatesPlanner.extraBed
    ) {
      alert("Preencha os campos corretamente");
      return;
    }

    // Verifica se selectedHeaderIDNoFilter.ID é válido e diferente do selectedHeaderID
    const headerIDToUse =
      selectedHeaderIDNoFilter.ID &&
      selectedHeaderIDNoFilter.ID !== adjustedRatesPlanner.selectedHeaderID
        ? parseInt(selectedHeaderIDNoFilter.ID)
        : parseInt(adjustedRatesPlanner.selectedHeaderID);

    // Envia os dados para a API com o estado ajustado
    const response = await axios
      .put(`/api/v1/prices/priceDescriptionSpecialPrices`, {
        validFrom: new Date(adjustedRatesPlanner.validFrom),
        validUntil: new Date(adjustedRatesPlanner.validUntil),
        roomID: parseInt(adjustedRatesPlanner.roomID),
        tipologyID: parseInt(adjustedRatesPlanner.tipology),
        p1: parseInt(adjustedRatesPlanner.p1),
        p2: parseInt(adjustedRatesPlanner.p2),
        p3: parseInt(adjustedRatesPlanner.p3),
        p4: parseInt(adjustedRatesPlanner.p4),
        p5: parseInt(adjustedRatesPlanner.p5),
        p6: parseInt(adjustedRatesPlanner.p6),
        childPrice1: parseInt(adjustedRatesPlanner.child1),
        childPrice2: parseInt(adjustedRatesPlanner.child2),
        childPrice3: parseInt(adjustedRatesPlanner.child3),
        childPrice4: parseInt(adjustedRatesPlanner.child4),
        extraBedPrice: parseInt(adjustedRatesPlanner.extraBed),
        forcedUpdate: parseInt(forcedUpdate),
        selectedHeaderIDNoFilter: headerIDToUse,
      })
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }

  return {
    handleSubmitRatesPlanner,
    handleInputRatesPlanner,
    ratesPlanner,
    setRatesPlanner,
    handleConfirm,
    handleCancel,
    handleHeaderChangeNoFilter,
  };
}
