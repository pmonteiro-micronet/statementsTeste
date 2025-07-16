"use client";
import { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import Select from "react-select";
import axios from "axios";


const PersonalIDForm = ({ onClose, personalID, propertyID, t }) => {
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

    const savePersonalID = async (formData, profileID) => {
        try {
            const response = await axios.post('/api/reservations/checkins/registrationForm/editpersonalID', {
                Dateofbirth: formData.DateOfBirth,
                IDCountryofBirth: formData.CountryOfBirth,
                Nationality: formData.Nationality,
                IDDoc: formData.IDDoc,
                DocNr: formData.NrDoc,
                Expdate: formData.ExpDate,
                Issue: formData.Issue,
                profileID: profileID,
                propertyID: propertyID
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error("savePersonalID error:", error?.response?.data || error.message);
            return { success: false, error: error?.response?.data || error.message };
        }
    };

    const handleSave = async () => {
        const result = await savePersonalID(formData, personalID);

        if (result.success) {
            setIsDataModified(false);
            onClose(formData);
        } else {
            console.log("Erro ao alterar dados:", result.error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 300); // atraso leve ajuda a garantir foco após animação/modal aberto

        return () => clearTimeout(timer);
    }, []);


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
                                        <input
                                            type="text"
                                            name="DateOfBirth"
                                            value={formData.DateOfBirth}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

                                                // Aplica a máscara: dd/mm/yyyy
                                                if (value.length > 2 && value.length <= 4) {
                                                    value = value.slice(0, 2) + "/" + value.slice(2);
                                                } else if (value.length > 4) {
                                                    value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
                                                }

                                                setFormData((prev) => ({ ...prev, DateOfBirth: value }));
                                                setIsDataModified(true);
                                            }}
                                            placeholder="dd/mm/aaaa"
                                            maxLength={10}
                                            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
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
                                                setFormData(prev => ({ ...prev, CountryOfBirth: selectedOption.label }));
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
                                                setFormData(prev => ({ ...prev, Nationality: selectedOption.label }));
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
                                                setFormData(prev => ({ ...prev, IDDoc: selectedOption.label }));
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
                                        <input
                                            type="text"
                                            name="ExpDate"
                                            value={formData.ExpDate}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

                                                if (value.length > 2 && value.length <= 4) {
                                                    value = value.slice(0, 2) + "/" + value.slice(2);
                                                } else if (value.length > 4) {
                                                    value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
                                                }

                                                setFormData((prev) => ({ ...prev, ExpDate: value }));
                                                setIsDataModified(true);
                                            }}
                                            placeholder="dd/mm/aaaa"
                                            maxLength={10}
                                            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
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
