"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import LoadingBackdrop from "@/components/Loader/page";

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };git 

const PersonalIDForm = ({ onClose, personalID, t }) => {
    const [formData, setFormData] = useState(() => ({
        DateOfBirth: personalID?.DateOfBirth || "",
        CountryOfBirth: personalID?.CountryOfBirth || "",
        Nationality: personalID?.Nationality || "",
        IDDoc: personalID?.IDDoc || "",
        NrDoc: personalID?.NrDoc || "",
        ExpDate: personalID?.ExpDate || "",
        Issue: personalID?.Issue || "",
    }));

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

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDataModified(true);
    };

    const getDateValue = (dateStr, defaultStr) => {
        if (!dateStr || dateStr === defaultStr) return "";
        return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    };

    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            {t.modals.personalInfo?.title || "Personal Information"}
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
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.dateofBirth || "Date of Birth"}
                                        </label>
                                        <input
                                            ref={inputRef}
                                            type="date"
                                            name="DateOfBirth"
                                            value={getDateValue(formData.DateOfBirth, "1900-01-01")}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] appearance-none focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.countryofBirth || "Country of Birth"} *
                                        </label>
                                        <input
                                            type="text"
                                            name="CountryOfBirth"
                                            value={formData.CountryOfBirth}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] appearance-none focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.PersonalID.nationality || "Nationality"}
                                        </label>
                                        <input
                                            type="text"
                                            name="Nationality"
                                            value={formData.Nationality}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] appearance-none focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.PersonalID.idDoc} *</label>
                                        <input
                                            type="text"
                                            name="IDDoc"
                                            value={formData.IDDoc}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.PersonalID.idDocNumber} *</label>
                                        <input
                                            type="text"
                                            name="NrDoc"
                                            value={formData.NrDoc}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.PersonalID.expDate} *</label>
                                        <input
                                            type="date"
                                            name="ExpDate"
                                            value={getDateValue(formData.ExpDate, "2050-12-31")}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.PersonalID.issue}</label>
                                        <input
                                            type="text"
                                            name="Issue"
                                            value={formData.Issue}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 -mt-4">
                                    <Button color="error" onClick={handleCloseModal}>
                                        {t.modals.companyInfo.cancel}
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            onClose(formData);
                                        }}
                                    >
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
