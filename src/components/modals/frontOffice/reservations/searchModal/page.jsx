'use client';
import  { useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

import ClientFormAutocomplete from "@/components/functionsForm/autocomplete/clientForm/page";
import InputFieldControlled from '@/components/functionsForm/inputs/typeText/page';

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

export default function SearchModal({
    buttonName,
    buttonIcon,
    buttonColor,
    handleClientSelect,
}) {

 useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
            setActiveFlag(storedLanguage === "en" ? "usa-uk" : storedLanguage === "pt" ? "pt" : "es");
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleApplyFilters = () => {
        //handleSubmitReservation(); // 
        onOpenChange(false); // fecha o modal
    };

    return (
        <>
            <Button onPress={onOpen} color={buttonColor} className='flex justify-end'>
                {buttonName} {buttonIcon}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='transparent' size='sm' placement='center' hideCloseButton='true'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <div className='bg-white'>
                                <div className='bg-lightBlue mx-2 my-1 rounded-xl'>
                                    <ModalHeader className="flex flex-col gap-1 text-sm"><b>{t("frontOffice.frontDesk.bookings.filters.searchFor")}</b></ModalHeader>
                                    <ModalBody>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"search"}
                                            name={t("general.search")}
                                            label={""}
                                            ariaLabel={"search"}
                                            style={"w-full border-b-4 border-white-300 px-1 h-10 outline-none bg-transparent"}
                                        />
                                        <ClientFormAutocomplete
                                            label={t("frontOffice.frontDesk.bookings.filters.docType")}
                                            style={""}
                                            variant={"flat"}
                                            onChange={(value) => handleClientSelect(value)}
                                        />
                                        <ClientFormAutocomplete
                                            label={t("frontOffice.frontDesk.bookings.filters.docType")}
                                            style={""}
                                            variant={"flat"}
                                            onChange={(value) => handleClientSelect(value)}
                                        />
                                    </ModalBody>
                                    <ModalFooter className='flex justify-center gap-5'>
                                        <Button color="primary" onPress={onClose}>
                                        {t("frontOffice.frontDesk.bookings.filters.cleanFilters")}
                                        </Button>
                                        <Button className='bg-green text-white' onPress={handleApplyFilters}>
                                        {t("frontOffice.frontDesk.bookings.filters.applyFilters")}
                                        </Button>
                                    </ModalFooter>
                                </div>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}