"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import LoadingBackdrop from "@/components/Loader/page";

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

const validatePortugueseVAT = (vat) => /^PT\d{9}$/.test(vat);

const CompanyVATFormEdit = ({ onClose, profileID, propertyID, resNo, companyVATData }) => {
    const [formData, setFormData] = useState(() => ({
        companyName: companyVATData?.companyName || "",
        vatNo: companyVATData?.vatNo || "",
        emailAddress: companyVATData?.emailAddress || "",
        countryName: companyVATData?.countryName || "",
        streetAddress: companyVATData?.streetAddress || "",
        zipCode: companyVATData?.zipCode || "",
        city: companyVATData?.city || "",
        state: companyVATData?.state || "",
        companyID: companyVATData?.companyID || ""
    }));

    const [errorMessage, setErrorMessage] = useState("");
    const [vatError, setVatError] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
                const formattedOptions = response.data
                    .map((country) => ({
                        value: country.land,
                        label: country.land
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));

                setCountryOptions(formattedOptions);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar países:", error);
                setErrorMessage("Erro ao carregar os países.");
                setLoading(false);
            }
        };
        fetchCountries();
    }, [propertyID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "emailAddress") {
            setErrorMessage(emailRegex.test(value) ? "" : "E-mail inválido.");
        }
    };

    const handleBlur = () => {
        if (formData.countryName === "Portugal" && !validatePortugueseVAT(formData.vatNo)) {
            setVatError(/^\d{9}$/.test(formData.vatNo) ? "" : "O NIF português deve ter exatamente 9 dígitos.");
        } else {
            setVatError("");
        }
    };

    const handleCountryChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            countryName: selectedOption.label,
            vatNo: prev.countryName !== selectedOption.label ? "" : prev.vatNo
        }));
    };

    const handleSave = async () => {
        if (!formData.companyName) {
            setErrorMessage("O nome da empresa é obrigatório.");
            return;
        }

        if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
            setErrorMessage("Por favor, insira um e-mail válido.");
            return;
        }

        try {
            await axios.post("/api/reservations/checkins/registrationForm/updateCompanyVAT", {
                profileID,
                propertyID,
                resNo,
                countryName: formData.countryName,
                ...formData
            });

            onClose();
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            setErrorMessage("Erro ao salvar. Por favor, tente novamente.");
        }
    };

    if (loading) return <LoadingBackdrop open={true} />;

    return (
        <Modal isOpen={true} onOpenChange={onClose} className="z-50" size="lg" hideCloseButton={true}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            Atualizar Empresa
                            <Button color="transparent" variant="light" onClick={onCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium">Company Name:</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email Address:</label>
                                <input
                                    type="text"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Country:</label>
                                <Select
                                    options={countryOptions}
                                    value={countryOptions.find(option => option.label === formData.countryName)}
                                    onChange={handleCountryChange}
                                    isSearchable
                                    styles={customStyles}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">VAT No.:</label>
                                <input
                                    type="text"
                                    name="vatNo"
                                    value={formData.vatNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.countryName}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                />
                                {vatError && <p className="text-red-500 text-xs">{vatError}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Street Address:</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium">Zip Code:</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium">City:</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
                                />
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

export default CompanyVATFormEdit;