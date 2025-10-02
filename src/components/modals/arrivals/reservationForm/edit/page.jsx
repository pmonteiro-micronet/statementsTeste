"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

import en from "../../../../../../public/locales/english/common.json";
import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const EditRegistrationForm = ({
    currentLabel,
    currentValue,
    additionalValue,
    onSave,
    onClose,
    validation,
}) => {
    const isEmail = currentLabel.toLowerCase() === "e-mail";
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newValue, setNewValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const inputRef = useRef(null);

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

    useEffect(() => {
        setNewEmail("");
        setNewPhone("");
        setNewValue("");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentValue]);

   const handleSave = () => {
    if (isEmail) {
        const trimmedEmail = newEmail.trim();
        const trimmedPhone = newPhone.trim();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const invalidDomain = /@guest\.booking\.com$/i;

        if (!trimmedEmail && !trimmedPhone) {
            setErrorMessage(t.modals.companyInfo.errors.phoneOrEmail);
            return;
        }

        if (trimmedEmail) {
            if (!emailRegex.test(trimmedEmail)) {
                setErrorMessage(t.modals.companyInfo.errors.invalidEmail);
                return;
            }
            if (invalidDomain.test(trimmedEmail)) {
                setErrorMessage(t.modals.companyInfo.errors.invalidEmailBooking);
                return;
            }
        }

        setErrorMessage("");
        onSave({
            email: trimmedEmail || currentValue,
            phoneNumber: trimmedPhone || additionalValue,
        });
    } else {
        const trimmed = newValue.trim();

        if (!trimmed) {
            setErrorMessage(`${currentLabel} {t.modals.companyInfo.emptyFields}`);
            return;
        }

        if (validation && !validation(trimmed)) {
            setErrorMessage(`${currentLabel} {t.modals.companyInfo.invalidFields}`);
            return;
        }

        setErrorMessage("");
        onSave(trimmed);
    }
};



    return (
        <Modal
            isOpen={true}
            onOpenChange={onClose}
            className="z-50"
            size="3xl"
            hideCloseButton={true}
            isDismissable={false}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-12">
                            Edit info
                            <Button
                                color="transparent"
                                variant="light"
                                onClick={onCloseModal}
                                className="w-auto min-w-0 p-0 m-0"
                            >
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-2 my-2 space-y-2 text-textPrimaryColor">
                            {isEmail ? (
                            
                                        <>
                                        <div className="flex flex-row justify-between gap-4">
                                        <div className="flex flex-col gap-2 w-2/3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">{t.modals.Contacts.currentEmail}</label>
                                                <input
                                                    type="text"
                                                    value={currentValue}
                                                    readOnly
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.Contacts.newEmail}</label>
                                                <input
                                                    ref={inputRef}
                                                    type="text"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                                />
                                            </div>
                               </div>
                               <div className="flex flex-col gap-2 w-1/3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">{t.modals.Contacts.currentPhone}</label>
                                                <input
                                                    type="text"
                                                    value={additionalValue}
                                                    readOnly
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-textPrimaryColor">{t.modals.Contacts.newPhone}</label>
                                                <input
                                                    type="text"
                                                    value={newPhone}
                                                    onChange={(e) => setNewPhone(e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                                />
                                            </div>
                                            </div>
                                            </div>
                                        </>
                                
                               
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400">{`${t.modals.Contacts.current} ${currentLabel}:`}</label>
                                        <input
                                            type="text"
                                            value={currentValue}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-textPrimaryColor">{`${t.modals.Contacts.new} ${currentLabel}:`}</label>
                                        <input
                                            ref={inputRef}
                                            type={currentLabel.toLowerCase() === "vat no." ? "number" : "text"}
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Erro (se houver) */}
                            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}

                            {/* Botões */}
                            <div className="flex justify-end space-x-2 pt-2">
                                <Button color="error" onClick={onCloseModal}>
                                    {t.modals.companyInfo.cancel}
                                </Button>
                                <Button color="primary" onClick={handleSave}>
                                    {t.modals.companyInfo.save}
                                </Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default EditRegistrationForm;
