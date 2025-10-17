"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

import en from "../../../../../../../public/locales/english/common.json";
import pt from "../../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../../public/locales/espanol/common.json";

import CompanyVATFormEdit from "@/components/modals/arrivals/reservationForm/companyVAT/edit/page";
import CompanyVATFormInsert from "@/components/modals/arrivals/reservationForm/companyVAT/insert/page";

const translations = { en, pt, es };

const BeforeCompanyVat = ({ onClose, propertyID, profileID, resNo, OldCompanyID }) => {
    const [locale, setLocale] = useState("pt");
    const [formData, setFormData] = useState({ companyName: "", vatNo: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [vatError, setVatError] = useState("");
    const [isDataModified, setIsDataModified] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const inputRef = useRef(null);
    const [selectedCompany, setSelectedCompany] = useState(false);

    const vatRef = useRef(null);
    const [insertFormData, setInsertFormData] = useState(null);

    console.log(errorMessage, isDataModified);
    // Estado para controlar o modal principal
    const [isMainModalOpen, setIsMainModalOpen] = useState(true);

    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) setLocale(storedLanguage);

        // Dar foco ao campo vatNo ao abrir o modal
        if (isMainModalOpen && vatRef.current) {
            vatRef.current.focus();
        }
    }, [isMainModalOpen]);


    const t = translations[locale] || translations["pt"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setIsDataModified(true);

        if (name === "emailAddress") {
            const emailRegex = /\S+@\S+\.\S+/;
            setErrorMessage(emailRegex.test(value) ? "" : t.modals.errors.invalidEmail);
        }
    };

    const handleBlur = () => {
        if (formData.country === "Portugal" && formData.vatNo && !/^\d{9}$/.test(formData.vatNo)) {
            setVatError(t.modals.errors.invalidVAT);
        } else {
            setVatError("");
        }
    };

    const handleCloseModal = () => {
        if (onClose) onClose();
        setIsMainModalOpen(false);
    };

    const handleSearchClick = async (resetPage = true) => {
        try {
            const nextPage = resetPage ? 1 : pageNumber + 1;

            const response = await fetch("/api/reservations/checkins/registrationForm/searchcompany", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyID,
                    companyName: formData.companyName,
                    vatNo: formData.vatNo,
                    pageNumber: nextPage
                })
            });

            if (!response.ok) throw new Error("Erro ao buscar empresa");

            const data = await response.json();
            console.log("Resultado da empresa:", data);

            setSearchResults(data);
            setPageNumber(nextPage);
            setIsResultsModalOpen(true);
        } catch (error) {
            console.error("Erro ao buscar empresa:", error);
        }
    };

    // Quando o usuário seleciona uma empresa na lista, abrir o modal de edição e fechar o principal
    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
        setIsMainModalOpen(false);
        setIsResultsModalOpen(false);
    };

    // Fechar o modal de edição da empresa e manter o modal principal fechado
    const handleCloseCompanyEdit = () => {
        setSelectedCompany(false);
        setIsMainModalOpen(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setPageNumber(1);
            handleSearchClick(true);
        }
    };
