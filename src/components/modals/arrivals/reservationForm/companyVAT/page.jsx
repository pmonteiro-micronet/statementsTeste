"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Select from "react-select";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const countryOptions = [
    { value: "PT", label: "Portugal" },
    { value: "US", label: "Estados Unidos" },
    { value: "GB", label: "Reino Unido" },
    { value: "DE", label: "Alemanha" },
    { value: "FR", label: "França" },
    { value: "IT", label: "Itália" },
    { value: "ES", label: "Espanha" },
    { value: "BR", label: "Brasil" },
    { value: "CA", label: "Canadá" },
    { value: "AU", label: "Austrália" },
    { value: "JP", label: "Japão" },
];

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

const validatePortugueseVAT = (vat) => {
    return /^PT\d{9}$/.test(vat);
};

const CompanyVATForm = ({ onClose, profileID, propertyID }) => {
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

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleBlur = () => {
        if (formData.country === "PT" && !validatePortugueseVAT(formData.vatNo)) {
            setVatError("O NIF português deve começar com 'PT' seguido de 9 dígitos.");
        } else {
            setVatError("");
        }
    };

    const handleCountryChange = (selectedOption) => {
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                country: selectedOption.value,
            };

            // Limpar o campo VAT No. se o país for alterado
            if (updatedData.country !== prevData.country) {
                updatedData.vatNo = "";
            }

            return updatedData;
        });
    };

    const handleSave = async () => {
        for (const key in formData) {
            if (!formData[key].trim()) {
                setErrorMessage(`Todos os campos devem ser preenchidos.`);
                return;
            }
        }

        if (formData.country === "PT" && !validatePortugueseVAT(formData.vatNo)) {
            setErrorMessage("O NIF português está incorreto.");
            return;
        }

        try {
            const response = await axios.post("/api/reservations/checkins/registrationForm/createCompanyVAT", {
                profileID,
                propertyID,
                ...formData
            });
            console.log("Success:", response.data);
            setErrorMessage("");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar informações de VAT:", error);
            setErrorMessage("Falha ao salvar. Por favor, tente novamente.");
        }
    };

    return (
        <Modal isOpen={true} onOpenChange={onClose} className="z-50" size="lg" hideCloseButton={true}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            Criar Novo Número de VAT da Empresa
                            <Button color="transparent" variant="light" onClick={onCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">Company Name:</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">Email Address:</label>
                                <input
                                    type="text"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">País:</label>
                                <Select
                                    options={countryOptions}
                                    value={countryOptions.find(option => option.value === formData.country)}
                                    onChange={handleCountryChange}
                                    isSearchable
                                    styles={customStyles}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">Street Address:</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">Zip Code:</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">VAT No.:</label>
                                <input
                                    type="text"
                                    name="vatNo"
                                    value={formData.vatNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.country} // Desabilita o campo se o país não for selecionado
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                                {vatError && <p className="text-red-500 text-xs">{vatError}</p>}
                            </div>
                            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                            <div className="flex justify-end space-x-2">
                                <Button color="error" onClick={onCloseModal}>Cancelar</Button>
                                <Button color="primary" onClick={handleSave}>Salvar</Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CompanyVATForm;
