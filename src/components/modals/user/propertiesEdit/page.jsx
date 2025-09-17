"use client";
import React, { useState, useEffect } from "react";
import { useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import axios from "axios";

import { FaGripLines } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { MdKeyboardArrowLeft } from "react-icons/md";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";
import { useSession } from "next-auth/react";

const translations = { en, pt, es };

const PropertiesEditForm = ({ hotel, hotelTerms, roomCloud, onClose }) => {
    const [propertyName, setPropertyName] = useState(hotel.propertyName || "");
    const [propertyTag, setPropertyTag] = useState(hotel.propertyTag || "");
    const [propertyServer, setPropertyServer] = useState(hotel.propertyServer || "");
    const [propertyPort, setPropertyPort] = useState(hotel.propertyPort || "");
    const [propertyPortStay, setPropertyPortStay] = useState(hotel.propertyPortStay || "");
    const [mpehotel, setmpehotel] = useState(hotel.mpehotel || "");
    const [pdfFilePath, setPdfFilePath] = useState(hotel.pdfFilePath || "");
    const [passeIni, setPasseIni] = useState(hotel.passeIni || "");

    const [hotelName, setHotelName] = useState(hotel.hotelName || "");
    const [hotelTermsEN, setHotelTermsEN] = useState(hotel.hotelTermsEN || "");
    const [hotelTermsPT, setHotelTermsPT] = useState(hotel.hotelTermsPT || "");
    const [hotelTermsES, setHotelTermsES] = useState(hotel.hotelTermsES || "");
    const [hotelPhone, setHotelPhone] = useState(hotel.hotelPhone || "");
    const [hotelEmail, setHotelEmail] = useState(hotel.hotelEmail || "");
    const [hotelAddress, setHotelAddress] = useState(hotel.hotelAddress || "");
    const [hotelPostalCode, setHotelPostalCode] = useState(hotel.hotelPostalCode || "");
    const [hotelRNET, setHotelRNET] = useState(hotel.hotelRNET || "");
    const [hotelNIF, setHotelNIF] = useState(hotel.hotelNIF || "");
    const [hasStay, setHasStay] = useState(hotel.hasStay || "");
    console.log(setHasStay);
    const [replyEmail, setReplyEmail] = useState(hotel.replyEmail || "");
    const [replyPassword, setReplyPassword] = useState(hotel.replyPassword || "");
    const [sendingServer, setSendingServer] = useState(hotel.sendingServer || "");
    const [sendingPort, setSendingPort] = useState(hotel.sendingPort || "");
    const [emailSubject, setEmailSubject] = useState(hotel.emailSubject || "");
    const [emailBody, setEmailBody] = useState(hotel.emailBody || "");
    const [infoEmail, setInfoEmail] = useState(hotel.infoEmail || "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Novo estado para controlar se estamos no modo de edição

    const [locale, setLocale] = useState("pt");

    const [activeContent, setActiveContent] = useState("terms");
    const [activeKey, setActiveKey] = useState("EN");


    const [privacyPolicyEN, setPrivacyPolicyEN] = useState(hotelTerms[0]?.privacyPolicyEN || "");
    const [privacyPolicyPT, setPrivacyPolicyPT] = useState(hotelTerms[0]?.privacyPolicyPT || "");
    const [privacyPolicyES, setPrivacyPolicyES] = useState(hotelTerms[0]?.privacyPolicyES || "");

    const [miniTermsEN, setMiniTermsEN] = useState(hotelTerms[0]?.miniTermsEN || "");
    const [miniTermsPT, setMiniTermsPT] = useState(hotelTerms[0]?.miniTermsPT || "");
    const [miniTermsES, setMiniTermsES] = useState(hotelTerms[0]?.miniTermsES || "");

    const [hasRoomCloud, setHasRoomCloud] = useState(hotel.hasRoomCloud || false);
    const [roomCloudUsername, setRoomCloudUsername] = useState(roomCloud[0]?.username || "");
    const [roomCloudPassword, setRoomCloudPassword] = useState(roomCloud[0]?.password || "");
    const [roomCloudHotelID, setRoomCloudHotelID] = useState(roomCloud[0]?.hotelID || "");

    const [showVariablesbar, setShowVariablesbar] = useState(false);
    const [hoveredVar, setHoveredVar] = useState(null);

    const [showTemplatesModal, setShowTemplatesModal] = useState(false);
    const [smallTab, setSmallTab] = useState("details"); // ou "reviews" como valor inicial

    const { data: session } = useSession();

    const [roomCloudUser, setRoomCloudUser] = useState(false);
    const [stayUser, setStayUser] = useState(false);



    useEffect(() => {
        const checkRoomCloudAssociation = async () => {
            if (!session?.user?.id || !hotel?.propertyID) return;

            const userId = session.user.id;
            const propertyID = hotel.propertyID;

            try {
                const response = await axios.get("/api/properties/roomCloudPropUsers");

                const associations = Array.isArray(response.data.response)
                    ? response.data.response
                    : [];

                // Verifica se existe uma associação que bate com userId e propertyID
                const hasAssociation = associations.some(
                    (assoc) =>
                        assoc.userID === userId && assoc.propertyID === propertyID
                );

                setRoomCloudUser(hasAssociation);
                console.log("roomCloudUser:", hasAssociation);
            } catch (error) {
                console.error("Erro ao buscar associações:", error);
            }
        };

        checkRoomCloudAssociation();
    }, [session]);

    useEffect(() => {
        const checkStayAssociation = async () => {
            if (!session?.user?.id || !hotel?.propertyID) return;

            const userId = session.user.id;
            const propertyID = hotel.propertyID;

            try {
                const response = await axios.get("/api/properties/stayPropUsers");

                const associations = Array.isArray(response.data.response)
                    ? response.data.response
                    : [];

                // Verifica se existe uma associação que bate com userId e propertyID
                const hasAssociation = associations.some(
                    (assoc) =>
                        assoc.userID === userId && assoc.propertyID === propertyID
                );

                setStayUser(hasAssociation);
                console.log("roomCloudUser:", hasAssociation);
            } catch (error) {
                console.error("Erro ao buscar associações:", error);
            }
        };

        checkStayAssociation();
    }, [session]);

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"

    const handleSave = async () => {
        if (!propertyName || !propertyTag || !propertyServer) {
            setError("Please fill in all fields.");
            return;
        }

        const roomCloudValue = !!hasRoomCloud;

        try {
            setLoading(true);

            // Converta campos para inteiros, se necessário
            const formattedMpehotel = parseInt(mpehotel, 10);

            if (isNaN(formattedMpehotel)) {
                setError("mpehotel must be valid numbers.");
                setLoading(false);
                return;
            }

            // Envia a requisição PATCH
            const response = await axios.patch(`/api/properties/${hotel.propertyID}`, {
                propertyName,
                propertyTag,
                propertyServer,
                propertyPort,
                propertyPortStay,
                mpehotel: formattedMpehotel,
                hotelName,
                hotelTermsEN,
                hotelTermsPT,
                hotelTermsES,
                hotelPhone,
                hotelEmail,
                hotelAddress,
                hotelPostalCode,
                hotelRNET,
                hotelNIF,
                passeIni,
                pdfFilePath,
                replyEmail,
                replyPassword,
                sendingServer,
                sendingPort,
                emailSubject,
                emailBody,
                infoEmail,
                hasRoomCloud: roomCloudValue
            });

            // Se a propriedade foi atualizada com sucesso, salva os termos
            if (response.status === 200) {
                const roomCloudResponse = await axios.post(`/api/properties/roomCloud`, {
                    propertyID: hotel.propertyID,
                    roomCloudUsername,
                    roomCloudPassword,
                    roomCloudHotelID
                });

                if (![200, 201].includes(roomCloudResponse.status)) {
                    throw new Error(`Failed to save RoomCloud data. Status: ${roomCloudResponse.status}`);
                }

                const hotelTermsResponse = await axios.post(`/api/properties/hotelTerms`, {
                    propertyID: hotel.propertyID,
                    termsAndCondEN: hotelTermsEN,
                    termsAndCondPT: hotelTermsPT,
                    termsAndCondES: hotelTermsES,
                    privacyPolicyEN,
                    privacyPolicyPT,
                    privacyPolicyES,
                    miniTermsEN,
                    miniTermsPT,
                    miniTermsES
                });

                if (hotelTermsResponse.status === 200 || hotelTermsResponse.status === 201) {
                    //setIsEditing(false);
                    //onClose(); // Fecha o modal
                } else {
                    setError("Failed to save hotel terms.");
                }
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
        formData.append("file", selectedImage);
        formData.append("hotelId", hotel.propertyID);
        formData.append("existingImage", imageUrl); // Passa a URL da imagem antiga

        try {
            setLoading(true);
            const response = await axios.post("/api/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setImageUrl(response.data.imageUrl); // Atualiza a URL com a nova imagem no Cloudinary
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const [copiedVar, setCopiedVar] = useState(null);

    // Dentro do seu componente:
    const textareaRef = useRef(null);
    const subjectInputRef = useRef(null);

    const handleDoubleClick = () => {
        if (copiedVar && textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = emailBody;

            const newText =
                text.substring(0, start) + copiedVar + text.substring(end);

            setEmailBody(newText);

            // Atualiza o cursor após a inserção
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + copiedVar.length, start + copiedVar.length);
            }, 0);
        }
    };

    const handleDoubleClickSubject = () => {
        if (copiedVar && subjectInputRef.current) {
            const input = subjectInputRef.current;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const text = emailSubject;

            const newText = text.substring(0, start) + copiedVar + text.substring(end);

            setEmailSubject(newText);

            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + copiedVar.length, start + copiedVar.length);
            }, 0);
        }
    };

    const copyToClipboard = (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedVar(text);
                setTimeout(() => setCopiedVar(null), 2000);
            });
        } else {
            // fallback antigo para navegadores mais antigos
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                console.log(`Copiado: ${text}`);
            } catch {
                console.log('Erro ao copiar para área de transferência');
            }
            document.body.removeChild(textarea);
        }
    };

    const guestDetails = [
        { key: '{{protelGuestFirstName}}', desc: t.modals.propertiesEdit.stay.guestDetails.Name },
        { key: '{{protelGuestLastName}}', desc: t.modals.propertiesEdit.stay.guestDetails.Surname },
        { key: '{{protelGuestMobilePhone}}', desc: t.modals.propertiesEdit.stay.guestDetails.Phone },
        { key: '{{email}}', desc: t.modals.propertiesEdit.stay.guestDetails.Email },
    ];

    const reservationDetails = [
        { key: '{{protelRoomID}}', desc: t.modals.propertiesEdit.stay.reservationDetails.room },
        { key: '{{protelReservationID}}', desc: t.modals.propertiesEdit.stay.reservationDetails.reservationNumber },
        { key: '{{protelValidFrom}}', desc: t.modals.propertiesEdit.stay.reservationDetails.arrival },
        { key: '{{protelValidUntil}}', desc: t.modals.propertiesEdit.stay.reservationDetails.departure },
        { key: '{{adult}}', desc: t.modals.propertiesEdit.stay.reservationDetails.adults },
        { key: '{{child}}', desc: t.modals.propertiesEdit.stay.reservationDetails.childs },
        { key: '{{STAY_LINK}}', desc: t.modals.propertiesEdit.stay.reservationDetails.stayLink },
    ];

    const hotelDetails = [
        //{ key: '{{hotel_name}}', desc: t.modals.propertiesEdit.stay.hotelDetails.hotelName },
        { key: '{{hotel_email}}', desc: t.modals.propertiesEdit.stay.hotelDetails.hotelEmail },
        { key: '{{hotel_phone}}', desc: t.modals.propertiesEdit.stay.hotelDetails.hotelPhone },
    ];

    const [selectedBold, setSelectedBold] = React.useState(false);

    const handleBoldClick = () => {
        const textarea = textareaRef.current;
        if (!textarea || !isEditing) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = emailBody.slice(start, end);
        const before = emailBody.slice(0, start);
        const after = emailBody.slice(end);

        // Salva a posição do scroll antes da atualização
        const scrollPos = textarea.scrollTop;

        let newText;
        if (selectedText.startsWith("**") && selectedText.endsWith("**")) {
            // Remove os **
            const unbolded = selectedText.slice(2, -2);
            newText = before + unbolded + after;
            setSelectedBold(false);
        } else {
            // Adiciona os **
            const bolded = `**${selectedText || ' '}**`;
            newText = before + bolded + after;
            setSelectedBold(true);
        }

        setEmailBody(newText);

        // Restaurar foco, seleção e scroll após o texto atualizar
        setTimeout(() => {
            textarea.focus();

            if (selectedText.startsWith("**") && selectedText.endsWith("**")) {
                // Ajusta a seleção para o texto sem os **
                textarea.setSelectionRange(start, end - 4);
            } else {
                // Ajusta a seleção para o texto com os **
                textarea.setSelectionRange(start + 2, end + 2);
            }

            textarea.scrollTop = scrollPos; // restaura scroll

        }, 0);
    };

    // Atualiza o estado do botão toda vez que a seleção mudar
    const handleSelectionChange = () => {
        const textarea = textareaRef.current;
        if (!textarea || !isEditing) {
            setSelectedBold(false);
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = emailBody.slice(start, end);

        const isBold = selectedText.startsWith("**") && selectedText.endsWith("**");
        setSelectedBold(isBold);
    };

    const [templates, setTemplates] = useState([]);

    // Função que busca os templates da API
    const fetchTemplates = async () => {
        try {
            const response = await axios.get('/api/stay/templates'); // ajusta a URL da API conforme seu backend
            if (response.data && response.data.response) {
                setTemplates(response.data.response);
            } else {
                setTemplates([]);
            }
        } catch (error) {
            console.error('Erro ao carregar templates:', error);
            setTemplates([]);
        }
    };

    // Quando o modal abrir, faz a requisição
    useEffect(() => {
        if (showTemplatesModal) {
            fetchTemplates();
        }
    }, [showTemplatesModal]);

    const handleSelectTemplate = (template) => {
        setEmailSubject(template.emailSubject);
        setEmailBody(template.emailBody);
        setShowTemplatesModal(false); // fecha modal após seleção
    };

    const [activeSection, setActiveSection] = useState(null); // null = menu principal
    const [activeStayTab, setActiveStayTab] = useState("settings");

    const goBack = () => setActiveSection(null);
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
                    {isEditing ? t.modals.propertiesEdit.editProperty : t.modals.propertiesEdit.viewProperty} {/* Mudança do título com base no modo */}
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
                    {/* ✅ Se não tem seção ativa, mostra as opções */}
                    {activeSection === null && (
                        <div className="flex flex-row gap-4 justify-center mt-4">
                            <div
                                className="cursor-pointer border border-gray-300 text-gray-600 p-2 rounded w-40 flex justify-center hover:bg-primary hover:text-white"
                                onClick={() => setActiveSection("propertyDetails")}
                            >
                                {t.modals.propertiesEdit.propertyDetails}
                            </div>

                            <div
                                className="cursor-pointer border border-gray-300 text-gray-600 p-2 rounded w-40 flex justify-center hover:bg-primary hover:text-white"
                                onClick={() => setActiveSection("hotelDetails")}
                            >
                                {t.modals.createProperty.hotelDetails}
                            </div>
                            {stayUser && hasStay && (
                                <div
                                    className="cursor-pointer border border-gray-300 text-gray-600 p-2 rounded w-40 flex justify-center hover:bg-primary hover:text-white"
                                    onClick={() => setActiveSection("stay")}
                                >
                                    Stay
                                </div>
                            )}

                            {roomCloudUser && hasRoomCloud && (
                                <div
                                    className="cursor-pointer border border-gray-300 text-gray-600 p-2 rounded w-40 flex justify-center hover:bg-primary hover:text-white"
                                    onClick={() => setActiveSection("ota")}
                                >
                                    OTA
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === "propertyDetails" && (
                        <div className="flex flex-col gap-2 p-4">
                            {/* Botão voltar */}
                            <button onClick={goBack} className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <MdKeyboardArrowLeft size={18} />
                            </button>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.propertyName}</label>
                                <input
                                    type="text"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                    disabled={!isEditing} // Desabilita o campo quando não está em edição
                                />
                            </div>
                            <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.propertyTag}</label>
                                    <input
                                        type="text"
                                        value={propertyTag}
                                        onChange={(e) => setPropertyTag(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                                <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.mpeHotel}</label>
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
                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.propertyServer}</label>
                                    <input
                                        type="text"
                                        value={propertyServer}
                                        onChange={(e) => setPropertyServer(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                                <div className="flex flex-row w-1/2 gap-4"> {/* Cada campo ocupa metade do espaço */}
                                    <div className="flex flex-col w-1/2">
                                        <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.extensionsPort}</label>
                                        <input
                                            type="text"
                                            value={propertyPort}
                                            onChange={(e) => setPropertyPort(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.stayPort}</label>
                                        <input
                                            type="text"
                                            value={propertyPortStay}
                                            onChange={(e) => setPropertyPortStay(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-row w-full gap-4"> {/* Usa flex-row para exibir os itens lado a lado */}
                                <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.iniPath}</label>
                                    <input
                                        type="text"
                                        value={passeIni}
                                        onChange={(e) => setPasseIni(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                    />
                                </div>
                                <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.pdfFile}</label>
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
                                <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelImage} <p><b>(.PNG 280x160)</b></p></label>
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
                                            <p className="text-sm text-gray-700">{t.modals.propertiesEdit.selected} {selectedImage.name}</p>
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
                    )}

                    {activeSection === "hotelDetails" && (
                        <div className="flex flex-col gap-2 p-4">
                            {/* Botão voltar */}
                            <button onClick={goBack} className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <MdKeyboardArrowLeft size={18} />
                            </button>

                            <div className="-mt-4">
                                <div className="flex space-x-2 text-sm justify-center">
                                    <button
                                        onClick={() => setSmallTab("details")}
                                        className={`px-3 py-1 rounded-md border ${smallTab === "details" ? "bg-gray-200 font-medium" : "bg-white text-gray-500"
                                            }`}
                                    >
                                        Info
                                    </button>
                                    <button
                                        onClick={() => setSmallTab("terms")}
                                        className={`px-3 py-1 rounded-md border ${smallTab === "terms" ? "bg-gray-200 font-medium" : "bg-white text-gray-500"
                                            }`}
                                    >
                                        Terms
                                    </button>
                                </div>

                                <div className="">
                                    {smallTab === "details" &&
                                        <div className="mt-4 flex flex-col gap-2 -ml-8 -mr-8">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelName}</label>
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
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelEmail}</label>
                                                    <input
                                                        type="text"
                                                        value={hotelEmail}
                                                        onChange={(e) => setHotelEmail(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                                    />
                                                </div>
                                                <div className="flex flex-col w-1/3"> {/* Cada campo ocupa metade do espaço */}
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelPhone}</label>
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
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelAddress}</label>
                                                    <input
                                                        type="text"
                                                        value={hotelAddress}
                                                        onChange={(e) => setHotelAddress(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                                    />
                                                </div>
                                                <div className="flex flex-col w-1/3"> {/* Cada campo ocupa metade do espaço */}
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelPCode}</label>
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
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelRNET}</label>
                                                    <input
                                                        type="text"
                                                        value={hotelRNET}
                                                        onChange={(e) => setHotelRNET(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                                    />
                                                </div>
                                                <div className="flex flex-col w-1/2"> {/* Cada campo ocupa metade do espaço */}
                                                    <label className="block text-sm font-medium text-gray-400">{t.modals.propertiesEdit.hotelNIF}</label>
                                                    <input
                                                        type="text"
                                                        value={hotelNIF}
                                                        onChange={(e) => setHotelNIF(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                        disabled={!isEditing} // Desabilita o campo quando não está em edição
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {smallTab === "terms" &&
                                        <div className=" flex flex-col gap-2 -ml-8 -mr-8">
                                            <div>
                                                {/* Tabs: Hotel Terms vs Privacy Policy (como label) */}
                                                <div className="flex flex-row bg-gray-100 w-full rounded-xl items-center mb-4 mt-4">
                                                    <div
                                                        onClick={() => setActiveContent("terms")}
                                                        className={`cursor-pointer px-4 py-2 ${activeContent === "terms"
                                                            ? "bg-white text-black rounded-t-md border border-b-0 border-gray-300"
                                                            : "text-gray-500 text-sm"
                                                            }`}
                                                    >
                                                        {t.modals.propertiesEdit.hotelTerms}
                                                    </div>
                                                    <div
                                                        onClick={() => setActiveContent("privacy")}
                                                        className={`cursor-pointer px-4 py-2 ${activeContent === "privacy"
                                                            ? "bg-white text-black rounded-t-md border border-b-0 border-gray-300"
                                                            : "text-gray-500 text-sm"
                                                            }`}
                                                    >
                                                        {t.modals.createProperty.privacyPolicy}
                                                    </div>
                                                    <div
                                                        onClick={() => setActiveContent("miniTerms")}
                                                        className={`cursor-pointer px-4 py-2 ${activeContent === "miniTerms"
                                                            ? "bg-white text-black rounded-t-md border border-b-0 border-gray-300"
                                                            : "text-gray-500 text-sm"
                                                            }`}
                                                    >
                                                        {t.modals.createProperty.miniTerms}
                                                    </div>
                                                </div>

                                                {/* Language Tabs */}
                                                <div className="flex flex-row justify-center bg-gray-100 w-32 h-8 rounded-xl items-center mb-4">
                                                    {["EN", "PT", "ES"].map((lang) => (
                                                        <div
                                                            key={lang}
                                                            onClick={() => setActiveKey(lang)}
                                                            className={`cursor-pointer p-1 ${activeKey === lang
                                                                ? "bg-white text-black rounded-lg m-1 text-sm border border-gray-200"
                                                                : "text-gray-500 m-1 text-sm"
                                                                }`}
                                                        >
                                                            {lang}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Textarea content */}
                                                <div>
                                                    {activeContent === "terms" && (
                                                        <>
                                                            {activeKey === "EN" && (
                                                                <div>
                                                                    <textarea
                                                                        value={hotelTermsEN}
                                                                        onChange={(e) => setHotelTermsEN(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {hotelTermsEN.length} / 2000
                                                                    </div>
                                                                </div>

                                                            )}
                                                            {activeKey === "PT" && (
                                                                <div>
                                                                    <textarea
                                                                        value={hotelTermsPT}
                                                                        onChange={(e) => setHotelTermsPT(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {hotelTermsPT.length} / 2000
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {activeKey === "ES" && (
                                                                <div>
                                                                    <textarea
                                                                        value={hotelTermsES}
                                                                        onChange={(e) => setHotelTermsES(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {hotelTermsES.length} / 2000
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {activeContent === "privacy" && (
                                                        <>
                                                            {activeKey === "EN" && (
                                                                <div>
                                                                    <textarea
                                                                        value={privacyPolicyEN}
                                                                        onChange={(e) => setPrivacyPolicyEN(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {privacyPolicyEN.length} / 2000
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {activeKey === "PT" && (
                                                                <div>
                                                                    <textarea
                                                                        value={privacyPolicyPT}
                                                                        onChange={(e) => setPrivacyPolicyPT(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {privacyPolicyPT.length} / 2000
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {activeKey === "ES" && (
                                                                <div>
                                                                    <textarea
                                                                        value={privacyPolicyES}
                                                                        onChange={(e) => setPrivacyPolicyES(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={2000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {privacyPolicyES.length} / 2000
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    {activeContent === "miniTerms" && (
                                                        <>
                                                            {activeKey === "EN" && (
                                                                <div>
                                                                    <textarea
                                                                        value={miniTermsEN}
                                                                        onChange={(e) => setMiniTermsEN(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={1000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {miniTermsEN.length} / 1000
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {activeKey === "PT" && (
                                                                <div>
                                                                    <textarea
                                                                        value={miniTermsPT}
                                                                        onChange={(e) => setMiniTermsPT(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={1000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {miniTermsPT.length} / 1000
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {activeKey === "ES" && (
                                                                <div>
                                                                    <textarea
                                                                        value={miniTermsES}
                                                                        onChange={(e) => setMiniTermsES(e.target.value)}
                                                                        className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                        maxLength={1000}
                                                                        disabled={!isEditing}
                                                                    />
                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                        {miniTermsES.length} / 1000
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "stay" && (
                        <div className="flex flex-col gap-2 p-4">
                            {/* Botão voltar */}
                            <button onClick={goBack} className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <MdKeyboardArrowLeft size={18} />
                            </button>
                            <div className="flex justify-center mb-4 text-sm gap-2 -mt-4">
                                <button
                                    className={`px-3 py-1 rounded-md border ${activeStayTab === "settings" ? "bg-gray-200 font-medium" : "bg-white text-gray-500"}`}
                                    onClick={() => setActiveStayTab("settings")}
                                >
                                    Settings
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md border  ${activeStayTab === "email" ? "bg-gray-200 font-medium" : "bg-white text-gray-500"}`}
                                    onClick={() => setActiveStayTab("email")}
                                >
                                    Email Settings
                                </button>
                            </div>
                            {activeStayTab === "settings" && (
                                <div>
                                    <p className="bg-gray-200 p-1 mb-2">{t.modals.propertiesEdit.stay.sendSMTP}</p>
                                    <div className="flex flex-row gap-2 w-full">
                                        <div className="w-1/2 flex flex-col text-xs">
                                            <p>{t.modals.propertiesEdit.stay.email}</p>
                                            <input
                                                type="text"
                                                value={replyEmail}
                                                onChange={(e) => setReplyEmail(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                disabled={!isEditing} // Desabilita o campo quando não está em edição
                                            />
                                        </div>
                                        <div className="w-1/2 flex flex-col text-xs">
                                            <p>{t.modals.propertiesEdit.stay.emailPassword}</p>
                                            <input
                                                type="text"
                                                value={replyPassword}
                                                onChange={(e) => setReplyPassword(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                disabled={!isEditing} // Desabilita o campo quando não está em edição
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 w-full">
                                        <div className="w-1/2 flex flex-col text-xs">
                                            <p>{t.modals.propertiesEdit.stay.serverSMTP}</p>
                                            <input
                                                type="text"
                                                value={sendingServer}
                                                onChange={(e) => setSendingServer(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                disabled={!isEditing} // Desabilita o campo quando não está em edição
                                            />
                                        </div>
                                        <div className="w-1/2 flex flex-col text-xs">
                                            <p>{t.modals.propertiesEdit.stay.portSMTP}</p>
                                            <input
                                                type="text"
                                                value={sendingPort}
                                                onChange={(e) => setSendingPort(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                disabled={!isEditing} // Desabilita o campo quando não está em edição
                                            />
                                        </div>
                                    </div>
                                    <p className="bg-gray-200 p-1 mt-2 mb-2">{t.modals.propertiesEdit.stay.receiptShipment}</p>
                                    <div className="flex flex-col w-full text-xs">
                                        <p>{t.modals.propertiesEdit.stay.email}</p>
                                        <input
                                            type="text"
                                            value={infoEmail}
                                            onChange={(e) => setInfoEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing} // Desabilita o campo quando não está em edição
                                        />

                                    </div>
                                </div>
                            )}

                            {activeStayTab === "email" && (
                                <div>
                                    <p className="bg-gray-200 p-1 -mt-4 mb-2">{t.modals.propertiesEdit.stay.email}</p>
                                    <div className="w-1/2 flex flex-col text-xs">
                                        <p>{t.modals.propertiesEdit.stay.emailSubject}</p>
                                        <input
                                            ref={subjectInputRef}
                                            type="text"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            onDoubleClick={handleDoubleClickSubject}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    {/* Botão de Negrito */}
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            className={`px-2 py-1 rounded-md text-xs font-bold border ${selectedBold ? 'bg-[#FC9D25] text-white border-[#FC9D25]' : 'bg-transparent text-[#FC9D25] border-[#FC9D25]'
                                                }`}
                                            onClick={handleBoldClick}
                                        >
                                            B
                                        </button>
                                    </div>
                                    <div className="w-full flex flex-col text-xs mt-2 -mb-8">
                                        <div className="flex flex-row justify-between items-center mb-1 cursor-pointer">
                                            <div>
                                                <p>{t.modals.propertiesEdit.stay.emailBody}</p>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center hover:text-blue-600">
                                                <p onClick={() => setShowTemplatesModal(true)} className="cursor-pointer">Templates</p>
                                                <div
                                                    className="bg-[#FC9D25] p-1 rounded-lg"
                                                    onClick={() => setShowVariablesbar(!showVariablesbar)}
                                                >
                                                    <FaGripLines color="white" size={15} />
                                                </div>
                                            </div>
                                        </div>
                                        <textarea
                                            ref={textareaRef}
                                            onDoubleClick={handleDoubleClick}
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                            onSelect={handleSelectionChange}
                                            className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none resize-none"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    {showVariablesbar && (
                                        <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-4 z-50 flex flex-col">
                                            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                                                <h2 className="text-sm font-bold">{t.modals.propertiesEdit.stay.displayedElements}</h2>
                                                <button onClick={() => setShowVariablesbar(false)} className="text-gray-500 text-lg">&times;</button>
                                            </div>

                                            <div className="flex-shrink-0 font-bold flex justify-between border-b pb-1 mb-2 text-xs">
                                                <span>{t.modals.propertiesEdit.stay.variable}</span>
                                                <span>{t.modals.propertiesEdit.stay.description}</span>
                                            </div>

                                            <div className="flex-grow overflow-y-auto text-xs space-y-6">
                                                {/* Detalhes do hóspede */}
                                                <div>
                                                    <h3 className="font-semibold mb-2">{t.modals.propertiesEdit.stay.guestDetails.title}</h3>
                                                    <ul className="space-y-2">
                                                        {guestDetails.map(({ key, desc }) => (
                                                            <li key={key} className="flex justify-between">
                                                                <span
                                                                    className="flex items-center cursor-pointer hover:text-[#FC9D25] space-x-1"
                                                                    onClick={() => copyToClipboard(key)}
                                                                    onMouseEnter={() => setHoveredVar(key)}
                                                                    onMouseLeave={() => setHoveredVar(null)}
                                                                    title="Clique para copiar"
                                                                >
                                                                    <span>{key}</span>
                                                                    {hoveredVar === key && <IoCopy size={16} />}
                                                                </span>
                                                                <span>{desc}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Detalhes da reserva */}
                                                <div>
                                                    <h3 className="font-semibold mb-2">{t.modals.propertiesEdit.stay.reservationDetails.title}</h3>
                                                    <ul className="space-y-2">
                                                        {reservationDetails.map(({ key, desc }) => (
                                                            <li key={key} className="flex justify-between">
                                                                <span
                                                                    className="flex items-center cursor-pointer hover:text-[#FC9D25] space-x-1"
                                                                    onClick={() => copyToClipboard(key)}
                                                                    onMouseEnter={() => setHoveredVar(key)}
                                                                    onMouseLeave={() => setHoveredVar(null)}
                                                                    title="Clique para copiar"
                                                                >
                                                                    <span>{key}</span>
                                                                    {hoveredVar === key && <IoCopy size={16} />}
                                                                </span>
                                                                <span>{desc}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Detalhes do hotel */}
                                                <div>
                                                    <h3 className="font-semibold mb-2">{t.modals.propertiesEdit.stay.hotelDetails.title}</h3>
                                                    <ul className="space-y-2">
                                                        {hotelDetails.map(({ key, desc }) => (
                                                            <li key={key} className="flex justify-between">
                                                                <span
                                                                    className="flex items-center cursor-pointer hover:text-[#FC9D25] space-x-1"
                                                                    onClick={() => copyToClipboard(key)}
                                                                    onMouseEnter={() => setHoveredVar(key)}
                                                                    onMouseLeave={() => setHoveredVar(null)}
                                                                    title="Clique para copiar"
                                                                >
                                                                    <span>{key}</span>
                                                                    {hoveredVar === key && <IoCopy size={16} />}
                                                                </span>
                                                                <span>{desc}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showTemplatesModal && (
                                        <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg p-4 z-50 flex flex-col overflow-auto">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-sm font-bold">Templates</h2>
                                                <button
                                                    onClick={() => setShowTemplatesModal(false)}
                                                    className="text-gray-500 text-lg"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                            <div className="text-xs flex flex-col gap-2">
                                                {templates.length > 0 ? (
                                                    templates.map((template) => (
                                                        <div
                                                            key={template.templateID}
                                                            onClick={() => handleSelectTemplate(template)}
                                                            className="cursor-pointer p-2 border rounded hover:bg-gray-100"
                                                        >
                                                            <strong>Template #{template.templateID}</strong>
                                                            <p className="text-gray-600 text-xs truncate">{template.emailSubject}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>Nenhum template encontrado.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === "ota" && (
                        <div className="flex flex-col gap-2 p-4">
                            {/* Botão voltar */}
                            <button onClick={goBack} className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <MdKeyboardArrowLeft size={18} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2 -mt-2 mb-2">
                                    <input
                                        type="checkbox"
                                        id="hasRoomCloud"
                                        checked={hasRoomCloud}
                                        onChange={(e) => setHasRoomCloud(e.target.checked)}
                                        className="w-4 h-4"
                                        disabled={!isEditing}
                                    />
                                    <label htmlFor="hasRoomCloud" className="text-sm">Has Room Cloud?</label>
                                </div>
                                <p className="bg-gray-200 p-1 mb-2">Setup Room Cloud account</p>
                                <div className="flex flex-row gap-2 w-full">
                                    <div className="w-1/3 flex flex-col text-xs">
                                        <p>Username</p>
                                        <input
                                            type="text"
                                            value={roomCloudUsername}
                                            onChange={(e) => setRoomCloudUsername(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/3 flex flex-col text-xs">
                                        <p>Password</p>
                                        <input
                                            type="password"
                                            value={roomCloudPassword}
                                            onChange={(e) => setRoomCloudPassword(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/3 flex flex-col text-xs">
                                        <p>Hotel ID</p>
                                        <input
                                            type="text"
                                            value={roomCloudHotelID}
                                            onChange={(e) => setRoomCloudHotelID(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exibição de erro */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <Button color="error" onClick={onClose}>
                            {t.modals.propertiesEdit.cancel}
                        </Button>
                        {isEditing ? (
                            <Button color="primary" onClick={handleSave} disabled={loading}>
                                {loading ? t.modals.propertiesEdit.saving : t.modals.propertiesEdit.save}
                            </Button>
                        ) : (
                            <Button color="primary" onClick={() => setIsEditing(true)}>
                                {t.modals.propertiesEdit.edit}
                            </Button>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal >
    );
};

export default PropertiesEditForm;