"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";

import { FaCircle } from "react-icons/fa";
import { CiCircleCheck, CiWarning } from "react-icons/ci";
import { CiLock } from "react-icons/ci";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { IoMdExpand } from "react-icons/io";
import { FaRegHourglass } from "react-icons/fa6";

const translations = { en, pt, es };

const HousekeepingInfoForm = ({
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    hskStatus,
    roomStatus,
    priority,
    roomType,
    stayStatus,
    laundry,
    guestName,
    from,
    to,
    propertyID,
    room,
    isOpen,
    onClose,
    onCloseWithoutReload,
    onAddMaintenance,
    selectedReserva,
}) => {
    const [locale, setLocale] = useState("pt");
    const [editableRoomStatus, setEditableRoomStatus] = useState(roomStatus);

    useEffect(() => {
        if (isOpen) {
            setEditableRoomStatus(roomStatus);
            setIsEditing(false);
        }
    }, [isOpen, roomStatus]);

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"
    console.log("T LOCALE:", t);
    const [isEditing, setIsEditing] = useState(false);

    // const hskStatusLegend = {
    //     1: "Ocupado",
    //     2: "Livre"
    // }

    const hskStatusLegend = {
        1: {
            label: "Occupied",
            icon: <CiLock size={20} />,
        },
        2: {
            label: "Free",
            icon: <CiCircleCheck size={20} />,
        },
    };

    const roomStatusOptions = {
        1: "Limpo",
        2: "Sujo",
        3: "Fora de Serviço",
        4: "Pronto",
        5: "Usado",
        6: "Limpeza Em Execução",
        10: "Arrumar Quarto",
    };

    const estadoEstadiaConfig = {
        0: { label: "Chegada", icon: <GoArrowRight size={18} className="text-green-500" /> },
        1: { label: "Permanência", icon: <FaRegHourglass size={18} /> },
        2: { label: "Partida", icon: <GoArrowLeft size={18} className="text-red-500" />, },
        null: { label: "Vazio", icon: <IoMdExpand size={14} /> },
    };

    const handleSave = async () => {
        try {
            const payload = {
                internalRoom: room,
                propertyId: propertyID,
                roomStatus: editableRoomStatus
            };

            const response = await fetch("/api/reservations/housekeeping/updateRoomStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar o Room Status");
            }

            const data = await response.json();
            console.log("Atualizado com sucesso:", data);

            // Fechar modal ou atualizar UI
            setIsEditing(false);
            onClose();

        } catch (error) {
            console.error(error);
            alert("Não foi possível atualizar o Room Status.");
        }
    };

    const estadoLimpezaConfig = {
        1: { icon: <FaCircle size={20} color="green" />, title: "Limpo" },
        2: { icon: <FaCircle size={20} color="red" />, title: "Sujo" },
        3: { icon: <CiWarning size={20} />, title: "Fora de serviço" },
        4: { icon: <FaCircle size={20} color="blue" />, title: "Pronto" },
        5: { icon: <FaCircle size={20} color="orange" />, title: "Usado" },
        6: { icon: <FaCircle size={20} color="yellow" />, title: "Limpeza em execução" },
        10: { icon: <FaCircle size={20} color="gray" />, title: "Arrumar quarto" },
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
                    size="xl"
                    backdrop="Opaque"
                >
                    <ModalContent>
                        {(onClose) => (
                            <form>
                                <ModalHeader className="flex flex-row !justify-between items-center gap-1 bg-primary text-white p-2">
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
                                            <GoArrowLeft size={30} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-row justify-start gap-4 pl-4">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                    </div>
                                    <div className="flex flex-row items-center justify-end">
                                        <Button
                                            color="transparent"
                                            variant="light"
                                            className="text-white"
                                            onClick={() => {
                                                if (isEditing) {
                                                    handleSave(); // envia reservaId + propertyId + roomStatus
                                                } else {
                                                    setIsEditing(true); // habilita edição
                                                }
                                            }}
                                        >
                                            {isEditing ? "Guardar" : "Editar"}
                                        </Button>
                                    </div>
                                </ModalHeader>

                                <ModalBody className="flex flex-col p-5 bg-background min-h-[400px]">
                                    <div className="flex flex-row justify-between">
                                        {/* coluna1 */}
                                        <div className="flex flex-col gap-1 bg-gray-100 w-1/2 pr-2 p-2">
                                            <p>Hsk. Status</p>
                                            <p>Room Status</p>
                                            <p>Points</p>
                                            <p>Priority</p>
                                        </div>

                                        {/* coluna2 */}
                                        <div className="flex flex-col gap-1 w-1/2 pl-2 items-end p-2">
                                            <p className="text-right flex items-center justify-end gap-2">
                                                <span>{hskStatusLegend[hskStatus]?.label}</span>
                                                {hskStatusLegend[hskStatus]?.icon}
                                            </p>
                                            {isEditing ? (
                                                <select
                                                    value={editableRoomStatus}
                                                    onChange={(e) => setEditableRoomStatus(Number(e.target.value))}
                                                    className="border rounded px-2 py-1 text-sm w-full text-right"
                                                >
                                                    {Object.entries(roomStatusOptions).map(([value, label]) => (
                                                        <option key={value} value={value}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="text-right flex items-center justify-end gap-2">
                                                    <span>{roomStatusOptions[roomStatus]}</span>

                                                    {estadoLimpezaConfig[roomStatus] && (
                                                        <>
                                                            {estadoLimpezaConfig[roomStatus].icon}
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                            <p className="text-right">0</p>
                                            <p className="text-right">{priority}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row justify-between">
                                        {/* coluna1 */}
                                        <div className="flex flex-col gap-1 bg-gray-100 w-1/2 pr-2 p-2">
                                            <p>Room Type</p>
                                            <p>Stay Status</p>
                                            <p>CI/CO</p>
                                            <p>Laundry</p>
                                            <p>Guest</p>
                                            <p>From</p>
                                            <p>To</p>
                                        </div>

                                        {/* coluna2 */}
                                        <div className="flex flex-col gap-1 w-1/2 pl-2 items-end p-2">
                                            <p className="text-right">{roomType}</p>
                                            <p className="text-right flex items-center justify-end gap-2">
                                                <span>
                                                    {estadoEstadiaConfig[stayStatus ?? null]?.label}
                                                </span>
                                                {estadoEstadiaConfig[stayStatus ?? null]?.icon}
                                            </p>
                                            <p className="text-right">---</p>
                                            <p className="text-right">{laundry === 1 ? "Sim" : "Não"}</p>
                                            <p className="text-right">{guestName}</p>
                                            <p className="text-right">{from?.split("T")[0]}</p>
                                            <p className="text-right">{to?.split("T")[0]}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-primary text-white rounded-lg"
                                        onClick={() => {
                                            onCloseWithoutReload();
                                            onAddMaintenance(selectedReserva);
                                        }}
                                        >
                                            Add Maintenance
                                    </button>
                                </ModalBody>
                            </form>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default HousekeepingInfoForm;
