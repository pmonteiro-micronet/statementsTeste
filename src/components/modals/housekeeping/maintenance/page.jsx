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
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { AiOutlineExpand } from "react-icons/ai";

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
    roomID,
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
    const [currentUser, setCurrentUser] = useState("");

    const { data: session } = useSession();
    const [maintenances, setMaintenances] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    console.log(isLoading);
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

    useEffect(() => {
        const fetchMaintenances = async () => {
            try {
                setIsLoading(true);

                const response = await axios.post(
                    "/api/reservations/housekeeping/getMaintenances",
                    { propertyID }
                );

                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    console.log("Housekeeping:", response.data);
                    setMaintenances(response.data);
                } else {
                    setMaintenances([]);
                    console.warn("Nenhum dado encontrado ou dados inválidos para o propertyID:", propertyID);
                }
            } catch (error) {
                console.error(
                    "Erro ao buscar manutenções:",
                    error.response?.data || error.message
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (propertyID) {
            fetchMaintenances();
        }
    }, [propertyID]);

    const estadoLimpezaConfig = {
        1: { icon: <FaCircle size={20} color="green" />, title: "Limpo" },
        2: { icon: <FaCircle size={20} color="red" />, title: "Sujo" },
        3: { icon: <CiWarning size={20} />, title: "Fora de serviço" },
        4: { icon: <FaCircle size={20} color="blue" />, title: "Pronto" },
        5: { icon: <FaCircle size={20} color="orange" />, title: "Usado" },
        6: { icon: <FaCircle size={20} color="yellow" />, title: "Limpeza em execução" },
        10: { icon: <FaCircle size={20} color="gray" />, title: "Arrumar quarto" },
    };

    const mappedMaintenances = maintenances
        .filter(item => item._del === 0) // 🔹 só os não deletados
        .map((item) => ({
            refnr: item.refnr?.toString() || "",
            nrm_quarto: item.ziname || "",
            IDQuartoInterno: item.IDQuartoInterno || "",
            tipologia: item.kat || "",
            problema: item.text || "",
            descproblema: item.ztext || "",
            localText: item.textlokal || "",
            data: item.edate?.split("T")[0], // YYYY-MM-DD
            priority: item.prio || 0,
            status: item.status,
            roomstatus: estadoLimpezaConfig[item.status]?.title || "",
            image: item.dokument || null,
            createdBy: item.euser || "",
            createdAt: item.edate?.split("T")[0] || "",
            updatedBy: item.suser && item.suser !== "n" ? item.suser : "",
            updatedAt: item.sdate && item.sdate.split("T")[0] !== "1900-01-01" ? item.sdate.split("T")[0] : "",
        }));

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

    const [filterType, setFilterType] = useState("all"); // "all" | "own"

    const filteredInfo = mappedMaintenances.filter((item) => {
        const search = searchTerm.toLowerCase();
        const itemDate = item.data;

        const inDateRange =
            (!startDate || itemDate >= startDate) &&
            (!endDate || itemDate <= endDate);

        const matchesSearch =
            item.refnr.toLowerCase().includes(search) ||
            item.nrm_quarto.toLowerCase().includes(search) ||
            item.tipologia.toLowerCase().includes(search) ||
            item.problema.toLowerCase().includes(search);

        const matchesRoom =
            filterType === "all" || item.nrm_quarto === roomID;

        return inDateRange && matchesSearch && matchesRoom;
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

            // Fechar modal / resetar estado
            onClose?.();

        } catch (error) {
            console.error("Erro ao submeter manutenção:", error);
            alert("Erro ao criar manutenção.");
        }
    };

    const handleOOS = async () => {
        if (!selectedItem?.IDQuartoInterno) return;

        try {
            await updateRoomStatus({
                internalRoom: selectedItem.IDQuartoInterno,
                propertyId: propertyID,
                roomStatus: 3,
            });

            console.log("Quarto marcado como OOS");
        } catch {
            alert("Erro ao colocar o quarto como OOS");
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
            console.error("Erro ao atualizar status do quarto:", error);
            throw error; // importante para quem chama saber que falhou
        }
    };

    const [imagePreviewEdit, setImagePreviewEdit] = useState(null);


    // Função para buscar Base64 pelo ref
    const fetchImageByRef = async (ref) => {
        try {
            if (!ref) return;

            const response = await axios.get(`/api/upload-maintenance-image?ref=${ref}`);
            if (response.data?.image) {
                setImagePreviewEdit(response.data.image);
            } else {
                setImagePreviewEdit(null); // não encontrou imagem
            }
        } catch (error) {
            console.error("Erro ao buscar imagem:", error);
            setImagePreviewEdit(null);
        }
    };

    // Disparar quando selectedItem mudar
    useEffect(() => {
        if (selectedItem?.image) {
            fetchImageByRef(selectedItem.image); // selectedItem.image = ref
        } else {
            setImagePreviewEdit(null);
        }
    }, [selectedItem]);


    const [isEditMode, setIsEditMode] = useState(false);

    const [editDescription, setEditDescription] = useState("");
    const [editLocalText, setEditLocalText] = useState("");

    useEffect(() => {
        if (selectedItem) {
            setEditDescription(selectedItem.descproblema || "");
            setEditLocalText(selectedItem.localText || "");
            setIsEditMode(false); // começa em modo leitura
        }
    }, [selectedItem]);

    const handleSaveEdit = async (solve = false) => {
        try {
            const now = new Date();

            const payload = {
                propertyID,
                refnr: selectedItem.refnr,
                internalRoom: selectedItem.IDQuartoInterno,
                description: editDescription,
                localText: editLocalText,

                // 🔹 Só entra quando Solve = true
                ...(solve && {
                    solved: 1,
                    sdate: now.toISOString().split("T")[0],
                    stime: now.toTimeString().split(" ")[0],
                    suser: currentUser,
                }),
            };

            await axios.post(
                "/api/reservations/housekeeping/updateMaintenance",
                payload
            );

            // 🔹 Atualizar UI local
            setSelectedItem(prev => ({
                ...prev,
                descproblema: editDescription,
                localText: editLocalText,
                ...(solve && { solved: 1 }),
            }));

            setIsEditMode(false);

        } catch (error) {
            console.error("Erro ao salvar edição:", error);
            alert("Erro ao salvar alterações");
        }
    };

    const handleDeleteMaintenance = async () => {
        try {
            if (!selectedItem?.refnr || !selectedItem?.IDQuartoInterno) return;

            if (!window.confirm("Deseja realmente apagar esta manutenção?")) return;

            await axios.post("/api/reservations/housekeeping/deleteMaintenance", {
                propertyID,
                refnr: selectedItem.refnr,
                internalRoom: selectedItem.IDQuartoInterno,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Manutenção apagada com sucesso");

            // 🔹 Refresh na página inteira
            window.location.reload();

        } catch (error) {
            console.error("Erro ao apagar manutenção:", error);
            alert("Erro ao apagar manutenção");
        }
    };

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
                                        <h2 className="text-lg font-semibold">{t.modals.housekeeping.maintenance.wo} {selectedItem.refnr}</h2>
                                        <Button
                                            type="button"
                                            color="transparent"
                                            variant="light"
                                            className="text-white"
                                            onClick={() => {
                                                if (isEditMode) {
                                                    handleSaveEdit(); // 👈 salvar
                                                } else {
                                                    setIsEditMode(true); // 👈 ativar edição
                                                }
                                            }}
                                        >
                                            {isEditMode ? "Save" : "Edit"}
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
                                                        <div className="flex flex-col text-sm text-gray-700">
                                                            <p>{item.refnr}</p>
                                                            <p>{item.nrm_quarto} ({item.tipologia})</p>
                                                            <p>{item.problema}</p>
                                                            <p>{item.data}</p>
                                                            <p>{item.descproblema}</p>
                                                        </div>
                                                        <div className="w-full h-px bg-gray-300 mt-1 mb-1"></div>

                                                        <div className="flex justify-between">
                                                            <div className="flex">
                                                                <MdOutlinePhotoLibrary
                                                                    size={20}
                                                                    color="gray"
                                                                    className="cursor-pointer"
                                                                />
                                                            </div>

                                                            <div className="flex">
                                                                <CiViewList
                                                                    size={20}
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleEditClick(item)}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center mt-4">
                                                    {t.modals.housekeeping.maintenance.noResults}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-between gap-3 mt-4">
                                            <button
                                                type="button"
                                                className={`px-4 py-2 rounded ${filterType === "own"
                                                    ? "bg-gray-300"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                onClick={() => setFilterType("own")}
                                            >
                                                {t.modals.housekeeping.maintenance.own}
                                            </button>

                                            <button
                                                type="button"
                                                className={`px-4 py-2 rounded ${filterType === "all"
                                                    ? "bg-gray-300"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                    }`}
                                                onClick={() => setFilterType("all")}
                                            >
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

                                ) : isEditing && selectedItem ? (
                                    // Formulário Editar
                                    <div className="flex flex-col h-full justify-between gap-4 overflow-y-auto max-h-[450px] pr-2">
                                        <div className="grid grid-cols-[35%_65%] w-full text-sm">
                                            {/* Linha 1 */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.status}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                {selectedItem.status}
                                            </div>

                                            {/* Linha 2 */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.priority}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                {selectedItem.priority}
                                            </div>

                                            {/* Linha 3 */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.room}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                {selectedItem.nrm_quarto}
                                            </div>

                                            {/* Linha 4 */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2 border-b border-gray-200">
                                                {t.modals.housekeeping.maintenance.roomStatus}
                                            </div>
                                            <div className="px-3 py-2 border-b border-gray-200 text-right">
                                                {selectedItem.roomstatus}
                                            </div>

                                            {/* Linha 5 */}
                                            <div className="bg-gray-100 text-gray-600 px-3 py-2">
                                                {t.modals.housekeeping.maintenance.reason}
                                            </div>
                                            <div className="px-3 py-2 text-right">
                                                {selectedItem.problema}
                                            </div>
                                        </div>
                                        <div>
                                            <p>{t.modals.housekeeping.maintenance.description}</p>
                                            <textarea
                                                className={`w-full h-16 resize-none rounded border px-2 py-1 
                                                    ${isEditMode ? "border-gray-300 bg-white" : "border-gray-300 bg-gray-100"}
                                                `}
                                                value={editDescription}
                                                readOnly={!isEditMode}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <p>{t.modals.housekeeping.maintenance.localText}</p>
                                            <textarea
                                                className={`w-full h-16 resize-none rounded border px-2 py-1 
                                                ${isEditMode ? "border-gray-300 bg-white" : "border-gray-100 bg-gray-100"}
                                            `}
                                                value={editLocalText}
                                                readOnly={!isEditMode}
                                                onChange={(e) => setEditLocalText(e.target.value)}
                                            />
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
                                            <div className="flex justify-between">
                                                <p>{t.modals.housekeeping.maintenance.image}</p>
                                                <p onClick={() => setIsImageModalOpen(true)}><AiOutlineExpand /></p>
                                            </div>
                                            <div className="w-full h-12 bg-gray-100 flex items-center justify-center rounded overflow-hidden cursor-pointer">
                                                {imagePreviewEdit ? (
                                                    <img
                                                        src={imagePreviewEdit}
                                                        alt="Uploaded"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <CiImageOn size={30} color="gray" />
                                                )}
                                            </div>
                                            {/* Modal da imagem */}
                                            {isImageModalOpen && (
                                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                                    <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md">
                                                        {/* Header */}
                                                        <div className="flex justify-between items-center px-4 py-2 h-12 bg-primary text-white rounded-t-lg">
                                                            <h3 className="text-sm font-semibold">{t.modals.housekeeping.maintenance.image}</h3>
                                                            <button
                                                                className="text-white text-lg font-bold"
                                                                onClick={() => setIsImageModalOpen(false)}
                                                            >
                                                                <IoMdClose size={20} />
                                                            </button>
                                                        </div>

                                                        {/* Body */}
                                                        <div className="p-4 flex items-center justify-center">
                                                            <img
                                                                src={imagePreviewEdit}
                                                                alt="Expanded"
                                                                className="max-w-full max-h-96 object-contain rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-row justify-between gap-6 items-start mt-4">
                                                <div className="flex flex-col text-gray-700 gap-2">
                                                    <p>{t.modals.housekeeping.maintenance.created}</p>
                                                    <p>{t.modals.housekeeping.maintenance.createdBy}</p>
                                                    <p>{t.modals.housekeeping.maintenance.solved}</p>
                                                    <p>{t.modals.housekeeping.maintenance.solvedBy}</p>
                                                </div>
                                                <div className="flex flex-col text-gray-700 gap-2">
                                                    <p>{selectedItem.createdAt}</p>
                                                    <p>{selectedItem.createdBy}</p>
                                                    <p>{selectedItem.updatedAt}</p>
                                                    <p>{selectedItem.updatedBy}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                                onClick={handleDeleteMaintenance}
                                            >
                                                {t.modals.housekeeping.maintenance.delete}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleOOS}
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                            >
                                                {t.modals.housekeeping.maintenance.oos}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(true)}
                                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                            >
                                                {t.modals.housekeeping.maintenance.solve}
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
