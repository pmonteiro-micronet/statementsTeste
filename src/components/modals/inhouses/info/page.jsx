"use client";
import React from "react";
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
            {formTypeModal === 11 && (
                <Modal
                    isOpen={isOpen}
                    hideCloseButton={true}
                    onOpenChange={onClose}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    className="z-50"
                    size="sm"
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

                                <ModalBody className="flex flex-col mx-5 my-2 bg-background min-h-[400px]">
                                    <Tabs aria-label="Options" className="flex flex-col flex-grow">
                                        <Tab key="reservation" title={t.frontOffice.infoModal.departure.reservation.title}>
                                            {/* Garantindo altura mínima para evitar encolhimento */}
                                            <div className="min-h-[300px] flex flex-col gap-5">
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.room}</strong></p>
                                                    <p>{roomNumber}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.roomType}</strong></p>
                                                    <p>{roomType}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.status}</strong></p>
                                                    <p>{resStatus}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.departure}</strong></p>
                                                    <p>{dateCI}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.adults}</strong></p>
                                                    <p>{adults}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.childs}</strong></p>
                                                    <p>{childs}</p>
                                                </div>
                                                <div className="flex justify-between text-textPrimaryColor">
                                                    <p><strong>{t.frontOffice.infoModal.departure.reservation.balance}</strong></p>
                                                    <p>{balance}</p>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab key="profiles" title={t.frontOffice.infoModal.departure.profile.title}>
                                            <div className="min-h-[300px] flex flex-col gap-4">
                                                <p className="text-gray-400">{t.frontOffice.infoModal.departure.profile.travelAgency}</p>
                                                <p className="text-textPrimaryColor">{booker}</p>

                                                <p className="text-gray-400">{t.frontOffice.infoModal.departure.profile.country}</p>
                                                <p className="text-textPrimaryColor">{country}</p>

                                                <p className="text-gray-400">{t.frontOffice.infoModal.departure.profile.guests}</p>
                                                <p className="text-textPrimaryColor">
                                                    {salutation} {lastName && firstName
                                                        ? `${lastName}, ${firstName}`
                                                        : lastName || firstName}
                                                </p>
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