// teste
    return (
        <>
            {/* Modal de resultados */}
            {isResultsModalOpen && (
                <Modal
                    isOpen={isResultsModalOpen}
                    onOpenChange={() => setIsResultsModalOpen(false)}
                    className="z-60"
                    size="3xl"
                    hideCloseButton={true}
                >
                    <ModalContent>
                        {() => (
                            <>
                                <ModalBody className="p-0 flex flex-col max-h-[70vh]">
                                    {searchResults.length === 0 ? (
                                        <div className="p-4 flex-grow overflow-auto">
                                            <div className="flex flex-col gap-4">
                                                <p>{t.modals.companyInfo.noResults}</p>
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <Button
                                                        onClick={() => {
                                                            setInsertFormData(formData);
                                                            setIsInsertModalOpen(true);
                                                        }}
                                                        className="bg-primary text-white"
                                                    >
                                                        {t.modals.companyInfo.newCompany}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Tabela com cabeçalho fixo e corpo rolável */}
                                            <div className="flex-grow overflow-y-auto px-4">
                                                <table className="w-full text-left min-w-max border-collapse mt-2">
                                                    <thead className="sticky top-0 z-50 bg-primary text-white shadow-md">
                                                        <tr className="h-12">
                                                            <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                                <div className="flex items-center gap-2">{t.modals.companyInfo.showCompany.companyName}</div>
                                                            </th>
                                                            <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                                <div className="flex items-center gap-2">{t.modals.companyInfo.showCompany.vatNo}</div>
                                                            </th>
                                                            <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                                <div className="flex items-center gap-2">{t.modals.companyInfo.showCompany.country}</div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {searchResults.map((company, index) => (
                                                            <tr
                                                                key={company.kdnr || index}
                                                                className="hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => handleSelectCompany(company)}
                                                            >
                                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">
                                                                    {company.name1 || "—"}
                                                                </td>
                                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">
                                                                    {company.vatno || "—"}
                                                                </td>
                                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">
                                                                    {company.land || "—"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Botões fixos no fundo */}
                                            <div className="sticky bottom-0 bg-gray-100 px-4 py-2 flex justify-end gap-4 z-40 border-t border-gray-200">
                                                <Button
                                                    onClick={() => setIsResultsModalOpen(false)}
                                                    className="bg-gray-200 text-black"
                                                >
                                                    {t.modals.companyInfo.showCompany.cancel}
                                                </Button>
                                                <Button
                                                    onClick={() => handleSearchClick(false)}
                                                    className="bg-primary text-white"
                                                >
                                                    {t.modals.companyInfo.showCompany.searchMore}
                                                </Button>
                                                <Button
                                                    onClick={() => setIsInsertModalOpen(true)}
                                                    className="bg-primary text-white"
                                                >
                                                    {t.modals.companyInfo.newCompany}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            )}

            {isInsertModalOpen && (
                <CompanyVATFormInsert
                    onClose={() => setIsInsertModalOpen(false)}
                    profileID={profileID}
                    propertyID={propertyID}
                    resNo={resNo}
                    defaultData={insertFormData}
                    OldCompanyID={OldCompanyID}
                />
            )}

            {/* Modal principal ou modal de edição */}
            {selectedCompany ? (
                <CompanyVATFormEdit
                    onClose={handleCloseCompanyEdit}
                    profileID={profileID}
                    propertyID={propertyID}
                    resNo={resNo}
                    company={selectedCompany}
                    OldCompanyID={OldCompanyID}
                />
            ) : (
                <Modal
                    isOpen={isMainModalOpen}
                    onOpenChange={handleCloseModal}
                    className="z-50"
                    size="5xl"
                    hideCloseButton={true}
                >
                    <ModalContent>
                        {() => (
                            <>
                                <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-12">
                                    {t.modals?.companyInfo?.insert || "Insert Company Info"}
                                    <Button
                                        color="transparent"
                                        variant="light"
                                        onClick={handleCloseModal}
                                        className="w-auto min-w-0 p-0 m-0"
                                    >
                                        <MdClose size={30} />
                                    </Button>
                                </ModalHeader>
                                <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-2 mb-0.5 items-end">
                                            <div className="w-1/3">
                                                <label className="block text-sm font-medium text-textPrimaryColor">
                                                    {t.modals.companyInfo.vatNO}
                                                </label>
                                                <input
                                                    ref={vatRef}
                                                    type="text"
                                                    name="vatNo"
                                                    value={formData.vatNo}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    onKeyDown={handleKeyDown}
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
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div className="self-end">
                                                <button
                                                    onClick={() => {
                                                        setPageNumber(1);
                                                        handleSearchClick(true);
                                                    }}
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
            )}
        </>
    );
};

export default BeforeCompanyVat;
