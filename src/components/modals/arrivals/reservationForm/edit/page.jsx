"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { MdClose } from "react-icons/md";

const EditRegistrationForm = ({ currentLabel, currentValue, onSave, onClose, validation }) => {
    const [newValue, setNewValue] = useState("");  // Inicializa com um valor vazio
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setNewValue(""); // Garante que o campo "Novo" começa vazio sempre que o modal é aberto
    }, [currentValue]);  // Quando o valor atual mudar, o novo valor se mantém vazio

    const handleSave = () => {
        if (validation && !validation(newValue)) {
            setErrorMessage(`${currentLabel} inválido(a). Por favor, verifique o valor.`);
        } else if (newValue) {
            onSave(newValue); // Chama a função de salvar do componente principal
        }
    };

    return (
        <Modal
            isOpen={true}
            onOpenChange={onClose}
            className="z-50"
            size="lg"
            hideCloseButton={true} // Oculta o botão padrão de fechar
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
                                <label className="block text-sm font-medium text-gray-700">{`Current ${currentLabel}:`}</label>
                                <input
                                    type="text"
                                    value={currentValue}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{`New ${currentLabel}:`}</label>
                                <input
                                    type="text"
                                    value={newValue}
                                    onChange={(e) => setNewValue(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1"
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
