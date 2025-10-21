"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

import en from "../../../../../../../public/locales/english/common.json";
import pt from "../../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const customStyles = {
    control: (provided) => ({
        ...provided,
        border: "1px solid #D1D5DB",
        borderRadius: "0.375rem",
        padding: "1px 4px",
        boxShadow: "none",
        '&:hover': {
            borderColor: "black"
        },
    })
};

const CompanyVATFormInsert = ({ onClose, profileID, propertyID, resNo, defaultData, OldCompanyID }) => {
    console.log("ResNo", resNo, "ProfileID", profileID, "PropertyID", propertyID);
    const [formData, setFormData] = useState({
        companyName: "",
        vatNo: "",
        emailAddress: "",
        country: "",
        streetAddress: "",
        zipCode: "",
        city: "",
        state: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [vatError, setVatError] = useState("");
    const inputRef = useRef(null);
    const [countryOptions, setCountryOptions] = useState([]);
    const [isDataModified, setIsDataModified] = useState(false);  // Estado para monitorar mudanças nos dados

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (defaultData) {
            setFormData((prev) => ({
                ...prev,
                companyName: defaultData.companyName || "",
                vatNo: defaultData.vatNo || "",
            }));
        }
    }, [defaultData]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [locale, setLocale] = useState("pt");

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            setIsDataModified(true);  // Marca os dados como modificados
            return updatedData;
        });

        if (name === "emailAddress") {
            if (!emailRegex.test(value)) {
                setErrorMessage(t.modals.errors.invalidEmail);
            } else {
                setErrorMessage("");
            }
        }
    };

    const validatePortugueseVAT = (vat) => /^\d{9}$/.test(vat);
    const handleBlur = () => {
        const vat = formData.vatNo?.trim();
        if (formData.country === 27 && vat) {
            if (!validatePortugueseVAT(vat)) {
                setVatError(t.modals.errors.invalidVAT);
            } else {
                setVatError("");
            }
        } else {
            setVatError("");
        }
    };

    // Chamada no useEffect para validação automática
    useEffect(() => {
        handleBlur();
    }, [formData.vatNo, formData.country]);


    // const handleCountryChange = (selectedOption) => {
    //     setFormData((prevData) => {
    //         const updatedData = {
    //             ...prevData,
    //             country: selectedOption.value, // ID do país (codenr)
    //             countryName: selectedOption.label, // Nome do país (land)
    //         };

    //         // Limpar o campo VAT No. se o país for alterado
    //         if (updatedData.country !== prevData.country) {
    //             updatedData.vatNo = "";
    //         }

    //         setIsDataModified(true);  // Marca os dados como modificados
    //         return updatedData;
    //     });
    // };

    const handleCountryChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            country: selectedOption.value,    // ID do país (codenr)
            countryName: selectedOption.label // Nome do país (land)
        }));

        setIsDataModified(true); // Marca os dados como modificados
    };

    const fetchNationalities = async () => {
        try {
            const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
            const nationalities = response.data;

            const formattedOptions = nationalities
                .map((country) => ({
                    value: country.codenr, // ID do país
                    label: country.land    // Nome do país
                }))
                .sort((a, b) => a.label.localeCompare(b.label)); // Ordena alfabeticamente

            setCountryOptions(formattedOptions);
        } catch (error) {
            console.log("Erro ao buscar nacionalidades:", error);
            setErrorMessage(t.modals.companyInfo.errorCountries);
        }
    };

    const handleSave = async () => {
  if (vatError) {
    setErrorMessage(t.modals.errors.invalidVAT);
    return;
  }

  if (!formData.companyName.trim()) {
    setErrorMessage(t.modals.errors.companyNameRequired);
    return;
  }

  if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
    setErrorMessage(t.modals.errors.invalidEmail);
    return;
  }

  // Substituir valores vazios por um espaço em branco
  const formattedData = Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [
      key,
      String(value).trim() === "" ? " " : String(value).trim(),
    ])
  );

  try {
    // 🔍 Verificar se já existe VAT antes de criar
    if (formData.vatNo) {
      const vatResponse = await axios.post(
        "/api/reservations/checkins/registrationForm/checkVatNo",
        {
          vatNo: formData.vatNo,
          propertyID: propertyID,
        }
      );

      const vatData = vatResponse.data;
      console.log("Verificação VAT:", vatData);

      const vatExists = Array.isArray(vatData) && vatData[0]?.result === true;
      if (vatExists) {
        setErrorMessage(t.modals.errors.existingVat);
        return;
      }
    }

    const response = await axios.post(
      "/api/reservations/checkins/registrationForm/createCompanyVATJson",
      {
        profileID,
        propertyID,
        resNo,
        countryID: formData.country,
        countryName: formData.countryName,
        oldCompany: OldCompanyID,
        ...formattedData,
      }
    );

    console.log("✅ Empresa criada com sucesso:", response.data);

    // Atualizar localStorage
    const existingCompanies = JSON.parse(localStorage.getItem("JSONcompany") || "{}");

    const localStorageData = {
      profileID,
      propertyID,
      resNo,
      countryID: formData.country,
      countryName: formData.countryName,
      ...formattedData,
      hasCompanyVAT: 1,
      BlockedCVatNO: 0,
    };

    existingCompanies[profileID] = localStorageData;
    localStorage.setItem("JSONcompany", JSON.stringify(existingCompanies));

    setErrorMessage("");
    setIsDataModified(false);
    onClose();

    // 🔄 Atualiza a página após salvar com sucesso (reload suave)
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error) {
    console.error("❌ Erro ao salvar informações de VAT:", error);
    setErrorMessage(t.modals.errors.errorSaving);
  }
};


    const handleCloseModal = () => {
        if (isDataModified) {
            // Pergunta ao usuário se ele deseja perder os dados
            const confirmLeave = window.confirm(t.modals.errors.loseData);
            if (confirmLeave) {
                onClose();
            }
        } else {
            onClose();  // Fecha o modal normalmente se não houver dados modificados
        }
    };

    useEffect(() => {
        fetchNationalities();
    }, []); // Chamar apenas uma vez ao montar o componente

    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            {t.modals.companyInfo.insert}
                            <Button color="transparent" variant="light" onClick={handleCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-2 mb-0.5 items-center">
                                    <div className="w-2/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.companyName} *</label>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.vatNO} *</label>
                                        <input
                                            type="text"
                                            name="vatNo"
                                            value={formData.vatNo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                        {vatError && <p className="text-red-500 text-xs">{vatError}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2 mb-0.5 items-center">
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.streetAddress}</label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.zipCode}</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.city}</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2 mb-0.5 items-center">

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.state}</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">{t.modals.companyInfo.country} *</label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(option => option.label === formData.country)}
                                            onChange={handleCountryChange}
                                            isSearchable
                                            styles={customStyles}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.email}</label>
                                        <input
                                            type="text"
                                            name="emailAddress"
                                            value={formData.emailAddress}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                            <div className="flex justify-end space-x-2">
                                <Button color="error" onClick={handleCloseModal}>{t.modals.companyInfo.cancel}</Button>
                                <Button color="primary" onClick={handleSave}>{t.modals.companyInfo.save}</Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CompanyVATFormInsert;