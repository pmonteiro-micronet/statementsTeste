import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import InputFieldControlled from '@/components/functionsForm/inputs/typeText/page';
import { useTranslations } from 'next-intl';

export default function SearchModal({ buttonName, buttonIcon, buttonColor, inputs, onApplyFilters }) {
    const t = useTranslations('Index');

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Define states for each input
    const initialInputStates = inputs.reduce((acc, input) => {
        acc[input.id] = input.value || '';
        return acc;
    }, {});

    const [inputValues, setInputValues] = useState(initialInputStates);

    const handleInputChange = (id, value) => {
        setInputValues(prevValues => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleClearFilters = () => {
        setInputValues(initialInputStates);
    };

    const handleApplyFilters = () => {
        onApplyFilters(inputValues); // Passa os valores dos inputs para o componente pai
        onOpenChange(false); // Fecha o modal
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
                                        {inputs.map((input, index) => (
                                            <InputFieldControlled
                                                key={index}
                                                type="text"
                                                id={input.id}
                                                name={input.name}
                                                label={input.label}
                                                ariaLabel={input.ariaLabel}
                                                value={inputValues[input.id]} // Passando o valor do estado
                                                onChange={(e) => handleInputChange(input.id, e.target.value)} // Atualizando o valor no estado
                                                style="w-full border-b-4 border-white-300 px-1 h-10 outline-none bg-transparent"
                                            />
                                        ))}
                                    </ModalBody>
                                    <ModalFooter className='flex justify-center gap-5'>
                                        <Button color="primary" onPress={handleClearFilters}>
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
    );
}
