"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import axios from "axios";

const PropertiesEditForm = ({ hotel, onClose }) => {
    const [propertyName, setPropertyName] = useState(hotel.propertyName || "");
    const [propertyTag, setPropertyTag] = useState(hotel.propertyTag || "");
    const [propertyServer, setPropertyServer] = useState(hotel.propertyServer || "");
    const [propertyPort, setPropertyPort] = useState(hotel.propertyPort || "");
    const [mpeHotel, setMpeHotel] = useState(hotel.propertyPort || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        // Verifica se algum campo foi alterado antes de fazer a requisição
        if (!propertyName || !propertyTag || !propertyServer) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            // Envia a requisição PUT para atualizar a propriedade
            const response = await axios.patch(`/api/properties/${hotel.propertyID}`, {
                propertyName,
                propertyTag,
                propertyServer,
                propertyPort,
                mpeHotel
            });

            if (response.status === 200) {
                onClose(); // Fecha o modal
            }
        } catch (error) {
            console.error("Error updating property:", error);
            setError("Failed to update property. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onOpenChange={onClose}
            className="z-50"
            size="lg"
            hideCloseButton={true}
            backdrop="transparent"
        >
            <ModalContent>
                <ModalHeader className="flex flex-row justify-between items-center gap-1 p-2 px-4 bg-primary text-white">
                    Edit Property
                    <Button
                        color="transparent"
                        variant="light"
                        onClick={onClose}
                        className="w-auto min-w-0 p-0 m-0"
                    >
                        <MdClose size={30} />
                    </Button>
                </ModalHeader>
                <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">{`Property Name:`}</label>
                        <input
                            type="text"
                            value={propertyName}
                            onChange={(e) => setPropertyName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                        <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                            <label className="block text-sm font-medium text-gray-400">{`Property Tag:`}</label>
                            <input
                                type="text"
                                value={propertyTag}
                                onChange={(e) => setPropertyTag(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                            <label className="block text-sm font-medium text-gray-400">{`MPE Hotel:`}</label>
                            <input
                                type="text"
                                value={mpeHotel}
                                onChange={(e) => setMpeHotel(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                        <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                            <label className="block text-sm font-medium text-gray-400">{`Property Server:`}</label>
                            <input
                                type="text"
                                value={propertyServer}
                                onChange={(e) => setPropertyServer(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                            <label className="block text-sm font-medium text-gray-400">{`Property Port:`}</label>
                            <input
                                type="text"
                                value={propertyPort}
                                onChange={(e) => setPropertyPort(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                            />
                        </div>
                    </div>


                    {/* Exibição de erro */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <Button color="error" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PropertiesEditForm;
