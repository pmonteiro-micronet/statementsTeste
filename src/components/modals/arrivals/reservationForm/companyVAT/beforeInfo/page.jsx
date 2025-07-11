"use client";
import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Select from "react-select";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

import en from "../../../../../../../public/locales/english/common.json";
import pt from "../../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const BeforeCompanyVat = ({ onClose, propertyID}) => {
    const [locale, setLocale] = useState("pt");
    const [formData, setFormData] = useState({
        companyName: "",
        vatNo: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    console.log(errorMessage);
    const [vatError, setVatError] = useState("");
    const inputRef = useRef(null);
    // const [countryOptions, setCountryOptions] = useState([]);
    const [isDataModified, setIsDataModified] = useState(false);  // Estado para monitorar mudanças nos dados
    console.log(isDataModified);

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
                setErrorMessage("E-mail inválido.");
            } else {
                setErrorMessage("");
            }
        }
    };

    const handleBlur = () => {
        if (formData.country === "Portugal" && formData.vatNo) {
            if (!/^\d{9}$/.test(formData.vatNo)) {
                setVatError("O NIF português deve ter exatamente 9 dígitos.");
            } else {
                setVatError("");
            }
        } else {
            setVatError("");
        }
    };
    const handleCloseModal = () => {
        if (onClose) onClose();
    };

    const handleSearchClick = async () => {
        try {
            const response = await fetch("/api/reservations/checkins/registrationForm/searchcompany", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    propertyID: propertyID,
                    companyName: formData.companyName,
                    vatNo: formData.vatNo,
                    pageNumber: 1
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar empresa");
            }

            const data = await response.json();
            console.log("Resultado da empresa:", data);

            // aqui você pode lidar com os dados recebidos
        } catch (error) {
            console.error("Erro ao buscar empresa:", error);
            // Exibir feedback ao usuário se quiser
        }
    };

    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-12">
                            {t.modals?.companyInfo?.insert || "Insert Company Info"}
                            <Button color="transparent" variant="light" onClick={handleCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-2 mb-0.5 items-end"> {/* Alinha todos os itens pelo fundo */}
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">
                                            {t.modals.companyInfo.vatNO}
                                        </label>
                                        <input
                                            type="text"
                                            name="vatNo"
                                            value={formData.vatNo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                        {vatError && <p className="text-red-500 text-xs mt-1">{vatError}</p>}
                                    </div>

                                    <div className="w-2/3">
                                        <label className="block text-sm font-medium text-textPrimaryColor">
                                            {t.modals.companyInfo.companyName}
                                        </label>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    {/* Botão Search alinhado com os inputs */}
                                    <div className="self-end"> {/* Alinha o botão com a base dos inputs */}
                                        <button
                                            onClick={handleSearchClick}
                                            className="px-3 py-2 bg-primary text-white rounded-md flex items-center justify-center"
                                        >
                                            <CiSearch color="white" size={20} />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default BeforeCompanyVat;
