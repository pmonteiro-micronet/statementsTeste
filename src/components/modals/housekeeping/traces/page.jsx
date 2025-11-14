"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const HousekeepingTracesForm = ({
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    roomNumber,
    dateCI,
    booker,
    salutation,
    lastName,
    firstName,
    roomType,
    resStatus,
    childs,
    adults,
    balance,
    country,
    isOpen,
    onClose,
}) => {
    const [locale, setLocale] = useState("pt");

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    return (
        <>
            {formTypeModal === 11 && (
                <Modal
                    isOpen={isOpen}
                    hideCloseButton={true}
                    onOpenChange={onClose}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    className="z-50"
                    size="sm"
                    backdrop="dim"
                >
                    <ModalContent>
                        {(onClose) => (
                            <form>
                                <ModalHeader className="flex flex-row !justify-between items-center gap-1 bg-primary text-white p-2">
                                    <div className="flex flex-row justify-start gap-4 pl-4">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                    </div>
                                    <div className="flex flex-row items-center justify-end">
                                        <Button
                                            color="transparent"
                                            variant="light"
                                            className="w-auto min-w-0 p-0 m-0 -pr-4"
                                            onClick={() => {
                                                onClose();
                                                window.location.reload();
                                            }}
                                        >
                                            <MdClose size={30} />
                                        </Button>
                                    </div>
                                </ModalHeader>

                                <ModalBody className="flex flex-col p-5 bg-background min-h-[400px]">
                                    <div className="flex flex-col flex-grow">
                                        {/* intervalo de datas */}
                                        <div className="flex flex-row justify-between gap-4">
                                            <div>
                                                <input type="date" defaultValue={today} className="border border-gray-300 rounded px-2 py-1" />
                                            </div>
                                            <div>
                                                <input type="date" defaultValue={today} className="border border-gray-300 rounded px-2 py-1" />
                                            </div>
                                        </div>
                                        {/* search */}
                                        <div className="relative w-full mt-2">
                                            <input
                                                type="text"
                                                placeholder={t.modals.housekeeping.traces.search}
                                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                        </div>
                                    </div>

                                    {/* Footer com botões */}
                                    <div className="flex justify-between gap-3 mt-4">
                                        <button className="px-4 py-2 rounded">{t.modals.housekeeping.traces.all}</button>
                                        <button className="px-4 py-2 rounded">{t.modals.housekeeping.traces.open}</button>
                                        <button className="px-4 py-2 rounded">{t.modals.housekeeping.traces.done}</button>
                                    </div>
                                </ModalBody>
                            </form>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default HousekeepingTracesForm;
