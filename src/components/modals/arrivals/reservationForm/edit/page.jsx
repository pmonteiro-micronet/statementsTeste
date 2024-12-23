"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { MdClose } from "react-icons/md";

const EditRegistrationForm = ({ currentLabel, currentValue, onSave, onClose, validation }) => {
    const [newValue, setNewValue] = useState("");  
    const [errorMessage, setErrorMessage] = useState("");

    // Cria a referência para o input
    const inputRef = useRef(null);

    useEffect(() => {
        setNewValue(""); // Garante que o campo começa vazio

        // Dá foco ao input assim que o modal for aberto
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentValue]); 

    const handleSave = () => {
        const isEmail = currentLabel.toLowerCase() === "email"; // Verifica se o campo é um email
        
        if (isEmail) {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue); // Validação básica de email
            const hasInvalidDomain = /@guest\.booking\.com$/.test(newValue); // Verifica o domínio inválido
    
            if (!isValidEmail) {
                setErrorMessage("Please enter a valid email address."); // Mensagem para formato inválido
            } else if (hasInvalidDomain) {
                setErrorMessage("Invalid email. It cannot end with @guest.booking.com"); // Mensagem para domínio proibido
            } else {
                setErrorMessage(""); // Limpa o erro se for válido
                onSave(newValue); // Salva o valor
            }
        } else if (validation && !validation(newValue)) {
            setErrorMessage(`${currentLabel} is invalid. Please check the value.`);
        } else {
            setErrorMessage(""); // Limpa o erro
            onSave(newValue); // Salva o valor
        }
    };
    
    return (
        <Modal
            isOpen={true}
            onOpenChange={onClose}
            className="z-50"
            size="lg"
            hideCloseButton={true}
        >
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            Edit {currentLabel}
                            <Button
                                color="transparent"
                                variant="light"
                                onClick={onCloseModal}
                                className="w-auto min-w-0 p-0 m-0"
                            >
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">{`Current ${currentLabel}:`}</label>
                                <input
                                    type="text"
                                    value={currentValue}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-800">{`New ${currentLabel}:`}</label>
                                <input
                                    ref={inputRef} // Referencia o input
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                                {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button color="error" onClick={onCloseModal}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={handleSave}>
                                    Save
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
