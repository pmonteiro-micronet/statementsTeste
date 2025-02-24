"use client";
import React, { useState, useEffect, useRef } from "react";
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

const CompanyVATFormEdit = ({ onClose, profileID, propertyID, resNo }) => {
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
    const [countryOptions, setCountryOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // 🔹 Buscar lista de países da API
    const fetchCountries = async () => {
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
            console.error("Erro ao buscar nacionalidades:", error);
            setErrorMessage("Erro ao carregar os países.");
        }
    };
    // 🔹 Buscar os dados da empresa caso existam
    const fetchCompanyData = async () => {
        try {
            const response = await axios.get(`/api/reservations/checkins/registrationForm/getCompanyVAT`, {
                params: { profileID, propertyID }
            });

            if (response.data) {
                setFormData({
                    companyName: response.data.companyName || "",
                    vatNo: response.data.vatNo || "",
                    emailAddress: response.data.emailAddress || "",
                    country: response.data.country || "",
                    streetAddress: response.data.streetAddress || "",
                    zipCode: response.data.zipCode || "",
                    city: response.data.city || "",
                    state: response.data.state || ""
                });
            }
        } catch (error) {
            console.error("Erro ao buscar dados da empresa:", error);
            setErrorMessage("Não foi possível carregar os dados da empresa.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Buscar os países e os dados da empresa ao carregar o componente
    useEffect(() => {
        fetchCountries();
        fetchCompanyData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "emailAddress") {
            if (!emailRegex.test(value)) {
                setErrorMessage("E-mail inválido.");
            } else {
                setErrorMessage("");
            }
        }
    };

    const handleBlur = () => {
        if (formData.country === "Portugal" && !validatePortugueseVAT(formData.vatNo)) {
            if (!/^\d{9}$/.test(formData.vatNo)) {
                setVatError("O NIF português deve ter exatamente 9 dígitos.");
            } else {
                setVatError("");
            }
        } else {
            setVatError("");
        }
    };

    const handleCountryChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            country: selectedOption.value,
            vatNo: prev.country !== selectedOption.value ? "" : prev.vatNo
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
            const response = await axios.post("/api/reservations/checkins/registrationForm/updateCompanyVAT", {
                profileID,
                propertyID,
                resNo,
                countryID: formData.country,
                countryName: formData.countryName,
                ...formData
            });

            console.log("Success:", response.data);
            setErrorMessage("");
            onClose();
        } catch (error) {
            console.error("Erro ao salvar empresa:", error);
            setErrorMessage("Erro ao salvar. Por favor, tente novamente.");
        }
    };

    if (loading) return  <LoadingBackdrop open={true} />;

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
                                    value={countryOptions.find(option => option.value === formData.country)}
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
                                    disabled={!formData.country} // Disable if no country selected
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
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">Zip Code:</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1"
                                    />
                                </div>
                                <div className="flex-1">
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
