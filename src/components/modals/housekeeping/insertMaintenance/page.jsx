"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { CiImageOn } from "react-icons/ci";
import { useSession } from "next-auth/react";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const HousekeepingInsertMaintenanceForm = ({
    propertyID,
    formTypeModal,
    roomID,
    isOpen,
    onClose,
}) => {
    const [locale, setLocale] = useState("pt");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedReasonID, setSelectedReasonID] = useState("");
    const [selectedReasonText, setSelectedReasonText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentUser, setCurrentUser] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) setLocale(storedLanguage);
    }, []);

    useEffect(() => {
        if (session?.user) {
            setCurrentUser(session.user.firstName);
        }
    }, [session]);


    const t = translations[locale] || translations["pt"];
    console.log("RoomID:", roomID);

    const [roomsOptions, setRoomsOptions] = useState([]);
    const [reasonsOptions, setReasonsOptions] = useState([]);

    const fetchOptions = async (url, setOptions) => {
        if (!propertyID) return;
        try {
            const response = await axios.get(url);
            const options = response.data
                .map(d => ({ value: d.value, label: d.label }))
                .sort((a, b) => a.label.localeCompare(b.label));
            setOptions(options);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchOptions(`/api/reservations/housekeeping/getrooms?propertyID=${propertyID}`, setRoomsOptions);
        fetchOptions(`/api/reservations/housekeeping/getreasons?propertyID=${propertyID}`, setReasonsOptions);
    }, [propertyID]);

    const [imagePreview, setImagePreview] = useState(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file); // ⭐ agora guardamos o FILE original

            // opcional: preview em base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const [isOOS, setIsOOS] = useState(false);
    const [description, setDescription] = useState("");
    const [localText, setLocalText] = useState("");

    const handleSubmit = async () => {
        try {
            let imageRef = null;

            // 🔹 Upload da imagem
            if (selectedImage) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                formData.append("propertyID", propertyID);

                const uploadResponse = await axios.post(
                    "/api/upload-maintenance-image",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                if (uploadResponse.data.ref) {
                    imageRef = uploadResponse.data.ref;
                } else {
                    console.error("Erro ao enviar imagem:", uploadResponse.data.error);
                }
            }

            // 🔹 Criar manutenção
            const now = new Date();
            const payload = {
                propertyID,
                room: selectedRoom,
                reasonID: selectedReasonID,
                reasonText: selectedReasonText,
                isOOS,
                description,
                localText,
                image: imageRef,
                createdDate: now.toISOString().split("T")[0],
                createdTime: now.toTimeString().split(" ")[0],
                createdBy: currentUser,
            };

            await axios.post(
                "/api/reservations/housekeeping/insertMaintenance",
                payload
            );

            // SE estiver OOS → atualizar status do quarto
            if (isOOS) {
                await updateRoomStatus({
                    internalRoom: selectedRoom,
                    propertyId: propertyID,
                    roomStatus: 3,
                });
            }

            console.log("Manutenção criada com sucesso");
            setErrorMessage('Manutenção criada com sucesso');
            setIsErrorModalOpen(true);
            // Fechar modal / resetar estado
            onClose?.();

        } catch (error) {
            console.error("Erro ao submeter manutenção:", error);
            setErrorMessage('Erro ao criar manutenção.');
            setIsErrorModalOpen(true);
        }
    };

    const updateRoomStatus = async ({ internalRoom, propertyId, roomStatus }) => {
        try {
            await axios.post("/api/reservations/housekeeping/updateRoomStatus", {
                internalRoom,
                propertyId,
                roomStatus,
            });

            console.log("Room status atualizado com sucesso");
        } catch (error) {
            setErrorMessage("Erro ao atualizar status do quarto:", error);
            setIsErrorModalOpen(true);
            throw error; // importante para quem chama saber que falhou
        }
    };

    return (
        <>
            {isOpen && typeof window !== 'undefined' && createPortal(<div className="fixed inset-0 bg-black bg-opacity-50 z-40" />, document.body)}
            {formTypeModal === 11 && (
                <Modal
                    isOpen={isOpen}
                    hideCloseButton={true}
                    onOpenChange={onClose}
                    isDismissable={false}
                    isKeyboardDismissDisabled={true}
                    className="z-50"
                    size="lg"
                    backdrop="transparent"
                >
                    <ModalContent>
                        <form>
                            <ModalHeader className="flex flex-row justify-between items-center bg-primary text-white p-2">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <h2 className="text-lg font-semibold">{t.modals.housekeeping.maintenance.newWo}</h2>
                                        <Button
                                            type="button"
                                            color="transparent"
                                            variant="light"
                                            className="text-white"
                                            onClick={handleSubmit}
                                        >
                                            {t.modals.housekeeping.maintenance.create}
                                        </Button>
                                    </div>
                            </ModalHeader>

                            <ModalBody className="flex flex-col p-5 bg-background h-full overflow-hidden">
                                    <div className="flex flex-col max-h-[600px] overflow-y-auto gap-4 p-2">

                                        {/* GRID TOPO */}
                                        <div className="grid grid-cols-[35%_65%] w-full text-sm">
                                            {/* Room */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.room}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                <select
                                                    value={selectedRoom}
                                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">{t.modals.housekeeping.maintenance.selectRoom}</option>
                                                    {roomsOptions.map((roomOption) => (
                                                        <option key={roomOption.value} value={roomOption.value}>
                                                            {roomOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Reason */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.reason}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                <select
                                                    value={selectedReasonID}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        setSelectedReasonID(value);
                                                        const selected = reasonsOptions.find(r => r.value === value);
                                                        setSelectedReasonText(selected?.label || "");
                                                    }}
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                >
                                                    <option value="">{t.modals.housekeeping.maintenance.selectReason}</option>
                                                    {reasonsOptions.map((reasonOption) => (
                                                        <option key={reasonOption.value} value={reasonOption.value}>
                                                            {reasonOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Set OOS */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.setOOS}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                <input
                                                    type="checkbox"
                                                    className="accent-blue-500 w-4 h-4"
                                                    checked={isOOS}
                                                    onChange={(e) => setIsOOS(e.target.checked)}
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <p>{t.modals.housekeeping.maintenance.description}</p>
                                            <textarea
                                                className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>

                                        {/* Local Text */}
                                        <div>
                                            <p>{t.modals.housekeeping.maintenance.localText}</p>
                                            <textarea
                                                className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1"
                                                value={localText}
                                                onChange={(e) => setLocalText(e.target.value)}
                                            />
                                        </div>

                                        {/* Hidden Inputs */}
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />

                                        <input
                                            type="file"
                                            id="cameraUpload"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />

                                        {/* Image */}
                                        <div>
                                            <p>{t.modals.housekeeping.maintenance.image}</p>
                                            <div className="w-full h-12 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
                                                ) : (
                                                    <CiImageOn size={30} color="gray" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Botões */}
                                        <div className="flex justify-between gap-3">
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => document.getElementById('cameraUpload').click()}
                                            >
                                                {t.modals.housekeeping.maintenance.camera}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => document.getElementById('imageUpload').click()}
                                            >
                                                {t.modals.housekeeping.maintenance.uploadImage}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => setSelectedImage(null)}
                                            >
                                                {t.modals.housekeeping.maintenance.delImage}
                                            </button>
                                        </div>

                                    </div>
                            </ModalBody>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default HousekeepingInsertMaintenanceForm;
