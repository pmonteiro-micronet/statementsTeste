"use client";
import { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import Select from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import { AiOutlineCalendar } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";

const PersonalIDForm = ({ onClose, onSave, personalID, propertyID, t }) => {
    //popula o select de pais de origem
    const [countryOptions, setCountryOptions] = useState([]);
    //popula o select do ID DOC
    const [docTypeOptions, setDocTypeOptions] = useState([]);

    const [formData, setFormData] = useState(() => ({
        DateOfBirth: personalID?.DateOfBirth ? personalID.DateOfBirth.split('T')[0] : "",
        CountryOfBirth: personalID?.CountryOfBirth || "",
        Nationality: personalID?.Nationality || "",
        IDDoc: personalID?.IDDoc || "",
        NrDoc: personalID?.NrDoc || "",
        ExpDate: personalID?.ExpDate ? personalID.ExpDate.split('T')[0] : "",
        Issue: personalID?.Issue || "",
    }));

    console.log("ID", propertyID);
    const [isDataModified, setIsDataModified] = useState(false);
    const inputRef = useRef(null);

    const [selectIDForm, setSelectIDFrom] = useState(() => ({
        IDCountryOfBirth: "",
        IDDocSelect: "",
        IDNationality: ""
    }));

    const handleCloseModal = () => {
        if (isDataModified) {
            const confirmLeave = window.confirm("Você vai perder os dados, continuar?");
            if (confirmLeave) onClose();
        } else {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDataModified(true);
    };

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    //useEffect para popular countryOptions
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                if (!propertyID) {
                    console.log("Não há propertyID associado", propertyID);
                }
                const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
                const formattedOptions = response.data
                    .map((country) => ({
                        value: country.codenr,
                        label: country.land,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountryOptions(formattedOptions);
            } catch (error) {
                console.error("Erro ao buscar países:", error);
            }
        };
        fetchCountries();
    }, [propertyID]);

    //useEffect para popular docTypeOptions
    useEffect(() => {
        const fetchDocTypes = async () => {
            try {
                if (!propertyID) {
                    console.log("Não há propertyID associado", propertyID);
                    return;
                }

                const response = await axios.get(
                    `/api/reservations/checkins/registrationForm/doctypes?propertyID=${propertyID}`
                );

                const formattedOptions = response.data
                    .map((doc) => ({
                        value: doc.value,
                        label: doc.label,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));

                setDocTypeOptions(formattedOptions);

            } catch (error) {
                console.error("Erro ao buscar tipos de documentos:", error);
            }
        };

        fetchDocTypes();
    }, [propertyID]);

    // const savePersonalID = async (formData, selectIDForm) => {
    //     try {
    //         const response = await axios.post('/api/reservations/checkins/registrationForm/editpersonalID', {
    //             DateOfBirth: formData.DateOfBirth,
    //             CountryOfBirth: selectIDForm.IDCountryOfBirth,
    //             Nationality: selectIDForm.IDNationality,
    //             IDDoc: selectIDForm.IDDocSelect,
    //             DocNr: formData.NrDoc,
    //             ExpDate: formData.ExpDate,
    //             Issue: formData.Issue,
    //             profileID: profileID,
    //             propertyID: propertyID
    //         });

    //         return { success: true, data: response.data };
    //     } catch (error) {
    //         console.error("savePersonalID error:", error?.response?.data || error.message);
    //         return { success: false, error: error?.response?.data || error.message };
    //     }
    // };

    // const handleSave = async () => {
    //     const result = await savePersonalID(formData, selectIDForm);

    //     if (result.success) {
    //         setIsDataModified(false);
    //         onClose(formData);
    //     } else {
    //         console.log("Erro ao alterar dados:", result.error);
    //     }
    // };

    const handleSave = () => {
        onSave({
            ...formData,
            IDCountryOfBirth: selectIDForm.IDCountryOfBirth,
            IDDocSelect: selectIDForm.IDDocSelect,
            IDNationality: selectIDForm.IDNationality
        });
        setIsDataModified(false);
        onClose();
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 300); // atraso leve ajuda a garantir foco após animação/modal aberto

        return () => clearTimeout(timer);
    }, []);

    const expDateRef = useRef(null);
    const dobRef = useRef(null);

    // Converte string "aaaa/mm/dd" para Date
    const parseDate = (value) => {
        if (!value) return null;
        const parts = value.split("/");
        if (parts.length === 3) {
            const [yyyy, mm, dd] = parts;
            return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        }
        return null;
    };
    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-10">
                            {t.modals.PersonalID.title}
                            <Button
                                color="transparent"
                                variant="light"
                                onClick={handleCloseModal}
                                className="w-auto min-w-0 p-0 m-0"
                            >
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>

                        <ModalBody className="flex flex-col mx-5 my-5 space-y-6 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col gap-6">

                                {/* Linha 1: Data de nascimento, País de nascimento, Nacionalidade */}
                                <div className="flex flex-row justify-between w-full gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.dateofBirth}
                                        </label>

                                        <div className="flex items-center gap-2">
                                            {/* Input da data de nascimento */}
                                            <input
                                                type="text"
                                                name="DateOfBirth"
                                                value={formData.DateOfBirth}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, ""); // só números

                                                    // Aplica a máscara: aaaa/mm/dd
                                                    if (value.length > 4 && value.length <= 6) {
                                                        value = value.slice(0, 4) + "/" + value.slice(4);
                                                    } else if (value.length > 6) {
                                                        value =
                                                            value.slice(0, 4) +
                                                            "/" +
                                                            value.slice(4, 6) +
                                                            "/" +
                                                            value.slice(6, 8);
                                                    }

                                                    setFormData((prev) => ({ ...prev, DateOfBirth: value }));
                                                    setIsDataModified(true);
                                                }}
                                                placeholder="aaaa/mm/dd"
                                                maxLength={10}
                                                className="w-full border border-gray-300 rounded-md px-2 py-2
        focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />

                                            {/* Ícone do calendário */}
                                            <AiOutlineCalendar
                                                size={22}
                                                className="cursor-pointer text-gray-500 hover:text-orange-500"
                                                onClick={() => dobRef.current?.setOpen(true)}
                                            />
                                        </div>

                                        {/* DatePicker invisível, controlado pelo ícone */}
                                        <DatePicker
                                            ref={dobRef}
                                            selected={parseDate(formData.DateOfBirth)}
                                            onChange={(date) => {
                                                if (!date) {
                                                    setFormData((prev) => ({ ...prev, DateOfBirth: "" }));
                                                    setIsDataModified(true);
                                                    return;
                                                }

                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const day = String(date.getDate()).padStart(2, "0");

                                                const formatted = `${year}/${month}/${day}`;

                                                setFormData((prev) => ({ ...prev, DateOfBirth: formatted }));
                                                setIsDataModified(true);
                                            }}
                                            dateFormat="yyyy/MM/dd"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            withPortal={false}
                                            popperPlacement="bottom-end"   // abre embaixo do ícone
                                            popperModifiers={[
                                                {
                                                    name: "preventOverflow",
                                                    options: {
                                                        boundary: "viewport", // evita cortar no fim da tela
                                                    },
                                                },
                                            ]}
                                            className="hidden"
                                        />
                                    </div>



                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.countryofBirth} *
                                        </label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(option => option.label === formData.CountryOfBirth)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    CountryOfBirth: selectedOption.label  // ex: "Portugal"
                                                }));

                                                setSelectIDFrom(prev => ({
                                                    ...prev,
                                                    IDCountryOfBirth: selectedOption.value  // ex: "PT"
                                                }));

                                                setIsDataModified(true);
                                            }}
                                            isSearchable
                                        />

                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.nationality}
                                        </label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(option => option.label === formData.Nationality)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Nationality: selectedOption.label  // ex: "Portugal"
                                                }));

                                                setSelectIDFrom(prev => ({
                                                    ...prev,
                                                    IDNationality: selectedOption.value  // ex: "PT"
                                                }));

                                                setIsDataModified(true);
                                            }}
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                {/* Linha 2: Tipo de documento e número */}
                                <div className="flex flex-row justify-between gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.idDoc} *
                                        </label>
                                        <Select
                                            options={docTypeOptions}
                                            value={docTypeOptions.find(option => option.label === String(formData.IDDoc)) || null}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    IDDoc: selectedOption.label  // ex: "Bilhete Identidade"
                                                }));

                                                setSelectIDFrom(prev => ({
                                                    ...prev,
                                                    IDDocSelect: selectedOption.value  // ex: "BI"
                                                }));

                                                setIsDataModified(true);
                                            }}
                                            isSearchable
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.idDocNumber} *
                                        </label>
                                        <input
                                            type="text"
                                            name="NrDoc"
                                            value={formData.NrDoc}
                                            onChange={handleChange}
                                            required
                                            ref={inputRef}
                                            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                {/* Linha 3: Data de expiração e entidade emissora */}
                                <div className="flex flex-row justify-between gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.expDate}
                                        </label>

                                        <div className="flex items-center gap-2">
                                            {/* Input da data */}
                                            <input
                                                type="text"
                                                name="ExpDate"
                                                value={formData.ExpDate}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/g, ""); // só números
                                                    if (value.length > 4 && value.length <= 6) {
                                                        value = value.slice(0, 4) + "/" + value.slice(4);
                                                    } else if (value.length > 6) {
                                                        value =
                                                            value.slice(0, 4) +
                                                            "/" +
                                                            value.slice(4, 6) +
                                                            "/" +
                                                            value.slice(6, 8);
                                                    }

                                                    setFormData((prev) => ({ ...prev, ExpDate: value }));
                                                    setIsDataModified(true);
                                                }}
                                                placeholder="aaaa/mm/dd"
                                                maxLength={10}
                                                className="w-full border border-gray-300 rounded-md px-2 py-2
        focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                            />

                                            {/* Ícone do calendário fora do input */}
                                            <AiOutlineCalendar
                                                size={22}
                                                className="cursor-pointer text-gray-500 hover:text-orange-500"
                                                onClick={() => expDateRef.current?.setOpen(true)}
                                            />
                                        </div>

                                        {/* DatePicker controlado pelo ícone */}
                                        <DatePicker
                                            ref={expDateRef}
                                            selected={parseDate(formData.ExpDate)}
                                            onChange={(date) => {
                                                if (!date) {
                                                    setFormData((prev) => ({ ...prev, ExpDate: "" }));
                                                    setIsDataModified(true);
                                                    return;
                                                }

                                                const year = date.getFullYear();
                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                const day = String(date.getDate()).padStart(2, "0");

                                                const formatted = `${year}/${month}/${day}`;

                                                setFormData((prev) => ({ ...prev, ExpDate: formatted }));
                                                setIsDataModified(true);
                                            }}
                                            dateFormat="yyyy/MM/dd"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            withPortal={false}
                                            popperPlacement="bottom-end"   // abre embaixo do ícone
                                            popperModifiers={[
                                                {
                                                    name: "preventOverflow",
                                                    options: {
                                                        boundary: "viewport", // evita cortar no fim da tela
                                                    },
                                                },
                                            ]}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.issue}
                                        </label>
                                        <input
                                            type="text"
                                            name="Issue"
                                            value={formData.Issue}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex justify-end space-x-2">
                                    <Button color="error" onClick={handleCloseModal}>
                                        {t.modals.companyInfo.cancel}
                                    </Button>
                                    <Button color="primary" onClick={handleSave}>
                                        {t.modals.companyInfo.save}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>


                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default PersonalIDForm;
