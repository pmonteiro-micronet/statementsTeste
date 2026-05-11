"use client";
import React, {useState, useEffect} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { Tabs, Tab } from "@heroui/react";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const InHousesInfoForm = ({
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

    return (
        <>
           {isOpen && (
    <div className="fixed inset-0 bg-black/20 z-40" />
  )}

            {formTypeModal === 11 && (
                <Modal
                    isOpen={isOpen}
                    hideCloseButton={true}
                    onOpenChange={onClose}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    className="z-50"
                    size="sm"
                    backdrop="transparent"
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

                                <ModalBody className="flex flex-col px-5 py-2 bg-background min-h-[400px]">
                                    <Tabs aria-label="Options" className="flex flex-col flex-grow">
                                        <Tab key="reservation" title={t.frontOffice.infoModal.departure.reservation.title}>
                                            <div className="space-y-4">
                                                <div className="bg-cardColor py-4 px-4 rounded-lg">
                                                    <p className="text-[#f7ba83] mb-4 text-lg font-semibold">{t.frontOffice.infoModal.departure.reservation.title}</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.room}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{roomNumber || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.roomType}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{roomType || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.status}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{resStatus || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.arrival.reservation.arrival}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{dateCI || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.adults}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{adults || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.childs}</span>
                                                            <span className="text-textPrimaryColor text-base font-medium">{childs || '-'}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:col-span-2">
                                                            <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.reservation.balance}</span>
                                                            <span className="text-textPrimaryColor text-base font-semibold">{balance || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab key="profiles" title={t.frontOffice.infoModal.departure.profile.title}>
                                            <div className="bg-cardColor py-4 px-4 rounded-lg space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.profile.travelAgency}</span>
                                                        <span className="text-textPrimaryColor text-base font-medium">{booker || '-'}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.profile.country}</span>
                                                        <span className="text-textPrimaryColor text-base font-medium">{country || '-'}</span>
                                                    </div>
                                                    <div className="flex flex-col sm:col-span-2">
                                                        <span className="text-gray-500 text-xs mb-1 font-medium">{t.frontOffice.infoModal.departure.profile.guests}</span>
                                                        <span className="text-textPrimaryColor text-base font-medium">
                                                            {salutation} {lastName && firstName
                                                                ? `${lastName}, ${firstName}`
                                                                : lastName || firstName || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </ModalBody>
                            </form>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default InHousesInfoForm;
