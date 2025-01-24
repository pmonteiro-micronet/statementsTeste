"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { Tabs, Tab } from "@nextui-org/react";

const PropertiesEditForm = ({ hotel, onClose }) => {
    const [propertyName, setPropertyName] = useState(hotel.propertyName || "");
    const [propertyTag, setPropertyTag] = useState(hotel.propertyTag || "");
    const [propertyServer, setPropertyServer] = useState(hotel.propertyServer || "");
    const [propertyPort, setPropertyPort] = useState(hotel.propertyPort || "");
    const [mpehotel, setmpehotel] = useState(hotel.mpehotel || "");
    const [pdfFilePath, setPdfFilePath] = useState(hotel.pdfFilePath || "");
    const [passeIni, setPasseIni] = useState(hotel.passeIni || "");

    const [hotelName, setHotelName] = useState(hotel.hotelName || "");
    const [hotelMiniTerms, setHotelMiniTerms] = useState(hotel.hotelMiniTerms || "");
    const [hotelPhone, setHotelPhone] = useState(hotel.hotelPhone || "");
    const [hotelEmail, setHotelEmail] = useState(hotel.hotelEmail || "");
    const [hotelAddress, setHotelAddress] = useState(hotel.hotelAddress || "");
    const [hotelPostalCode, setHotelPostalCode] = useState(hotel.hotelPostalCode || "");
    const [hotelRNET, setHotelRNET] = useState(hotel.hotelRNET || "");
    const [hotelNIF, setHotelNIF] = useState(hotel.hotelNIF || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Novo estado para controlar se estamos no modo de edição

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
                mpehotel,
                hotelName,
                hotelMiniTerms,
                hotelPhone,
                hotelEmail,
                hotelAddress,
                hotelPostalCode,
                hotelRNET,
                hotelNIF,
                passeIni,
                pdfFilePath
            });

            if (response.status === 200) {
                setIsEditing(false); // Desativa o modo de edição após salvar
                onClose(); // Fecha o modal
            }
        } catch (error) {
            console.error("Error updating property:", error);
            setError("Failed to update property. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(hotel.imageUrl); // Estado para armazenar a URL da imagem

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        // Limpa o estado de erro antes de verificar o tipo de arquivo
        setError(null);

        if (file) {
            // Verifica se o arquivo é um PNG
            if (file.type !== "image/png") {
                setError("Please upload a PNG image.");
                setSelectedImage(null); // Limpa a seleção se o tipo for inválido
                return;
            }
            setSelectedImage(file); // Atualiza o estado com a nova imagem
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            setError("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedImage); // Adiciona a nova imagem
        formData.append("hotelId", hotel.propertyID); // Passa o ID do hotel
        formData.append("existingImage", hotel.imageUrl); // Passa o caminho da imagem antiga

        try {
            setLoading(true);
            const response = await axios.post("/api/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setImageUrl(response.data.imageUrl); // Atualiza a URL da imagem
                setSelectedImage(null); // Limpa a seleção após o upload
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onOpenChange={onClose}
            className="z-50"
            size="2xl"
            hideCloseButton={true}
            backdrop="transparent"
        >
            <ModalContent>
                <ModalHeader className="flex flex-row justify-between items-center gap-1 p-2 px-4 bg-primary text-white">
                    {isEditing ? "Edit Property" : "View Property"} {/* Mudança do título com base no modo */}
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
                    <Tabs aria-label="Options" className="flex justify-center">
                        <Tab key="propertyDetails" title="Property Details">
                            <div className="-mt-4 flex flex-col gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">{"Property Name:"}</label>
                                    <input
                                        type="text"
                                        value={propertyName}
                                        onChange={(e) => setPropertyName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-400">{"Connection String:"}</label>
                                    <input
                                        type="text"
                                        value={propertyConnectionString}
                                        onChange={(e) => setPropertyConnectionString(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div> */}
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Property Tag:"}</label>
                                        <input
                                            type="text"
                                            value={propertyTag}
                                            onChange={(e) => setPropertyTag(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"MPE Hotel:"}</label>
                                        <input
                                            type="text"
                                            value={mpehotel}
                                            onChange={(e) => setmpehotel(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Property Server:"}</label>
                                        <input
                                            type="text"
                                            value={propertyServer}
                                            onChange={(e) => setPropertyServer(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Property Port:"}</label>
                                        <input
                                            type="text"
                                            value={propertyPort}
                                            onChange={(e) => setPropertyPort(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Passe Ini:"}</label>
                                        <input
                                            type="text"
                                            value={passeIni}
                                            onChange={(e) => setPasseIni(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"PDF File Path:"}</label>
                                        <input
                                            type="text"
                                            value={pdfFilePath}
                                            onChange={(e) => setPdfFilePath(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">{"Hotel Image:"}</label>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            accept="image/png" // Aceita apenas arquivos PNG
                                            onChange={handleImageChange}
                                            className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary file:text-white
                                            hover:file:bg-primary-dark"
                                        />
                                        {selectedImage && (
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-gray-700">Selected: {selectedImage.name}</p>
                                                <Button
                                                    color="primary"
                                                    onClick={handleImageUpload}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Uploading..." : "Upload"}
                                                </Button>
                                            </div>
                                        )}
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt="Current Hotel"
                                                className="mt-4 w-20 h-20 rounded shadow -mb-8"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab key="hotelDetails" title="Hotel Details">
                            <div className="-mt-4 flex flex-col gap-2 -ml-8 -mr-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">{"Hotel Name:"}</label>
                                    <input
                                        type="text"
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-2/3"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel Email:"}</label>
                                        <input
                                            type="text"
                                            value={hotelEmail}
                                            onChange={(e) => setHotelEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/3"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel Phone:"}</label>
                                        <input
                                            type="text"
                                            value={hotelPhone}
                                            onChange={(e) => setHotelPhone(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-2/3"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel Address:"}</label>
                                        <input
                                            type="text"
                                            value={hotelAddress}
                                            onChange={(e) => setHotelAddress(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/3"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel Postal-Code:"}</label>
                                        <input
                                            type="text"
                                            value={hotelPostalCode}
                                            onChange={(e) => setHotelPostalCode(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel RNET:"}</label>
                                        <input
                                            type="text"
                                            value={hotelRNET}
                                            onChange={(e) => setHotelRNET(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                        <label className="block text-sm font-medium text-gray-400">{"Hotel NIF:"}</label>
                                        <input
                                            type="text"
                                            value={hotelNIF}
                                            onChange={(e) => setHotelNIF(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400">{"Hotel Terms:"}</label>
                                    <textarea
                                        value={hotelMiniTerms}
                                        onChange={(e) => setHotelMiniTerms(e.target.value)}
                                        className="w-full h-32 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                            </div>
                        </Tab>
                    </Tabs>

                    {/* Exibição de erro */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <Button color="error" onClick={onClose}>
                            Cancel
                        </Button>
                        {isEditing ? (
                            <Button color="primary" onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        ) : (
                            <Button color="primary" onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
};

export default PropertiesEditForm;