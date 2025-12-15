"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import { useSession } from "next-auth/react";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const HousekeepingMaintenanceForm = ({
    modalHeader,
    editIcon,
    modalEditArrow,
    propertyID,
    modalEdit,
    formTypeModal,
    isOpen,
    onClose,
}) => {
    const [locale, setLocale] = useState("pt");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAdding, setIsAdding] = useState(false); // ← controla se está no modo "Adicionar"
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedReasonID, setSelectedReasonID] = useState("");
    const [selectedReasonText, setSelectedReasonText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const today = new Date().toISOString().split("T")[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [createdDate, setCreatedDate] = useState("");
    const [createdTime, setCreatedTime] = useState("");
    const [createdBy, setCreatedBy] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) setLocale(storedLanguage);
    }, []);

    useEffect(() => {
        if (session?.user) {
            setCreatedBy(session.user.firstName);
        }
    }, [session]);


    const t = translations[locale] || translations["pt"];

    const info = [
        {
            nrm_reserva: "12345",
            nrm_quarto: "204",
            roomstatus: "clean",
            status: "offen",
            priority: 0,
            tipologia: "Duplo Deluxe",
            problema: "Ar-condicionado não funciona",
            descproblema: "O ar-condicionado do quarto 204 não está funcionando corretamente.",
            data: "2025-11-12"
        },
        {
            nrm_reserva: "12345",
            nrm_quarto: "204",
            roomstatus: "clean",
            status: "offen",
            priority: 0,
            tipologia: "Duplo Deluxe",
            problema: "Ar-condicionado não funciona",
            descproblema: "O ar-condicionado do quarto 204 não está funcionando corretamente.",
            data: "2025-11-13"
        },
        {
            nrm_reserva: "12345",
            nrm_quarto: "204",
            roomstatus: "dirty",
            status: "offen",
            priority: 1,
            tipologia: "Duplo Deluxe",
            problema: "Lâmpada queimada no banheiro",
            descproblema: "A lâmpada do banheiro do quarto 204 está queimada e precisa ser substituída.",
            data: "2025-11-13"
        },
        {
            nrm_reserva: "12345",
            nrm_quarto: "204",
            roomstatus: "dirty",
            status: "offen",
            priority: 0,
            tipologia: "Duplo Deluxe",
            problema: "002 - Cofre não abre com o código",
            descproblema: "O cofre do quarto 204 não está abrindo com o código fornecido pelo hóspede.",
            data: "2025-11-13"
        }
    ];

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


    const filteredInfo = info.filter((item) => {
        const search = searchTerm.toLowerCase();
        const itemDate = item.data; // YYYY-MM-DD
        const inDateRange =
            (!startDate || itemDate >= startDate) &&
            (!endDate || itemDate <= endDate);

        const matchesSearch =
            item.nrm_reserva.toLowerCase().includes(search) ||
            item.nrm_quarto.toLowerCase().includes(search) ||
            item.tipologia.toLowerCase().includes(search) ||
            item.problema.toLowerCase().includes(search);

        return inDateRange && matchesSearch;
    });

    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Cria uma URL temporária para exibir a imagem
    //         const imageUrl = URL.createObjectURL(file);
    //         setSelectedImage(imageUrl);
    //     }
    // };

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


    const handleEditClick = (item) => {
        setSelectedItem(item); // define qual item será editado
        setIsEditing(true);    // muda para modo edição
    };

    const [isOOS, setIsOOS] = useState(false);
    const [description, setDescription] = useState("");
    const [localText, setLocalText] = useState("");

    const [existingImageUrl, setExistingImageUrl] = useState(null);


    const handleSubmit = async () => {
        try {
            let imageUrl = null;

            // ⚠️ Se existir imagem, fazemos upload para Cloudinary
            if (selectedImage) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                formData.append("propertyID", propertyID);
                formData.append("room", selectedRoom);
                formData.append("reasonID", selectedReasonID);

                if (existingImageUrl) {
                    formData.append("existingImage", existingImageUrl);
                }

                const uploadResponse = await fetch("/api/upload-maintenance-image", {
                    method: "POST",
                    body: formData,
                });

                const uploadResult = await uploadResponse.json();

                if (uploadResponse.ok) {
                    imageUrl = uploadResult.imageUrl;
                } else {
                    console.error("Erro ao enviar imagem:", uploadResult.error);
                }
            }

            // Gerar data e hora atuais
            const now = new Date();
            const createdDate = now.toISOString().split("T")[0];      // YYYY-MM-DD
            const createdTime = now.toTimeString().split(" ")[0];     // HH:mm:ss

            // Payload da manutenção
            const payload = {
                propertyID,
                room: selectedRoom,
                reasonID: selectedReasonID,
                reasonText: selectedReasonText,
                isOOS,
                description,
                localText,
                image: imageUrl,
                createdDate,
                createdTime,
                createdBy,
            };

            // Enviar para a API
            const response = await fetch(
                "/api/reservations/housekeeping/insertMaintenance",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            console.log("Resposta da API:", data);

        } catch (error) {
            console.error("Erro ao submeter manutenção:", error);
        }
    };


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
                    size="lg"
                    backdrop="dim"
                >
                    <ModalContent>
                        <form>
                            <ModalHeader className="flex flex-row justify-between items-center bg-primary text-white p-2">
                                {!isAdding && !isEditing ? (
                                    // 🔹 Header do modo principal
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <div className="flex flex-row items-center gap-3 pl-2">
                                            {editIcon}
                                            <h2 className="text-lg font-semibold">{modalHeader}</h2>
                                            {modalEditArrow} {modalEdit}
                                        </div>
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
                                ) : isAdding ? (
                                    // 🔹 Header do modo "Adicionar"
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <Button
                                            isIconOnly
                                            color="transparent"
                                            variant="light"
                                            onClick={() => setIsAdding(false)}
                                        >
                                            <MdKeyboardArrowLeft size={30} className="text-white" />
                                        </Button>
                                        <h2 className="text-lg font-semibold">New WO</h2>
                                        <Button
                                            type="button"
                                            color="transparent"
                                            variant="light"
                                            className="text-white"
                                            onClick={handleSubmit}
                                        >
                                            Create
                                        </Button>
                                    </div>
                                ) : isEditing ? (
                                    // 🔹 Header do modo "Adicionar"
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <Button
                                            isIconOnly
                                            color="transparent"
                                            variant="light"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            <MdKeyboardArrowLeft size={30} className="text-white" />
                                        </Button>
                                        <h2 className="text-lg font-semibold">WO {selectedItem.nrm_reserva}</h2>
                                        <Button
                                            type="button"
                                            color="transparent"
                                            variant="light"
                                            className="text-white"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                ) : null}
                            </ModalHeader>

                            <ModalBody className="flex flex-col p-5 bg-background min-h-[400px] max-h-[500px] overflow-hidden">
                                {!isAdding && !isEditing ? (
                                    // Lista de itens
                                    <>
                                        <div className="flex flex-row justify-between gap-4">
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            />
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            />
                                        </div>

                                        <div className="relative w-full mt-2">
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder={t.modals.housekeeping.maintenance.search}
                                                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded focus:border-black"
                                            />
                                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-2 rounded">
                                            {filteredInfo.length > 0 ? (
                                                filteredInfo.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="border border-gray-200 rounded-2xl shadow-sm bg-white p-4 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex flex-col gap-1 text-sm text-gray-700">
                                                            <p>{item.nrm_reserva}</p>
                                                            <p>{item.nrm_quarto} ({item.tipologia})</p>
                                                            <p>{item.problema}</p>
                                                            <p>{item.data}</p>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <CiViewList
                                                                size={20}
                                                                className="cursor-pointer"
                                                                onClick={() => handleEditClick(item)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center mt-4">
                                                    Nenhum resultado encontrado.
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-between gap-3 mt-4">
                                            <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
                                                {t.modals.housekeeping.maintenance.own}
                                            </button>
                                            <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
                                                {t.modals.housekeeping.maintenance.all}
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-primary text-white hover:opacity-90"
                                                onClick={() => setIsAdding(true)}
                                            >
                                                {t.modals.housekeeping.maintenance.add}
                                            </button>
                                        </div>
                                    </>
                                ) : isAdding ? (
                                    // Formulário Adicionar
                                    <div className="flex flex-col h-full justify-between gap-4">
                                        <div className="flex flex-row justify-between gap-6 items-start">
                                            <div className="flex flex-col text-gray-700 gap-2">
                                                <p>Room</p>
                                                <p>Reason</p>
                                                <p>Set OOS</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={selectedRoom}
                                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="">Select a room</option>
                                                    {roomsOptions.map((roomOption) => (
                                                        <option key={roomOption.value} value={roomOption.value}>
                                                            {roomOption.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select
                                                    value={selectedReasonID}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10); // converte para número
                                                        setSelectedReasonID(value);

                                                        const selected = reasonsOptions.find(r => r.value === value);
                                                        setSelectedReasonText(selected?.label || "");
                                                    }}
                                                    className="border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="">Select a reason</option>
                                                    {reasonsOptions.map((reasonOption) => (
                                                        <option key={reasonOption.value} value={reasonOption.value}>
                                                            {reasonOption.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input
                                                    type="checkbox"
                                                    id="oos"
                                                    className="accent-blue-500 w-4 h-4"
                                                    checked={isOOS}
                                                    onChange={(e) => setIsOOS(e.target.checked)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <p>Description</p>
                                            <textarea
                                                className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <p>Local Text</p>
                                            <textarea
                                                className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1"
                                                value={localText}
                                                onChange={(e) => setLocalText(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="imageUpload"
                                            onChange={handleImageUpload}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            id="cameraUpload"
                                            onChange={handleImageUpload}
                                        />

                                        <div>
                                            <p>Image</p>
                                            <div className="w-full h-12 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                                                {selectedImage ? (
                                                    <img src={selectedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                                ) : (
                                                    <CiImageOn size={30} color="gray" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => document.getElementById('cameraUpload').click()}
                                            >
                                                Camera
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => document.getElementById('imageUpload').click()}
                                            >
                                                Upload Image
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={() => setSelectedImage(null)}
                                            >
                                                Del. Image
                                            </button>
                                        </div>
                                    </div>
                                ) : isEditing && selectedItem ? (
                                    // Formulário Editar
                                    <div className="flex flex-col h-full justify-between gap-4 overflow-y-auto max-h-[450px] pr-2">
                                        <div className="flex flex-row justify-between gap-6 items-start">
                                            <div className="flex flex-col text-gray-700 gap-2">
                                                <p>Status</p>
                                                <p>Priority</p>
                                                <p>Room</p>
                                                <p>R. Status</p>
                                                <p>Reason</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p>{selectedItem.status}</p>
                                                <p>{selectedItem.priority}</p>
                                                <p>{selectedItem.nrm_quarto}</p>
                                                <p>{selectedItem.roomstatus}</p>
                                                <p>{selectedItem.problema}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p>Description</p>
                                            <textarea
                                                className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1 bg-gray-100"
                                                value={selectedItem.descproblema || ""}
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <p>Local Text</p>
                                            <textarea className="w-full h-16 resize-none rounded border border-gray-300 px-2 py-1"></textarea>
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="imageUpload"
                                            onChange={handleImageUpload}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            id="cameraUpload"
                                            onChange={handleImageUpload}
                                        />

                                        <div>
                                            <p>Image</p>
                                            <div className="w-full h-12 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
                                                ) : (
                                                    <CiImageOn size={30} color="gray" />
                                                )}
                                            </div>

                                            <div className="flex flex-row justify-between gap-6 items-start mt-4">
                                                <div className="flex flex-col text-gray-700 gap-2">
                                                    <p>Created</p>
                                                    <p>Created by</p>
                                                    <p>Updated</p>
                                                    <p>Updated by</p>
                                                </div>
                                                <div className="flex flex-col text-gray-700 gap-2">
                                                    <p>2025-11-12</p>
                                                    <p>Susana Martins</p>
                                                    <p></p>
                                                    <p></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                            >
                                                OOS
                                            </button>
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                            >
                                                Solve
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </ModalBody>
                        </form>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default HousekeepingMaintenanceForm;
