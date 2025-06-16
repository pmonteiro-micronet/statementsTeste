"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
//imports de icons
import { MdClose } from "react-icons/md";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const ArrivalInfoForm = ({
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
    totalPax,
    balance,
    country,
    isOpen,
    onClose,
}) => {

    const [activeKey, setActiveKey] = useState("reservation"); // Estado de controle da aba ativa
    
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

    return (
        <>
            {formTypeModal === 11 && (
                <>
                    <Modal
                        isOpen={isOpen}
                        hideCloseButton={true}
                        onOpenChange={onClose}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                        size="sm"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form>
                                        <ModalHeader className="flex flex-row !justify-between items-center gap-1 bg-primary text-white p-2">
                                            <div className="flex flex-row justify-start gap-4 pl-4">
                                                {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            </div>
                                            <div className='flex flex-row items-center justify-end'>
                                                <Button color="transparent" variant="light" className={"w-auto min-w-0 p-0 m-0 -pr-4"} onClick={() => { onClose(); window.location.reload(); }}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col space-y-8 bg-background">
                                            {/* Abas feitas com divs */}
                                            <div className="flex justify-center">
                                                <div className="flex flex-row justify-center bg-gray-100 w-40 h-10 rounded-xl">
                                                    <div
                                                        onClick={() => setActiveKey("reservation")}
                                                        className={`cursor-pointer p-2 ${activeKey === "reservation" ? "bg-white text-black rounded-lg m-1 text-sm text-bold border border-gray-200" : "text-gray-500 m-1 text-sm"}`}
                                                    >
                                                        {t.frontOffice.infoModal.arrival.reservation.title}
                                                    </div>
                                                    <div
                                                        onClick={() => setActiveKey("profiles")}
                                                        className={`cursor-pointer p-2 ${activeKey === "profiles" ? "bg-white text-black rounded-lg m-1 text-sm text-bold border border-gray-200" : "text-gray-500 m-1 text-sm"}`}
                                                    >
                                                        {t.frontOffice.infoModal.arrival.profile.title}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {activeKey === "reservation" && (
                                                    <div className="-mt-8 flex flex-col gap-5">
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.room}</strong></p>
                                                            <p>{roomNumber}</p>
                                                        </div>
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.roomType}</strong></p>
                                                            <p>{roomType}</p>
                                                        </div>
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.status}</strong></p>
                                                            <p>{resStatus}</p>
                                                        </div>
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.arrival}</strong></p>
                                                            <p>{dateCI}</p>
                                                        </div>
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.pax}</strong></p>
                                                            <p>{totalPax}</p>
                                                        </div>
                                                        <div className="flex justify-between text-textPrimaryColor">
                                                            <p><strong>{t.frontOffice.infoModal.arrival.reservation.balance}</strong></p>
                                                            <p>{balance}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {activeKey === "profiles" && (
                                                    <div>
                                                        <div className="-mt-8 flex flex-col gap-4">
                                                            <p className="text-gray-400">{t.frontOffice.infoModal.arrival.profile.travelAgency}</p>
                                                            <p className="text-textPrimaryColor">{booker}</p>
                                                        </div>
                                                        <div className="mt-10 flex flex-col gap-4">
                                                            <p className="text-gray-400">{t.frontOffice.infoModal.arrival.profile.country}</p>
                                                            <p className="text-textPrimaryColor">{country}</p>
                                                        </div>
                                                        <div className="mt-10 flex flex-col gap-4">
                                                            <p className="text-gray-400">{t.frontOffice.infoModal.arrival.profile.guests}</p>
                                                            <p className="text-textPrimaryColor">{salutation}
                                                                {lastName && firstName
                                                                    ? `${lastName}, ${firstName}`
                                                                    : lastName || firstName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </ModalBody>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ArrivalInfoForm;
