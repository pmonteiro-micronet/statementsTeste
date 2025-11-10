"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import Select from "react-select";
import axios from "axios";
import LoadingBackdrop from "@/components/Loader/page";

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const MultiModalManager = ({ openModal, setOpenModal, propertyID, onSave, profileID, resNo, companyID, companyData }) => {
    const [activeModal, setActiveModal] = useState(null); // "edit" | "insert" | "search" | null
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [formData, setFormData] = useState({ companyName: "", vatNo: "" });
    const [pageNumber, setPageNumber] = useState(1);
    const t = translations.pt; // você pode trocar para locale dinâmico
    const inputRef = useRef(null);
    const vatRef = useRef(null);
    // const [locale, setLocale] = useState("pt");
    const [errorMessage, setErrorMessage] = useState("");
    const [vatError, setVatError] = useState("");
    // const [isDataModified, setIsDataModified] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null); // armazena a empresa selecionada
    const [isEditing, setIsEditing] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const extractedCompanyID = selectedCompany?.CompanyID;
    const [companyFormData, setCompanyFormData] = useState(() => {
        if (companyData) {
            return {
                companyName: companyData.companyName || "",
                vatNo: companyData.vatNo || "",
                emailAddress: companyData.emailAddress || "",
                country: "",
                countryName: companyData.country || "",
                streetAddress: companyData.streetAddress || "",
                zipCode: companyData.zipCode || "",
                city: companyData.city || "",
                state: companyData.state || "",
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

    useEffect(() => {
        if (selectedCompany) {
            // Cenário: empresa nova selecionada via pesquisa
            setCompanyFormData({
                companyName: selectedCompany.name1 || "",
                vatNo: selectedCompany.vatno || "",
                emailAddress: selectedCompany.email || "",
                country: selectedCompany.land || "",
                countryName: "",
                streetAddress: selectedCompany.strasse || "",
                zipCode: selectedCompany.plz || "",
                city: selectedCompany.city || "",
                state: selectedCompany.region || "",
            });
            setIsEditing(true); // opcional: já permite edição
        } else if (companyData) {
            // Cenário: empresa já associada
            setCompanyFormData({
                companyName: companyData.companyName || "",
                vatNo: companyData.vatNo || "",
                emailAddress: companyData.emailAddress || "",
                country: companyData.countryID || "",
                countryName: companyData.countryName || "",
                streetAddress: companyData.streetAddress || "",
                zipCode: companyData.zipCode || "",
                city: companyData.city || "",
                state: companyData.state || "",
            });
        } else {
            // Nenhuma empresa: campos vazios
            setCompanyFormData({
                companyName: "",
                vatNo: "",
                emailAddress: "",
                country: "",
                countryName: "",
                streetAddress: "",
                zipCode: "",
                city: "",
                state: "",
            });
        }
    }, [selectedCompany, companyData]);

    useEffect(() => {
        if (openModal) setActiveModal(openModal);
    }, [openModal]);

    const closeAll = () => {
        setActiveModal(null);
        setIsResultsModalOpen(false);
        setSelectedCompany(null);
        setIsEditing(false);

        // 🔹 Também limpa o estado do pai
        if (setOpenModal) setOpenModal(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleSelectCompany = (company) => {
        console.log("Empresa selecionada:", company);
        setSelectedCompany(company);  // guarda a empresa
        setActiveModal("edit");       // abre o modal de edição
        setIsResultsModalOpen(false); // fecha modal de resultados
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setPageNumber(1);
            handleSearchClick(true);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
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

    const handleCountryChange = (selectedOption) => {
        setCompanyFormData(prev => ({
            ...prev,
            country: selectedOption.value,
            countryName: selectedOption.label, // Nome do país (land)
            vatNo: prev.vatNo // mantém o VAT sempre
        }));
    };

    const handleSave = async () => {
        if (!companyFormData.companyName) {
            setErrorMessage("Nome da empresa é obrigatório");
            return;
        }

        if (companyFormData.emailAddress && !emailRegex.test(companyFormData.emailAddress)) {
            setErrorMessage("Email inválido");
            return;
        }

        // Montar payload limpo
        const payload = Object.fromEntries(
            Object.entries({
                profileID,
                propertyID,
                resNo,
                companyID: companyID || extractedCompanyID,
                countryID: companyFormData.country,
                countryName: companyFormData.countryName,
                companyName: companyFormData.companyName,
                vatNo: companyFormData.vatNo,
                emailAddress: companyFormData.emailAddress,
                streetAddress: companyFormData.streetAddress,
                zipCode: companyFormData.zipCode,
                city: companyFormData.city,
                state: companyFormData.state,
                oldCompany: companyID,
                hasCompanyVAT: 1,
                BlockedCVatNO: 0,
            }).map(([key, value]) => {
                // 🔹 mantém os inteiros sem converter para string
                if (key === "hasCompanyVAT" || key === "BlockedCVatNO") {
                    return [key, Number(value)];
                }

                // 🔹 os outros campos continuam como strings
                return [key, String(value || "").trim()];
            })
        );

        // Enviar dados novos para o pai
        onSave(payload);
        closeAll();
    };

    if (loading) return <LoadingBackdrop open={true} />;

    return (
        <>
            {/* ---------- Modal de Edição ---------- */}
            <Modal
                isOpen={activeModal === "edit"}
                onOpenChange={closeAll}
                className="z-70"
                size="5xl"
                hideCloseButton={true}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                                {t.modals.companyInfo.update}
                                <Button color="transparent" variant="light" onClick={closeAll} className="w-auto min-w-0 p-0 m-0">
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
                                                value={companyFormData.companyName}
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
                                                value={companyFormData.vatNo}
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
                                                value={companyFormData.streetAddress}
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
                                                value={companyFormData.zipCode}
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
                                                value={companyFormData.city}
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
                                                value={companyFormData.state}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-sm font-medium">{t.modals.companyInfo.country}</label>
                                            <Select
                                                options={countryOptions}
                                                value={countryOptions.find(option => option.value === companyFormData.country)}
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
                                                value={companyFormData.emailAddress}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {errorMessage && <p className="text-red-500 text-xs -mt-4">{errorMessage}</p>}
                                <div className="flex justify-end space-x-2 -mt-4">
                                    <Button color="error" onClick={closeAll}>{t.modals.companyInfo.cancel}</Button>
                                    <Button color="primary" onClick={handleSave}>
                                        {t.modals.companyInfo.selectCompany}
                                    </Button>
                                    <Button color="primary" onClick={() => setShowConfirmNewCompanyModal(true)}>
                                        {t.modals.companyInfo.newCompany}
                                    </Button>
                                    <Button color="primary" onClick={() => setActiveModal("search")}>
                                        {t.modals.companyInfo.searchCompany}
                                    </Button>
                                    {isEditing ? (
                                        <Button color="primary" onClick={handleSave}>
                                            {t.modals.companyInfo.save}
                                        </Button>
                                    ) : (
                                        <Button color="primary" onClick={handleEdit}>
                                            {t.modals.companyInfo.edit}
                                        </Button>
                                    )}
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* ---------- Modal de Pesquisa ---------- */}
            <Modal
                isOpen={activeModal === "search"}
                onOpenChange={closeAll}
                className="z-50"
                size="5xl"
                hideCloseButton={true}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-12">
                                {t.modals?.companyInfo?.insert || "Insert Company Info"}
                                <Button color="transparent" variant="light" onClick={closeAll} className="w-auto min-w-0 p-0 m-0">
                                    <MdClose size={30} />
                                </Button>
                            </ModalHeader>

                            <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                                {/* Formulário de pesquisa */}
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
                                                onKeyDown={handleKeyDown}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />
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

            {/* ---------- Modal interno de resultados ---------- */}
            <Modal
                isOpen={isResultsModalOpen}
                onOpenChange={() => setIsResultsModalOpen(false)}
                className="z-60"
                size="3xl"
                hideCloseButton={true}
            >
                <ModalContent>
                    <ModalBody className="p-0 flex flex-col max-h-[70vh]">
                        {searchResults.length === 0 ? (
                            <div className="p-4 flex-grow overflow-auto">
                                <div className="flex flex-col gap-4">
                                    <p>{t.modals.companyInfo.noResults}</p>
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <Button onClick={() => setIsResultsModalOpen(false)} className="bg-transparent text-textPrimaryColor">
                                            {t.modals.companyInfo.showCompany.cancel}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsResultsModalOpen(false);
                                                setActiveModal("insert");
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
                                <div className="flex-grow overflow-y-auto px-4">
                                    <table className="w-full text-left min-w-max border-collapse mt-2">
                                        <thead className="sticky top-0 z-50 bg-primary text-white shadow-md">
                                            <tr className="h-12">
                                                <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                    {t.modals.companyInfo.showCompany.companyName}
                                                </th>
                                                <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                    {t.modals.companyInfo.showCompany.vatNo}
                                                </th>
                                                <th className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase font-medium">
                                                    {t.modals.companyInfo.showCompany.country}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-textPrimaryColor">
                                            {searchResults.map((company, index) => (
                                                <tr
                                                    key={company.kdnr || index}
                                                    className="hover:bg-primary-100 cursor-pointer hover:text-black"
                                                    onClick={() => handleSelectCompany(company)}
                                                >
                                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">{company.name1 || "—"}</td>
                                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">{company.vatno || "—"}</td>
                                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] py-2">{company.land || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="sticky bottom-0 bg-tableFooterBorder px-4 py-2 flex justify-end gap-4 z-40 border-t border-gray-200">
                                    <Button onClick={() => setIsResultsModalOpen(false)} className="bg-gray-200 text-black">
                                        {t.modals.companyInfo.showCompany.cancel}
                                    </Button>
                                    <Button onClick={() => handleSearchClick(false)} className="bg-primary text-white">
                                        {t.modals.companyInfo.showCompany.searchMore}
                                    </Button>
                                    <Button onClick={() => setActiveModal("insert")} className="bg-primary text-white">
                                        {t.modals.companyInfo.newCompany}
                                    </Button>
                                </div>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default MultiModalManager;
