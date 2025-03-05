"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const EditVatNoModal = ({ oldVatNo, onSave, onClose }) => {
    const [newVatNo, setNewVatNo] = useState(""); // Novo VAT No digitado pelo usuário
    const [errorMessage, setErrorMessage] = useState("");
    const inputRef = useRef(null); // Referência para o input

    useEffect(() => {
        setNewVatNo(""); // Reseta o campo sempre que o modal abrir
        if (inputRef.current) {
            inputRef.current.focus(); // Foco automático no input
        }
    }, [oldVatNo]);

    const handleSave = () => {
        if (!newVatNo.trim()) {
            setErrorMessage("VAT No cannot be empty");
            return;
        }
    
        console.log("Novo VAT No salvo:", newVatNo);
        onSave(newVatNo); // Passa o novo valor para o componente pai
        onClose(); // Fecha o modal
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
                            Edit VAT No
                            <Button
                                color="transparent"
                                variant="light"
                                onClick={onCloseModal}
                                className="w-auto min-w-0 p-0 m-0"
                            >
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor">
                            {/* VAT No Atual (Antigo) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Current VAT No:</label>
                                <input
                                    type="text"
                                    value={oldVatNo}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                />
                            </div>

                            {/* Novo VAT No */}
                            <div>
                                <label className="block text-sm font-medium text-textPrimaryColor">New VAT No:</label>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newVatNo}
                                    onChange={(e) => setNewVatNo(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                />
                                {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                            </div>

                            {/* Botões */}
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

export default EditVatNoModal;
