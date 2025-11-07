"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import LoadingBackdrop from "@/components/Loader/page";

import en from "../../../../../../../public/locales/english/common.json";
import pt from "../../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../../public/locales/espanol/common.json";

import CompanyVATFormInsert from "@/components/modals/arrivals/reservationForm/companyVAT/insert/page";
import BeforeCompanyVat from "@/components/modals/arrivals/reservationForm/companyVAT/beforeInfo/page";

const translations = { en, pt, es };

// const customStyles = {
//     control: (provided) => ({
//         ...provided,
//         border: "1px solid #D1D5DB",
//         borderRadius: "0.375rem",
//         padding: "1px 4px",
//         boxShadow: "none",
//         '&:hover': {
//             borderColor: "black"
//         },
//     })
// };

const validatePortugueseVAT = (vat) => /^\d{9}$/.test(vat);

const CompanyVATFormEdit = ({ onClose, profileID, propertyID, resNo, companyID, companyVATData, company, OldCompanyID }) => {
    console.log("company", company);
    console.log("companyVATData", companyVATData);
    const [formData, setFormData] = useState(() => {
        if (company) {
            return {
                companyName: company.name1 || "",
                vatNo: company.vatno || "",
                emailAddress: company.email || "",
                country: company.landkz || "",
                countryName: company.land || "",
                streetAddress: company.strasse || "",
                zipCode: company.plz || "",
                city: company.city || "",
                state: company.region || "",
            };
        } else if (companyVATData) {
            return {
                companyName: companyVATData.companyName || "",
                vatNo: companyVATData.vatNo || "",
                emailAddress: companyVATData.emailAddress || "",
                country: companyVATData.country || "",
                countryName: "",
                streetAddress: companyVATData.streetAddress || "",
                zipCode: companyVATData.zipCode || "",
                city: companyVATData.city || "",
                state: companyVATData.state || "",
            };
        } else {
            // Caso nenhum dos dois exista, inicializa vazio
            return {
                companyName: "",
                vatNo: "",
                emailAddress: "",
                country: "",
                countryName: "",
                streetAddress: "",
                zipCode: "",
                city: "",
                state: "",
            };
        }
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [vatError, setVatError] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [isDataModified, setIsDataModified] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

    // track whether a save request is in progress to prevent double submissions
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showConfirmNewCompanyModal, setShowConfirmNewCompanyModal] = useState(false);
    const [showSearchCompanyModal, setShowSearchCompanyModal] = useState(false);

    const extractedCompanyID = company?.CompanyID;
    console.log("extractedCompanyID", extractedCompanyID);

    const handleCloseModal = () => {
        if (isDataModified) {
            // Pergunta ao usuário se ele deseja perder os dados
            const confirmLeave = window.confirm("Você vai perder os dados, continuar?");
            if (confirmLeave) {
                onClose();
            }
        } else {
            onClose();  // Fecha o modal normalmente se não houver dados modificados
        }
    };

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
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

    // 🔹 Buscar lista de países da API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
                const formattedOptions = response.data
                    .map((country) => ({
                        value: country.codenr,
                        label: country.land
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));

                setCountryOptions(formattedOptions);
                setLoading(false);
            } catch (error) {
                console.log("Erro ao buscar países:", error);
                setErrorMessage(t.modals.errors.errorCountries);
                setLoading(false);
            }
        };
        fetchCountries();
    }, [propertyID]);

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


 const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({
        ...prev,
        country: selectedOption.value,
        countryName: selectedOption.label, // Nome do país (land)
        vatNo: prev.vatNo // mantém o VAT sempre
    }));
};


    const handleSave = async () => {
    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);
    if (!formData.companyName) {
        setErrorMessage(t.modals.errors.companyNameRequired);
            setIsSubmitting(false);
        return;
    }

    if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
        setErrorMessage(t.modals.errors.invalidEmail);
        return;
    }

    const payload = Object.fromEntries(
        Object.entries({
            profileID,
            propertyID,
            resNo,
            companyID: companyID || extractedCompanyID,
            countryID: formData.country,
            countryName: formData.countryName,
            companyName: formData.companyName,
            vatNo: formData.vatNo,
            emailAddress: formData.emailAddress,
            streetAddress: formData.streetAddress,
            zipCode: formData.zipCode,
            city: formData.city,
            state: formData.state,
            oldCompany: OldCompanyID,
        }).map(([key, value]) => [key, String(value || "").trim() === "" ? "" : String(value || "").trim()])
    );

    try {
        // // 🔍 Verificar VAT se preenchido
        // if (formData.vatNo) {
        //     const vatResponse = await axios.post("/api/reservations/checkins/registrationForm/checkVatNo", {
        //         vatNo: formData.vatNo,
        //         propertyID: propertyID,
        //     });

        //     const vatData = vatResponse.data;
        //     // Espera-se um array como [{ result: true }]
        //     const vatExists = Array.isArray(vatData) && vatData[0]?.result === true;

        //     if (vatExists) {
        //         setErrorMessage(
        //             t.modals.errors.existingVat
        //         );
        //         return;
        //     }
        // }

        // ✅ Prosseguir se VAT for falso ou não existir
    await axios.post("/api/reservations/checkins/registrationForm/updateCompanyVAT", payload);

        const existingCompanies = JSON.parse(localStorage.getItem("company") || "{}");

        const localStorageData = {
            ...payload,
            hasCompanyVAT: 1,
            BlockedCVatNO: 0,
        };

        existingCompanies[profileID] = localStorageData;

        localStorage.setItem("company", JSON.stringify(existingCompanies));

    onClose();
    window.location.reload();

    // note: leaving isSubmitting true briefly is ok since we're reloading, but reset anyway
    setIsSubmitting(false);

    } catch (error) {
        console.log("Erro ao salvar empresa:", error);
        setErrorMessage(t.modals.errors.errorSaving);
        setIsSubmitting(false);
    }
};



    if (loading) return <LoadingBackdrop open={true} />;

    const handleEdit = () => {
        setIsEditing(true);
    };

    console.log("formData", formData);

    return (
        <>
            {isInsertModalOpen && (
                <CompanyVATFormInsert
                    onClose={() => setIsInsertModalOpen(false)}
                    profileID={profileID}
                    propertyID={propertyID}
                    resNo={resNo}
                    OldCompanyID={OldCompanyID}
                />
            )}

            {showSearchCompanyModal && (
                <BeforeCompanyVat
                    onClose={() => setShowSearchCompanyModal(false)}
                    profileID={profileID}
                    propertyID={propertyID}
                    resNo={resNo}
                    OldCompanyID={OldCompanyID}
                />
            )}

            <Modal isOpen={showConfirmNewCompanyModal} onOpenChange={setShowConfirmNewCompanyModal}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="text-lg font-medium">
                                {t.modals.companyInfo.attention}
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-gray-700">
                                    {t.modals.companyInfo.switchCompany}
                                </p>
                            </ModalBody>
                            <div className="flex justify-end gap-2 px-6 pb-4">
                                <Button
                                    color="error"
                                    onClick={() => setShowConfirmNewCompanyModal(false)}
                                >
                                    {t.modals.companyInfo.cancel}
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        setShowConfirmNewCompanyModal(false);
                                        setIsInsertModalOpen(true);
                                    }}
                                >
                                    {t.modals.companyInfo.continue}
                                </Button>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                                {t.modals.companyInfo.update}
                                <Button color="transparent" variant="light" onClick={handleCloseModal} className="w-auto min-w-0 p-0 m-0">
                                    <MdClose size={30} />
                                </Button>
                            </ModalHeader>
                            <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2 mb-0.5 items-center">
                                        <div className="w-2/3">
                                            <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.companyName}</label>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.companyInfo.vatNO}</label>
                                            <input
                                                type="text"
                                                name="vatNo"
                                                value={formData.vatNo}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-sm font-medium">{t.modals.companyInfo.country}</label>
                                            <Select
                                                options={countryOptions}
                                                value={countryOptions.find(option => option.value === formData.country)}
                                                onChange={handleCountryChange}
                                                isSearchable
                                                // styles={customStyles}
                                                classNames={{
                                                control: (state) =>
                                                    `!bg-background !text-textPrimaryColor !border !border-gray-300 !rounded-md ${state.isFocused ? '!border-blue-500' : ''
                                                    }`,
                                                menu: () => '!bg-background !text-textPrimaryColor',
                                                option: (state) =>
                                                    `!cursor-pointer ${state.isSelected
                                                        ? '!bg-primary !text-white'
                                                        : state.isFocused
                                                            ? '!bg-primary-100 !text-black'
                                                            : '!bg-background !text-textPrimaryColor'
                                                    }`,
                                                singleValue: () => '!text-textPrimaryColor',
                                                placeholder: () => '!text-gray-400',
                                            }}
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {errorMessage && <p className="text-red-500 text-xs -mt-4">{errorMessage}</p>}
                                <div className="flex justify-end space-x-2 -mt-4">
                                    <Button color="error" onClick={handleCloseModal} disabled={isSubmitting}>{t.modals.companyInfo.cancel}</Button>
                                    <Button color="primary" onClick={handleSave} disabled={isSubmitting}>
                                        {isSubmitting ? t.modals.companyInfo.saving || 'Saving...' : t.modals.companyInfo.selectCompany}
                                    </Button>
                                    <Button color="primary" onClick={() => setShowConfirmNewCompanyModal(true)} disabled={isSubmitting}>
                                        {t.modals.companyInfo.newCompany}
                                    </Button>
                                    <Button color="primary" onClick={() => setShowSearchCompanyModal(true)} disabled={isSubmitting}>
                                        {t.modals.companyInfo.searchCompany}
                                    </Button>
                                    {isEditing ? (
                                        <Button color="primary" onClick={handleSave} disabled={isSubmitting}>
                                            {isSubmitting ? t.modals.companyInfo.saving || 'Saving...' : t.modals.companyInfo.save}
                                        </Button>
                                    ) : (
                                        <Button color="primary" onClick={handleEdit} disabled={isSubmitting}>
                                            {t.modals.companyInfo.edit}
                                        </Button>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default CompanyVATFormEdit;
