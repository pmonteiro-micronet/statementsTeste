'use client'
import React, { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import axios from "axios";
import { flushSync } from 'react-dom';
import InputFieldControlled from "@/components/input/page";
// import CountryAutocomplete from "@/components/autocompletes/country/page";
import { IoIosArrowForward } from "react-icons/io";
import CancelPIN from "@/components/modals/pin/cancel/page";

import { generatePDFTemplate } from "@/components/pdfTemplate/page";
import './styles.css';
import { FaPencilAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import SignaturePad from 'signature_pad';
import TermsConditionsForm from "@/components/terms&conditions/page";
import ProtectionPolicyForm from "@/components/protectionPolicy/page";
import EditRegistrationForm from "@/components/modals/arrivals/reservationForm/edit/page";
// import CompanyVATFormEdit from "@/components/modals/arrivals/reservationForm/companyVAT/edit/page";
// import CompanyVATFormInsert from "@/components/modals/arrivals/reservationForm/companyVAT/insert/page";
// import BeforeCompanyVat from "@/components/modals/arrivals/reservationForm/companyVAT/beforeInfo/page";
import MultiModalManager from "@/components/modals/arrivals/reservationForm/companyVAT/page";
import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";
import RatingForm from "@/components/modals/rating/page.jsx";
import SuccessRegistrationForm from "@/components/modals/arrivals/reservationForm/success/page";
import LoadingBackdrop from "@/components/Loader/page";
import PersonalIDForm from "@/components/modals/arrivals/reservationForm/PersonalID/page";
import { FaPlusCircle } from "react-icons/fa";
import AddressForm from "@/components/modals/arrivals/reservationForm/address/page"

import DatePicker from "react-datepicker";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { IoReader } from "react-icons/io5";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };
import { useSession } from "next-auth/react";
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

import pako from 'pako'; // Adicione pako para compressão gzip

import { useRouter } from "next/navigation";

export default function Page() {
    const [reserva, setReserva] = useState(null);
    const [guestInfo, setGuestInfo] = useState(null);
    const [address, setAddress] = useState(null);
    const [personalID, setPersonalID] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [propertyID, setPropertyID] = useState(null);
    const [profileID, setProfileID] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Controle do modal de erro
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Controle do modal de erro
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Estados para armazenar as informações do hotel
    const [hotelName, setHotelName] = useState('');
    const [hotelTermsEN, setHotelTermsEN] = useState("");
    const [hotelTermsPT, setHotelTermsPT] = useState("");
    const [hotelTermsES, setHotelTermsES] = useState("");
    const [hotelTerms, setHotelTerms] = useState(""); // Estado dinâmico para exibição

    console.log(hotelTermsEN, hotelTermsPT, hotelTermsES);

    const [hotelNIF, setHotelNIF] = useState('');
    const [hotelPhone, setHotelPhone] = useState('');
    const [hotelEmail, setHotelEmail] = useState('');
    const [hotelAddress, setHotelAddress] = useState('');
    const [hotelPostalCode, setHotelPostalCode] = useState('');
    const [hotelRNET, setHotelRNET] = useState('');
    const [isInternalUser, setIsInternalUser] = useState(false);
    const canvasRef = useRef(null);
    const signaturePadRef = useRef(null);

    const [locale, setLocale] = useState("pt");
    const router = useRouter();

    // const [localCompanyData, setLocalCompanyData] = useState(null);
    const [addressData, setAddressData] = useState({});
    const [personalIDData, setPersonalIDData] = useState({});

    const [newCompany, setNewCompany] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);


    // useEffect(() => {
    //     const companies = JSON.parse(localStorage.getItem("company") || "{}");
    //     if (companies[profileID]) {
    //         setLocalCompanyData(companies[profileID]);
    //     }
    // }, [profileID]);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            const internalUser = session?.user?.isInternalUser === true;
            setIsInternalUser(internalUser);

            const lockedPath = "/homepage/frontOfficeView/registrationForm";
            const currentPath = window.location.pathname;

            if (internalUser && currentPath !== lockedPath) {
                router.replace(lockedPath); // Redireciona silenciosamente sem adicionar no histórico
            }

            // Observa alterações manuais na URL (como digitar outra rota)
            const handlePopState = () => {
                const newPath = window.location.pathname;
                if (internalUser && newPath !== lockedPath) {
                    router.replace(lockedPath);
                }
            };

            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [session, status]);


    // const lerCartaoCidadao = async () => {
    //     try {
    //         const response = await axios.post("/api/CCRead", {
    //             propertyID: propertyID
    //         });

    //         console.log("Dados do Cartão de Cidadão:", response.data);
    //     } catch (err) {
    //         console.error("Erro ao ler CC:", err.response?.data || err.message);
    //     }
    // };

    const lerCartaoCidadao = async () => { 
        try 
        { 
            const response = await axios.get("http://localhost:5000/read_cc"); 
            console.log("Dados do Cartão de Cidadão:", response); 
        } 
    catch (err) { console.error("Erro ao contactar o serviço do CC:", err); } };

    useEffect(() => {
        lerCartaoCidadao();
    }, []);


    const handleLanguageChange = (lang) => {
        setLocale(lang);
        setActiveFlag(lang === "en" ? "usa-uk" : lang === "pt" ? "pt" : "es");
        localStorage.setItem("language", lang);

        // Atualiza os termos do hotel conforme o idioma selecionado
        setHotelTerms(
            lang === "en" ? miniTermsEN :
                lang === "pt" ? miniTermsPT :
                    miniTermsES
        );
    };

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
            setActiveFlag(storedLanguage === "en" ? "usa-uk" : storedLanguage === "pt" ? "pt" : "es");
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"

    // const searchParams = useSearchParams();  // Usando useSearchParams diretamente
    // const requestID = searchParams.get("requestID");  // Acessando parâmetro de URL
    // const resNo = searchParams.get("resNo");  // Acessando o parâmetro resNo

    console.log(isLoading);

    useEffect(() => {
        const preventBackNavigation = () => {
            // Impede a navegação para trás
            window.history.pushState(null, null, window.location.href);
        };

        // Adiciona evento para interceptar o botão "voltar"
        window.addEventListener("popstate", preventBackNavigation);

        // Configura o estado inicial do histórico
        preventBackNavigation();

        return () => {
            // Remove o evento ao desmontar o componente
            window.removeEventListener("popstate", preventBackNavigation);
        };
    }, []);

    const calculateNights = (start, end) => {
        if (!start || !end) return '-';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate - startDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > 0 ? diffDays : '-';
    };

    const nights = reserva && reserva.DateCI && reserva.DateCO
        ? calculateNights(reserva.DateCI, reserva.DateCO)
        : '-';

    //botoes que mudam de cor
    const halfInputStyle = "w-10 h-4 outline-none my-2 text-sm !text-textLabelColor bg-transparent input-field"
    // const inputStyle = "w-32 h-4 outline-none my-2 text-sm !text-textLabelColor bg-transparent input-field"
    const inputStyleFull = "w-full h-4 outline-none my-2 text-sm !text-textLabelColor bg-transparent input-field"
    const inputStyleFullWithLine = "w-full border-b-2 border-gray-200 px-1 h-4 outline-none my-2 text-sm !text-textLabelColor bg-transparent input-field"

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const requestID = queryParams.get("requestID");
        const resNo = queryParams.get("resNo");
        const propertyID = queryParams.get("propertyID");
        const profileID = queryParams.get("profileID");

        setPropertyID(propertyID);
        setProfileID(profileID);
        const fetchPropertyDetails = async () => {
            if (!propertyID) {
                console.warn("Parâmetro ausente na URL: propertyID");
                return;
            }

            try {
                const response = await axios.get(`/api/properties/${propertyID}`);
                console.log("Resposta da API para as propriedades:", response);

                const property = response.data.response[0];
                if (property) {
                    const hotelName = property.hotelName;
                    const hotelTermsEN = property.hotelTermsEN;
                    const hotelTermsPT = property.hotelTermsPT;
                    const hotelTermsES = property.hotelTermsES;
                    const hotelNIF = property.hotelNIF;
                    const hotelPhone = property.hotelPhone;
                    const hotelEmail = property.hotelEmail;
                    const hotelAddress = property.hotelAddress;
                    const hotelPostalCode = property.hotelPostalCode;
                    const hotelRNET = property.hotelRNET;

                    console.log("Hotel Information:", {
                        hotelName,
                        hotelTermsEN,
                        hotelTermsPT,
                        hotelTermsES,
                        hotelNIF,
                        hotelPhone,
                        hotelEmail,
                        hotelAddress,
                        hotelPostalCode,
                        hotelRNET
                    });

                    // Atualizando o estado
                    setHotelName(hotelName);
                    setHotelTermsEN(hotelTermsEN);
                    setHotelTermsPT(hotelTermsPT);
                    setHotelTermsES(hotelTermsES);
                    setHotelNIF(hotelNIF);
                    setHotelPhone(hotelPhone);
                    setHotelEmail(hotelEmail);
                    setHotelAddress(hotelAddress);
                    setHotelPostalCode(hotelPostalCode);
                    setHotelRNET(hotelRNET);
                } else {
                    console.warn(`Nenhuma propriedade encontrada com propertyID: ${propertyID}`);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes da propriedade:", error.message);
            }
        };

        const fetchReservaByRequestID = async () => {
            if (!requestID || !resNo) {
                console.warn("Parâmetros ausentes na URL: requestID ou resNo");
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.get(`/api/reservations/checkins/registrationForm/updateRealTime`, {
                    params: { resNo, propertyID }
                });

                console.log("Resposta da API (real-time):", response);

                const reservas = response.data; // Já é JSON válido

                if (Array.isArray(reservas) && reservas.length > 0) {
                    let reservaSelecionada = null;
                    let guestInfo = null;
                    let address = null;
                    let personalID = null;
                    let contacts = null;

                    for (const reservaObj of reservas) {
                        if (reservaObj.ReservationInfo?.some(info => `${info.ResNo}` === `${resNo}`)) {
                            reservaSelecionada = reservaObj.ReservationInfo.find(info => `${info.ResNo}` === `${resNo}`);
                            guestInfo = reservaObj.GuestInfo?.[0]?.GuestDetails?.[0] || null;
                            address = reservaObj.GuestInfo?.[0]?.Address?.[0] || null;
                            personalID = reservaObj.GuestInfo?.[0]?.PersonalID?.[0] || null;
                            contacts = reservaObj.GuestInfo?.[0]?.Contacts?.[0] || null;
                            break;
                        }
                    }

                    if (reservaSelecionada) {
                        console.log("Reserva encontrada:", reservaSelecionada);
                        console.log("Hóspede:", guestInfo);
                        console.log("Endereço:", address);
                        console.log("Documento:", personalID);
                        console.log("Contatos:", contacts);

                        setReserva(reservaSelecionada);
                        setGuestInfo(guestInfo);
                        setAddress(address);
                        setPersonalID(personalID);
                        setContacts(contacts);

                        if (contacts?.Email?.endsWith('@guest.booking.com')) {
                            setErrorMessage('Email inválido. O email não pode terminar em guest.booking.com');
                        } else {
                            setErrorMessage('');
                        }
                    } else {
                        console.warn(`Nenhuma reserva encontrada com ResNo: ${resNo}`);
                    }
                } else {
                    console.warn(`Nenhuma reserva encontrada para o requestID: ${requestID}`);
                }
            } catch (error) {
                console.error("Erro ao buscar reserva em tempo real:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (requestID && resNo && propertyID) {
            fetchReservaByRequestID();
            fetchPropertyDetails();
        }

    }, []);

    const initializeSignaturePad = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Ajustar o tamanho do canvas para corresponder ao tamanho visível
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;

        // Escalar o contexto para alinhar com a densidade de pixels
        const context = canvas.getContext('2d');
        context.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Reinicializar o SignaturePad com o novo tamanho
        if (signaturePadRef.current) {
            signaturePadRef.current.clear(); // Limpa antes de recriar
        }
        signaturePadRef.current = new SignaturePad(canvas);
    };

    // Inicializar o SignaturePad
    // Inicializar o SignaturePad
    useEffect(() => {
        const initializeOrResizeCanvas = () => {
            if (canvasRef.current) {
                initializeSignaturePad();
            }
        };

        if (!isLoading) {
            initializeOrResizeCanvas(); // Inicializa o SignaturePad após o carregamento completo
        }

        // Atualizar o canvas ao redimensionar a janela
        const handleResize = () => {
            initializeOrResizeCanvas();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup do event listener ao desmontar o componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoading]); // Adiciona `isLoading` como dependência


    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Estado para controlar a bandeira ativa
    const [activeFlag, setActiveFlag] = useState(locale === "en" ? "usa-uk" : locale === "pt" ? "pt" : "es"); // Bandeira padrão

    const [termsAccepted, setTermsAccepted] = useState(true); // "Agree" por padrão
    const [policyAccepted, setPolicyAccepted] = useState(true); // "Agree" por padrão
    const [error] = useState('');

    // Verifica se o canvas está vazio
    const isCanvasEmpty = () => {
        const canvas = canvasRef.current;
        if (!canvas) return true;

        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Verifica se todos os pixels são transparentes
        return imgData.data.every((value, index) => index % 4 !== 3 || value === 0);
    };

    const [signatureDataUrl] = useState(null); // Para armazenar a base64 da assinatura

    console.log(signatureDataUrl);

    const [missingFields, setMissingFields] = useState([]);
    const [missingValues, setMissingValues] = useState([]);
    const [requiredFields, setRequiredFields] = useState([]);

    const [isMissingFieldsModalOpen, setIsMissingFieldsModalOpen] = useState(false);

    const handleOkClick = async ({
        skipMissingCheck = false,
        guestInfo: gi = guestInfo,
        addressData: ad = addressData,
        personalIDData: pid = personalIDData,
        contactsData: ct = contacts,
        reservaData: rs = reserva
    } = {}) => {
        console.log("Contactos: ", rs);
        let errors = [];

        if (isSubmitting) return; // prevent multiple clicks
        setIsSubmitting(true);

        try {

            // Validações de formulário
            if (isCanvasEmpty()) {
                errors.push(t.frontOffice.registrationForm.errors.emptyForm);
            }
            if (email.endsWith("@guest.booking.com")) {
                errors.push(t.frontOffice.registrationForm.errors.bookingEmail);
            }
            if (!skipMissingCheck) {

                // 1️⃣ Detectar campos em falta (lógica original)
                let tempMissingFields = [];

                const getValue = (dataObj, fallbackObj, field) => {
                    return dataObj?.[field] ?? fallbackObj?.[field];
                };

                if (!getValue(null, guestInfo, "LastName"))
                    tempMissingFields.push({ key: "LastName" });

                if (!getValue(addressData, address, "Country"))
                    tempMissingFields.push({ key: "Country" });

                if (!getValue(personalIDData, personalID, "IDDoc"))
                    tempMissingFields.push({ key: "IDDoc" });

                if (!getValue(personalIDData, personalID, "NrDoc"))
                    tempMissingFields.push({ key: "NrDoc" });

                if (!getValue(personalIDData, personalID, "CountryOfBirth"))
                    tempMissingFields.push({ key: "CountryOfBirth" });

                const dob = getValue(personalIDData, personalID, "DateOfBirth");
                if (!dob || dob.split("T")[0] === "1900-01-01")
                    tempMissingFields.push({ key: "DateOfBirth" });

                console.log("🔎 Missing fields detected:", tempMissingFields);
                setMissingFields(tempMissingFields);

                // 2️⃣ criar allFields AGORA (antes de usar)
                const allFields = [
                    {
                        key: "LastName",
                        label: t.frontOffice.registrationForm.lastName,
                        value: getValue(null, guestInfo, "LastName") ?? "",
                        target: "guestInfo",
                        required: true
                    },
                    {
                        key: "email",
                        label: t.frontOffice.registrationForm.personalEmail,
                        value: getValue(null, contacts, "Email") ?? "",
                        target: "contacts",
                        required: false
                    },
                    {
                        key: "phone",
                        label: t.frontOffice.registrationForm.phoneNumber,
                        value: getValue(null, contacts, "PhoneNumber") ?? "",
                        target: "contacts",
                        required: false
                    },
                    {
                        key: "vatNo",
                        label: t.frontOffice.registrationForm.vatNr,
                        value: getValue(null, contacts, "VatNo") ?? "",
                        target: "contacts",
                        required: false
                    },
                    {
                        key: "CompanyName",
                        label: t.modals.companyInfo.companyName,
                        value: getValue(null, reserva, "companyName") ?? "",
                        target: "reserva",
                        required: false
                    },
                    {
                        key: "CompanyVatNo",
                        label: t.frontOffice.registrationForm.vatNr,
                        value: getValue(null, reserva, "CompanyVatNo") ?? "",
                        target: "reserva",
                        required: false
                    },
                    {
                        key: "Country",
                        label: t.frontOffice.registrationForm.country,
                        value: getValue(addressData, address, "Country") ?? "",
                        CountryID: getValue(addressData, address, "CountryID") ?? "",
                        target: "addressData",
                        required: true
                    },
                    {
                        key: "IDDoc",
                        label: t.frontOffice.registrationForm.idDoc,
                        value: getValue(personalIDData, personalID, "IDDoc") ?? "",
                        IDDocID: getValue(personalIDData, personalID, "IDDocID") ?? "",
                        target: "personalIDData",
                        required: true
                    },
                    {
                        key: "NrDoc",
                        label: t.frontOffice.registrationForm.idDocNumber,
                        value: getValue(personalIDData, personalID, "NrDoc") ?? "",
                        target: "personalIDData",
                        required: true
                    },
                    {
                        key: "CountryOfBirth",
                        label: t.frontOffice.registrationForm.countryOfBirth,
                        value: getValue(personalIDData, personalID, "CountryOfBirth") ?? "",
                        CountryOfBirthID: getValue(personalIDData, personalID, "CountryOfBirthID") ?? "",
                        target: "personalIDData",
                        required: true
                    },
                    {
                        key: "Nationality",
                        label: t.frontOffice.registrationForm.nationality,
                        value: getValue(personalIDData, personalID, "Nationality") ?? "",
                        NationalityID: getValue(personalIDData, personalID, "NationalityID") ?? "",
                        target: "personalIDData",
                        required: true
                    },
                    {
                        key: "DateOfBirth",
                        label: t.frontOffice.registrationForm.dateOfBirth,
                        value: dob && dob.split("T")[0] !== "1900-01-01" ? dob : "",
                        target: "personalIDData",
                        required: true
                    },
                ];

                // 3️⃣ Abrir modal APENAS se houver missing fields
                if (tempMissingFields.length > 0) {
                    console.log("⚠️ Existem campos em falta. Abrindo modal...");

                    setRequiredFields(allFields);
                    setMissingValues(
                        allFields.reduce((acc, f) => {
                            acc[f.key] = f.value ?? "";
                            if (f.key === "Country") {
                                acc["CountryID"] = f.CountryID ?? "";
                            }
                            if (f.key === "CountryOfBirth") {
                                acc["CountryOfBirthID"] = f.CountryOfBirthID ?? "";
                            }
                            if (f.key === "Nationality") {
                                acc["NationalityID"] = f.NationalityID ?? "";
                            }
                            if (f.key === "IDDoc") {
                                acc["IDDocID"] = f.IDDocID ?? "";
                            }
                            return acc;
                        }, {})
                    );
                    setIsMissingFieldsModalOpen(true);
                    return;  // ← impede abrir quando não há missing!
                }

                // 4️⃣ Se chegou aqui → nenhum campo em falta
                console.log("Nenhum campo em falta → continuar sem mostrar modal.");
            }


            // const effectiveEmail = email || initialEmail || contacts.Email;

            // if (!effectiveEmail) {
            //     const proceed = window.confirm(t.frontOffice.registrationForm.errors.emptyEmailValidation);
            //     if (!proceed) return;
            // }

            if (errors.length > 0) {
                setErrorMessage(errors.join("\n"));
                setIsErrorModalOpen(true);
                return;
            }

            setErrorMessage('');
            setIsErrorModalOpen(false);

            try {
                // atualiza o address
                const payloadAddress = {
                    countryID: ad.CountryID || missingValues.CountryID,
                    address: addressData.Street,
                    postalcode: addressData.PostalCode,
                    city: addressData.City,
                    profileID: profileID,
                    propertyID: propertyID
                };

                console.log("Address payload: ", payloadAddress);

                const responseAddress = await axios.post(
                    '/api/reservations/checkins/registrationForm/editaddress',
                    payloadAddress
                );
                console.log("Endereço salvo com sucesso:", responseAddress.data);

                // atualiza o personalID
                const payloadPersonalID = {
                    DateOfBirth: pid.DateOfBirth || missingValues.DateOfBirth,
                    CountryOfBirth: pid.CountryOfBirthID || missingValues.CountryOfBirthID || personalIDData.CountryOfBirthID, // assumindo que você guardou o ID aqui
                    Nationality: pid.NationalityID || missingValues.NationalityID || personalIDData.NationalityID,       // idem
                    IDDoc: pid.IDDocID || missingValues.IDDocID || personalIDData.IDDocID,                   // idem
                    DocNr: pid.NrDoc || missingValues.NrDoc,
                    ExpDate: personalIDData.ExpDate,
                    Issue: personalIDData.Issue,
                    profileID: profileID,
                    propertyID: propertyID
                };

                const responsePersonalID = await axios.post(
                    '/api/reservations/checkins/registrationForm/editpersonalID',
                    payloadPersonalID
                );
                console.log("Personal ID salvo com sucesso:", responsePersonalID.data);

                // ✅ Atualiza dados da empresa (Company VAT)

                console.log("🧩 Estado atual de newCompany:", newCompany);

                const payload = Object.fromEntries(
                    Object.entries({
                        ...newCompany, // usa diretamente o estado da empresa
                    }).map(([key, value]) => [
                        key,
                        String(value ?? "").trim() === "" ? "" : String(value ?? "").trim(),
                    ])
                );

                console.log("📦 Payload final enviado para company endpoint:", payload);

                // Decide whether to create or update the company on the server.
                if (newCompany?.createdViaModal) {

                    const resNo = payload?.resNo;       // ✅ Make sure this exists
                    const profileID = payload?.profileID;
                    const propertyID = payload?.propertyID;
                    // Company was created via the modal — perform createCompanyVAT now.
                    try {
                        const createResp = await axios.post(
                            "/api/reservations/checkins/registrationForm/createCompanyVAT",
                            {
                                profileID,
                                propertyID,
                                resNo,
                                countryID: payload.countryID,
                                countryName: payload.countryName,
                                oldCompany: payload.oldCompany || payload.OldCompanyID || "",
                                companyName: payload.companyName,
                                vatNo: payload.vatNo,
                                emailAddress: payload.emailAddress,
                                streetAddress: payload.streetAddress,
                                zipCode: payload.zipCode,
                                city: payload.city,
                                state: payload.state,
                            }
                        );

                        console.log("✅ Company created via modal:", createResp.data);

                        const server = createResp.data || {};
                        const updatedCompany = {
                            companyName: server.companyName || server.CompanyName || payload.companyName || "",
                            companyID: server.companyID || server.CompanyID || payload.companyID || "",
                            vatNo: server.vatNo || server.VATNo || payload.vatNo || "",
                            emailAddress: server.emailAddress || payload.emailAddress || "",
                            countryID: server.countryID || payload.countryID || "",
                            countryName: server.countryName || payload.countryName || "",
                            streetAddress: server.streetAddress || payload.streetAddress || "",
                            zipCode: server.zipCode || payload.zipCode || "",
                            city: server.city || payload.city || "",
                            state: server.state || payload.state || "",
                            hasCompanyVAT: 1,
                            BlockedCVatNO: 0,
                            profileID,
                            propertyID,
                            resNo,
                            OldCompanyID: payload.oldCompany || payload.OldCompanyID || "",
                        };

                        // Update parent state so UI shows company and edit button
                        setNewCompany(updatedCompany);
                        setReserva((r) => ({
                            ...r,
                            hasCompanyVAT: 1,
                            BlockedCVatNO: 0,
                            Company: updatedCompany.companyName,
                            CompanyVatNo: updatedCompany.vatNo,
                            CompanyID: updatedCompany.companyID,
                        }));
                    } catch (err) {
                        console.error("Erro ao criar Company VAT:", err);
                        errors.push(t.frontOffice.registrationForm.errors.errorSavingDocument);
                        setErrorMessage(errors.join("\n"));
                        setIsErrorModalOpen(true);
                        return;
                    }
                } else if (!newCompany) {


                } else if (!newCompany?.createdViaModal) {
                    // Company was picked / existing — perform updateCompanyVAT.
                    const resNo = payload?.resNo;       // ✅ Make sure this exists
                    const profileID = payload?.profileID;
                    const propertyID = payload?.propertyID;
                    try {
                        const responseCompany = await axios.post(
                            "/api/reservations/checkins/registrationForm/updateCompanyVAT",
                            payload
                        );

                        console.log("✅ Company VAT atualizado com sucesso:", responseCompany.data);

                        const updated = responseCompany.data || {};
                        const updatedCompany = {
                            companyName: updated.companyName || updated.CompanyName || payload.companyName || newCompany?.companyName || "",
                            companyID: updated.companyID || updated.CompanyID || payload.companyID || newCompany?.companyID || "",
                            vatNo: updated.vatNo || updated.VATNo || payload.vatNo || newCompany?.vatNo || "",
                            emailAddress: gi.emailAddress || updated.emailAddress || payload.emailAddress || newCompany?.emailAddress || "",
                            countryID: updated.countryID || payload.countryID || newCompany?.countryID || "",
                            countryName: updated.countryName || payload.countryName || newCompany?.countryName || "",
                            streetAddress: updated.streetAddress || payload.streetAddress || newCompany?.streetAddress || "",
                            zipCode: updated.zipCode || payload.zipCode || newCompany?.zipCode || "",
                            city: updated.city || payload.city || newCompany?.city || "",
                            state: updated.state || payload.state || newCompany?.state || "",
                            hasCompanyVAT: 1,
                            BlockedCVatNO: 0,
                            profileID,
                            propertyID,
                            resNo,
                            OldCompanyID: payload.oldCompany || payload.OldCompanyID || "",
                        };

                        setNewCompany(updatedCompany);
                        setReserva((r) => ({
                            ...r,
                            hasCompanyVAT: 1,
                            BlockedCVatNO: 0,
                            Company: updatedCompany.companyName,
                            CompanyVatNo: updatedCompany.vatNo,
                            CompanyID: updatedCompany.companyID,
                        }));
                    } catch (err) {
                        console.error("Erro ao salvar Company VAT:", err);
                        errors.push(t.frontOffice.registrationForm.errors.errorSavingDocument);
                        setErrorMessage(errors.join("\n"));
                        setIsErrorModalOpen(true);
                        return;
                    }
                }
            } catch (error) {
                console.error("Erro ao salvar endereço ou Personal ID:", error);
                errors.push(t.frontOffice.registrationForm.errors.errorSavingDocument);
                setErrorMessage(errors.join("\n"));
                setIsErrorModalOpen(true);
                return;
            }

            let emailToSend;

            // 1️⃣ Se ct.email tiver valor, este tem prioridade
            if (ct.email && ct.email.trim() !== "") {
                emailToSend = ct.email.trim();
            }
            // 2️⃣ Se ct.email estiver vazio mas o email foi alterado
            else if (email.trim() !== initialEmail.trim()) {
                emailToSend = email.trim();
            }
            // 3️⃣ Caso contrário, não envia nada
            else {
                emailToSend = undefined;
            } // Envia undefined se não houver alteração

            let vatNoToSend;

            // 1️⃣ Se ct.phone tiver valor, este tem prioridade
            if (ct.vatNo && ct.vatNo.trim() !== "") {
                vatNoToSend = ct.vatNo.trim();
            }
            // 2️⃣ Se ct.email estiver vazio mas o email foi alterado
            else if (vatNo.trim() !== initialVatNo.trim()) {
                vatNoToSend = vatNo.trim();
            }
            // 3️⃣ Caso contrário, não envia nada
            else {
                vatNoToSend = undefined;
            } // Envia undefined se não houver alteração

            let phoneToSend;

            // 1️⃣ Se ct.phone tiver valor, este tem prioridade
            if (ct.phone && ct.phone.trim() !== "") {
                phoneToSend = ct.phone.trim();
            }
            // 2️⃣ Se ct.email estiver vazio mas o email foi alterado
            else if (phone.trim() !== initialPhone.trim()) {
                phoneToSend = phone.trim();
            }
            // 3️⃣ Caso contrário, não envia nada
            else {
                phoneToSend = undefined;
            } // Envia undefined se não houver alteração

            // Se houver alterações (ou valores a serem enviados), envia para a API
            if (emailToSend || vatNoToSend || phoneToSend) {
                try {
                    const response = await axios.post(`/api/reservations/checkins/registrationForm/valuesEdited`, {
                        email: emailToSend,
                        vatNo: vatNoToSend,
                        phone: phoneToSend,
                        registerID: profileID,
                        propertyID: propertyID
                    });
                    console.log('Alterações salvas com sucesso:', response.data);
                } catch (error) {
                    console.error('Erro ao salvar alterações:', error);
                    errors.push(t.frontOffice.registrationForm.errors.contactSupport);
                    setErrorMessage(errors.join("\n"));
                    setIsErrorModalOpen(true);
                    return;
                }
            }

            // Captura a assinatura e gera o PDF
            try {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const signatureBase64 = canvas.toDataURL().split(',')[1]; // Remove prefixo "data:..."

                const reservaDetails = {
                    // Detalhes da reserva
                    PropertyID: propertyID,
                    ResNo: reserva.ResNo,
                    Room: reserva.Room,
                    DateCI: reserva.DateCI,
                    DateCO: reserva.DateCO,
                    Adults: reserva.Adults,
                    Childs: reserva.Childs,
                    LastName: guestInfo.LastName,
                    FirstName: guestInfo.FirstName,

                    // Usa addressData se existir, senão fallback para address
                    Street: addressData?.Street ?? address.Street,
                    Country: ad.Country ?? addressData?.Country ?? address.Country,

                    // Usa personalIDData se existir, senão fallback para personalID
                    IdDoc: personalIDData?.IDDoc ?? personalID.IDDoc,
                    NrDoc: pid.NrDoc ?? personalIDData?.NrDoc ?? personalID.NrDoc,
                    ExpDate: personalIDData?.ExpDate ?? personalID.ExpDate,
                    DateOfBirth: personalIDData?.DateOfBirth ?? personalID.DateOfBirth,
                    Issue: personalIDData?.Issue ?? personalID.Issue,
                    CountryOfBirth: personalIDData?.CountryOfBirth ?? personalID.CountryOfBirth,
                    IDCountryOfBirth: personalIDData?.IDCountryOfBirth ?? personalID.IDCountryOfBirth,
                    IDDocSelect: personalIDData?.IDDocSelect ?? personalID.IDDocSelect,
                    IDNationality: personalIDData?.IDNationality ?? personalID.IDNationality,

                    Phone: phoneToSend,
                    VatNo: vatNoToSend,
                    PersonalEmail: emailToSend,
                    ProtectionPolicy: policyAccepted,
                    HotelName: hotelName,
                    HotelTermsEN: hotelTerms,
                    HotelPhone: hotelPhone,
                    HotelEmail: hotelEmail,
                    HotelAddress: hotelAddress,
                    HotelPostalCode: hotelPostalCode,
                    HotelNIF: hotelNIF,
                    HotelRNET: hotelRNET,
                    RateCode: reserva.RateCode,
                    Locale: locale, // passa a variavel de idioma
                };
                console.log("Detalhes da reserva para o PDF:", reservaDetails);
                // Geração do PDF
                const pdfDoc = await generatePDFTemplate(reservaDetails, `data:image/png;base64,${signatureBase64}`);
                const pdfBlob = pdfDoc.output('blob'); // Gerar o PDF como um Blob
                // Compressão do PDF com pako (gzip)
                const pdfArrayBuffer = await pdfBlob.arrayBuffer();
                const compressedPdf = pako.gzip(new Uint8Array(pdfArrayBuffer)); // Comprime usando gzip

                // Codificação do PDF comprimido em Base64
                const pdfBase64 = btoa(String.fromCharCode(...compressedPdf));
                console.log(pdfBase64);
                // Envia os dados via Axios
                const response = await axios.post(
                    "/api/reservations/checkins/registration_form_base64",
                    {
                        PropertyID: propertyID,
                        pdfBase64: pdfBase64, // Envia o PDF comprimido em Base64
                        fileName: `RegistrationForm_ResNo_${reserva.ResNo}_TC_${termsAccepted ? 1 : 0}_DPP_${policyAccepted ? 1 : 0}_ProfileID_${guestInfo.ProfileID}.pdf`,
                    }
                );

                console.log('Resposta da API:', response.data);
                // Atualiza o campo 'seen' no backend
                try {
                    await axios.post('/api/reservations/checkins/registrationForm/updateSeen', {
                        requestID: requestID
                    });
                    console.log("Campo 'seen' atualizado com sucesso.");
                } catch (err) {
                    console.error("Erro ao atualizar campo 'seen':", err);
                }

                setSuccessMessage("Registration sent successfully");
                setIsSuccessModalOpen(true);
            } catch (error) {
                console.error('Erro ao gerar ou enviar o PDF:', error);
                errors.push(t.frontOffice.registrationForm.errors.generateFormError);
                setErrorMessage(errors.join("\n"));
                setIsErrorModalOpen(true);
            }

        } catch (error) {
            console.error("Erro no envio:", error);
        } finally {
            // 🔹 Re-enable the button once everything is finished
            setIsSubmitting(false);
        }
    };
    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const [isDarkMode, setIsDarkMode] = useState(false);

    // Alterna entre os modos
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add("dark"); // Adiciona classe "dark"
        } else {
            document.documentElement.classList.remove("dark"); // Remove classe "dark"
        }
    };

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [vatNo, setVatNo] = useState(""); // Novo estado para VAT No.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCVATModalOpen, setIsCVATModalOpen] = useState(false);
    const [isCVATModalOpenInsert, setIsCVATModalOpenInsert] = useState(false);
    const [companyVATData, setCompanyVATData] = useState(null);
    const [isPersonalIDModalOpen, setisPersonalIDModalOpen] = useState(false);
    const [isAddressModalOpen, setisAddressModalOpen] = useState(false);
    const [modalField, setModalField] = useState(null); // Para identificar o campo em edição

    const [initialEmail, setInitialEmail] = useState("");
    const [initialPhone, setInitialPhone] = useState("");

    const [initialVatNo, setInitialVatNo] = useState("");
    const [openModal, setOpenModal] = useState("");

    useEffect(() => {
        if (contacts?.Email && initialEmail === "") {
            setEmail(contacts.Email);
            setInitialEmail(contacts.Email); // Armazena o valor inicial
        }
        if (contacts?.PhoneNumber && initialPhone == "") {
            setPhone(contacts.PhoneNumber);
            setInitialPhone(contacts.PhoneNumber);
        }
        if (contacts?.VatNo && initialVatNo === "") {
            setVatNo(contacts.VatNo);
            setInitialVatNo(contacts.VatNo); // Armazena o valor inicial
        }
    }, [contacts, initialEmail, initialPhone, initialVatNo]);


    const handleModalSave = (newValue) => {
        if (modalField === "Email") {
            if (typeof newValue === "object") {
                const { email: newEmail, phoneNumber: newPhone } = newValue;

                if (newEmail) {
                    setEmail(newEmail);
                    // setInitialEmail(newEmail); // atualiza valor inicial também
                }

                if (newPhone) {
                    setPhone(newPhone);
                    // setInitialPhone(newPhone); //mudar aqui talvez !!!!!!!
                }
            }
        } else if (modalField === "VAT No.") {
            setVatNo(newValue);
            // setInitialVatNo(newValue);
        }

        setIsModalOpen(false);
    };

    const [activeKey, setActiveKey] = useState("individual");

    useEffect(() => {
        if (reserva && reserva.hasCompanyVAT === 1) {
            setActiveKey("company");
        } else {
            setActiveKey("individual");
        }
    }, [reserva]);

    useEffect(() => {
        if (companyVATData && Object.keys(companyVATData).length > 0) {
            console.log("companyVATData atualizado, abrindo modal...", companyVATData);
            setOpenModal("edit");
            setIsCVATModalOpen(true);
        }
    }, [companyVATData]);

    const handleLogout = () => {
        router.push("/auth");
    };

    const [termsAndCondPT, setTermsAndCondPT] = useState("");
    const [termsAndCondEN, setTermsAndCondEN] = useState("");
    const [termsAndCondES, setTermsAndCondES] = useState("");

    const [privacyPolicyPT, setPrivacyPolicyPT] = useState("");
    const [privacyPolicyEN, setPrivacyPolicyEN] = useState("");
    const [privacyPolicyES, setPrivacyPolicyES] = useState("");

    const [miniTermsPT, setMiniTermsPT] = useState("");
    const [miniTermsEN, setMiniTermsEN] = useState("");
    const [miniTermsES, setMiniTermsES] = useState("");

    console.log(termsAndCondEN, termsAndCondES, termsAndCondPT, privacyPolicyEN, privacyPolicyES, privacyPolicyPT);
    // Novos estados dinâmicos para exibir o conteúdo com base no idioma
    const [termsToDisplay, setTermsToDisplay] = useState("");
    const [privacyToDisplay, setPrivacyToDisplay] = useState("");

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            console.log("PROPERTYID: ", propertyID);
            if (!propertyID) return;

            console.log("Idioma atual (locale):", locale);

            try {
                const response = await axios.get(`/api/properties/hotelTerms/${propertyID}`);
                const property = response.data.response[0];
                console.log("Detalhes da propriedade:", property);
                if (property) {
                    const {
                        termsAndCondPT,
                        termsAndCondEN,
                        termsAndCondES,
                        privacyPolicyPT,
                        privacyPolicyEN,
                        privacyPolicyES,
                        miniTermsPT,
                        miniTermsEN,
                        miniTermsES,
                    } = property;

                    // Atualiza os estados base (caso precise)
                    setTermsAndCondPT(termsAndCondPT);
                    setTermsAndCondEN(termsAndCondEN);
                    setTermsAndCondES(termsAndCondES);
                    setPrivacyPolicyPT(privacyPolicyPT);
                    setPrivacyPolicyEN(privacyPolicyEN);
                    setPrivacyPolicyES(privacyPolicyES);
                    setMiniTermsPT(miniTermsPT);
                    setMiniTermsEN(miniTermsEN);
                    setMiniTermsES(miniTermsES);

                    // Atualiza os textos com base no idioma
                    const terms =
                        locale === "en" ? termsAndCondEN :
                            locale === "es" ? termsAndCondES :
                                termsAndCondPT;

                    const privacy =
                        locale === "en" ? privacyPolicyEN :
                            locale === "es" ? privacyPolicyES :
                                privacyPolicyPT;

                    setTermsToDisplay(terms);
                    setPrivacyToDisplay(privacy);
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes da propriedade:", error.message);
            }
        };

        fetchPropertyDetails();
    }, [propertyID, locale]);

    useEffect(() => {
        if (locale === "en") {
            setHotelTerms(miniTermsEN);
        } else if (locale === "pt") {
            setHotelTerms(miniTermsPT);
        } else {
            setHotelTerms(miniTermsES);
        }
    }, [locale, miniTermsEN, miniTermsPT, miniTermsES]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        if (isNaN(d)) return "";

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        console.log("🧩 Estado atual de newCompany:", newCompany);
    }, [newCompany]);

    // const handleChange = (field, value) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         [field]: value,
    //     }));
    // };

    const handleSaveMissing = () => {
        if (!rating) {
            // usuário não avaliou → abre o modal
            setShowRatingModal(true);
            return;
        }
        // Cria cópias dos states atuais
        let updatedGuestInfo = { ...guestInfo };
        let updatedAddressData = { ...addressData };
        let updatedPersonalIDData = { ...personalIDData };
        let updatedContactsData = { ...contacts };
        let updatedCompanyData = { ...reserva };

        // Atualiza os campos que estavam em falta
        missingFields.forEach((field) => {
            const value = missingValues[field.key] ?? "";

            switch (field.target) {
                case "guestInfo":
                    updatedGuestInfo[field.key] = value;
                    break;

                case "addressData":
                    updatedAddressData[field.key] = value;
                    break;

                case "personalIDData":
                    updatedPersonalIDData[field.key] = value;
                    break;

                case "contacts":
                    updatedContactsData[field.key] = value;
                    break;

                case "reserva":
                    updatedCompanyData[field.key] = value;
                    break;
            }
        });

        // Garantir que Country e CountryID são sempre atualizados
        if (missingValues["Country"]) {
            updatedAddressData["Country"] = missingValues["Country"];
        }
        if (missingValues["CountryID"]) {
            updatedAddressData["CountryID"] = missingValues["CountryID"];
        }
        if (missingValues["CountryOfBirth"]) {
            updatedPersonalIDData["CountryOfBirth"] = missingValues["CountryOfBirth"];
        }
        if (missingValues["CountryOfBirthID"]) {
            updatedPersonalIDData["CountryOfBirthID"] = missingValues["CountryOfBirthID"];
        }
        if (missingValues["Nationality"]) {
            updatedPersonalIDData["Nationality"] = missingValues["Nationality"];
        }
        if (missingValues["NationalityID"]) {
            updatedPersonalIDData["NationalityID"] = missingValues["NationalityID"];
        }
        if (missingValues["IDDoc"]) {
            updatedPersonalIDData["IDDoc"] = missingValues["IDDoc"];
        }
        if (missingValues["IDDocID"]) {
            updatedPersonalIDData["IDDocID"] = missingValues["IDDocID"];
        }
        if (missingValues["DateOfBirth"]) {
            updatedPersonalIDData["DateOfBirth"] = missingValues["DateOfBirth"];
        }
        if (missingValues["email"]) {
            updatedContactsData["email"] = missingValues["email"];
        }
        if (missingValues["phone"]) {
            updatedContactsData["phone"] = missingValues["phone"];
        }
        if (missingValues["vatNo"]) {
            updatedContactsData["vatNo"] = missingValues["vatNo"];
        }
        if (missingValues["CompanyName"]) {
            updatedCompanyData["CompanyName"] = missingValues["CompanyName"];
        }
        if (missingValues["CompanyVatNo"]) {
            updatedCompanyData["CompanyVatNo"] = missingValues["CompanyVatNo"];
        }

        // Atualiza os states de forma síncrona
        flushSync(() => {
            setGuestInfo(updatedGuestInfo);
            setAddressData(updatedAddressData);
            setPersonalIDData(updatedPersonalIDData);
            setContacts(updatedContactsData);
            setPersonalID(updatedPersonalIDData);
            setReserva(updatedCompanyData);
            setIsMissingFieldsModalOpen(false);
        });

        // Continua o fluxo normal após guardar
        handleOkClick({
            skipMissingCheck: true,
            guestInfo: updatedGuestInfo,
            addressData: updatedAddressData,
            personalIDData: updatedPersonalIDData,
            contacts: updatedContactsData,
            reserva: updatedCompanyData
        });
    };

    const [countryOptions, setCountryOptions] = useState([]);
    const [docTypeOptions, setDocTypeOptions] = useState([]);
    // const [countryIDSelected, setCountryIDSelected] = useState(() => ({
    //     CountryID: ""
    // }));

    //useEffect para popular countryOptions
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                if (!propertyID) {
                    console.log("Não há propertyID associado", propertyID);
                }
                const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
                const formattedOptions = response.data
                    .map((country) => ({
                        value: country.codenr,
                        label: country.land,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountryOptions(formattedOptions);
            } catch (error) {
                console.error("Erro ao buscar países:", error);
            }
        };
        fetchCountries();
    }, [propertyID]);

    // Buscar tipos de documento
    useEffect(() => {
        const fetchDocTypes = async () => {
            if (!propertyID) return;
            try {
                const response = await axios.get(
                    `/api/reservations/checkins/registrationForm/doctypes?propertyID=${propertyID}`
                );

                // Garante que value = ID/tipo e label = nome do documento
                const options = response.data
                    .map(d => ({ value: d.value, label: d.label }))
                    .sort((a, b) => a.label.localeCompare(b.label));

                setDocTypeOptions(options);
            } catch (error) {
                console.error("Erro ao buscar tipos de documentos:", error);
            }
        };
        fetchDocTypes();
    }, [propertyID]);

    const [missingDobError, setMissingDobError] = useState("");
    const missingDobRef = useRef();

    // Converte string "aaaa/mm/dd" para Date
    const parseDate = (value) => {
        if (!value || typeof value !== "string") return null;

        const parts = value.split("-");
        if (parts.length !== 3) return null;

        const [yyyy, mm, dd] = parts;

        const year = Number(yyyy);
        const month = Number(mm);
        const day = Number(dd);

        // Verifica se os números são válidos
        if (!year || !month || !day) return null;

        // Cria a data
        const date = new Date(year, month - 1, day);

        // Verifica se a data é REAL
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null; // ⚠ Se a data não é válida → devolve null
        }

        return date;
    };

    const [selectedType, setSelectedType] = useState("individual");

    const [rating, setRating] = useState(0);       // Estrelas selecionadas
    const [hover, setHover] = useState(0);         // Efeito hover (opcional)

    // const checkRequiredFields = (fields) => {
    //     return fields.every(field => {
    //         if (!field.value || field.value.toString().trim() === "") {
    //             return false;
    //         }
    //         return true;
    //     });
    // };

    // const handleFieldChange = (key, value) => {
    //     setMissingValues(prev => {
    //         const updated = { ...prev, [key]: value };
    //         // revalida todos os campos obrigatórios
    //         const allFilled = requiredFields.every(f => updated[f.key] && updated[f.key].toString().trim() !== "");
    //         setIsOkEnabled(allFilled);
    //         return updated;
    //     });
    // };

    const [isOkEnabled, setIsOkEnabled] = useState(false);
    useEffect(() => {
        if (!requiredFields || requiredFields.length === 0) return;

        const mandatoryFields = requiredFields.filter(f => f.required);

        const missing = mandatoryFields
            .filter(f => {
                const v = missingValues[f.key];
                return v === undefined || v === null || v === "";
            })
            .map(f => f.key);

        setMissingFields(missing);
        setIsOkEnabled(missing.length === 0);

        console.log("Campos obrigatórios em falta:", missing);
    }, [missingValues, requiredFields]);

    return (
        <div className='bg-background main-page min-h-screen'>
            {/* Exibe o loader enquanto isLoading for verdadeiro */}
            {isLoading ? (
                <LoadingBackdrop open={true} />
            ) : (
                <>
                    <div className="pt-2 px-4 flex justify-between flag-position items-center">
                        <div className='text-textPrimaryColor'>{hotelName}</div>
                        <div className='text-textPrimaryColor flex flex-row gap-2 items-center'>
                            <p>{t.frontOffice.registrationForm.title}</p>
                        <IoReader 
                        onClick={lerCartaoCidadao}
                        />

                        </div>
                        <div className="flex flex-row gap-8 items-center language-row">
                            <div
                                className={`flag ${activeFlag === 'pt' ? 'active' : 'inactive'}`}
                                onClick={() => handleLanguageChange('pt')}
                            >
                                <img
                                    src="/flags/pt.png"
                                    alt="portuguese"
                                    className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                />
                            </div>
                            <div
                                className={`flag ${activeFlag === 'es' ? 'active' : 'inactive'}`}
                                onClick={() => handleLanguageChange('es')}
                            >
                                <img
                                    src="/flags/sp.png"
                                    alt="spanish"
                                    className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                />
                            </div>
                            <div
                                className={`flag ${activeFlag === 'usa-uk' ? 'active' : 'inactive'}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                <img
                                    src="/flags/uk.png"
                                    alt="english"
                                    className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                />
                            </div>
                        </div>

                        {/* Combo Box with Flag Images */}
                        <div className="ml-4 relative language-combobox">
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <img
                                    src={`/flags/${activeFlag === 'usa-uk' ? 'uk.png' : activeFlag === 'pt' ? 'pt.png' : 'sp.png'}`}
                                    alt={activeFlag}
                                    className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                />
                            </div>
                            
                            {dropdownOpen && (
                                <div className="absolute mt-2 bg-white border rounded shadow-lg">
                                    <div
                                        className="flex items-center p-2 cursor-pointer"
                                        onClick={() => handleLanguageChange('pt')}
                                    >
                                        <img
                                            src="/flags/pt.png"
                                            alt="portuguese"
                                            className="w-8 h-8 object-cover rounded-full"
                                        />
                                        <span className="ml-2">Portuguese</span>
                                    </div>
                                    <div
                                        className="flex items-center p-2 cursor-pointer"
                                        onClick={() => handleLanguageChange('es')}
                                    >
                                        <img
                                            src="/flags/es.png"
                                            alt="spanish"
                                            className="w-8 h-8 object-cover rounded-full"
                                        />
                                        <span className="ml-2">Spanish</span>
                                    </div>
                                    <div
                                        className="flex items-center p-2 cursor-pointer"
                                        onClick={() => handleLanguageChange('en')}
                                    >
                                        <img
                                            src="/flags/uk.png"
                                            alt="english"
                                            className="w-8 h-8 object-cover rounded-full"
                                        />
                                        <span className="ml-2">English</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Divisão de tela  */}
                    <div className='flex flex-row mt-1 screen-division'>
                        {reserva && guestInfo && address && personalID && contacts && (
                            <div className='w-1/2 ml-4 mr-4 half-screen'>
                                <div className='flex flex-row details-on-screen'>
                                    {/** Dados de Morada */}
                                    <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
                                        <div className='flex flex-row items-center'>
                                            <h3 className='text-[#f7ba83]'>{t.frontOffice.registrationForm.stayDetails}</h3>
                                            <IoIosArrowForward size={20} color='#f7ba83' />
                                            <h3 className='text-[#f7ba83]'>{t.frontOffice.registrationForm.resNo}: {reserva.ResNo}</h3>
                                        </div>
                                        {/** Info do quarto */}
                                        <div className='flex flex-row gap-4 mt-2'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"room"}
                                                name={"Room"}
                                                label={t.frontOffice.registrationForm.room}
                                                ariaLabel={"Room:"}
                                                value={reserva.Room}
                                                style={halfInputStyle}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"roomType"}
                                                name={"roomType"}
                                                label={t.frontOffice.registrationForm.roomType}
                                                ariaLabel={"Room Type:"}
                                                value={reserva.RoomType}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                            <div className='flex flex-row gap-2'>
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"Adults"}
                                                    name={"Adults"}
                                                    label={t.frontOffice.registrationForm.adults}
                                                    ariaLabel={"Adults:"}
                                                    value={reserva.Adults}
                                                    style={`${halfInputStyle}`}
                                                    disabled
                                                />
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"Childs"}
                                                    name={"Childs"}
                                                    label={t.frontOffice.registrationForm.childs}
                                                    ariaLabel={"Childs:"}
                                                    value={reserva.Childs}
                                                    style={halfInputStyle}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-between mt-2'>
                                            <InputFieldControlled
                                                type={"date"}
                                                id={"Arrival"}
                                                name={"Arrival"}
                                                label={t.frontOffice.registrationForm.arrival}
                                                ariaLabel={"Arrival:"}
                                                value={reserva.DateCI}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Nights"}
                                                name={"Nights"}
                                                label={t.frontOffice.registrationForm.nights}
                                                ariaLabel={"Nights:"}
                                                value={nights}
                                                style={halfInputStyle}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"date"}
                                                id={"Departure"}
                                                name={"Departure"}
                                                label={t.frontOffice.registrationForm.departure}
                                                ariaLabel={"Departure:"}
                                                value={reserva.DateCO}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/** Dados de Info pessoal */}
                                    <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 px-4 details-on-screen-card'>
                                        <p className='text-[#f7ba83] mb-1'>{t.frontOffice.registrationForm.priceInfo}</p>
                                        <div className='flex flex-row justify-between items-center gap-4 mt-2'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Rate Code"}
                                                name={"Rate Code"}
                                                label={t.frontOffice.registrationForm.rateCode}
                                                ariaLabel={"Rate Code:"}
                                                value={reserva.RateCode}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"City Tax"}
                                                name={"City Tax"}
                                                label={t.frontOffice.registrationForm.cityTax}
                                                ariaLabel={"City Tax:"}
                                                value={reserva.CityTax}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                        </div>
                                        <div className='flex flex-row justify-between items-center gap-4 mt-2'>
                                            {reserva.toShow === 1 ? (
                                                <>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"Price"}
                                                        name={"Price"}
                                                        label={t.frontOffice.registrationForm.priceNight}
                                                        ariaLabel={"Price:"}
                                                        value={reserva.Price === 0 ? "" : `${reserva.Price.toFixed(2)} €`} // Se Price for 0, exibe como vazio
                                                        style={inputStyleFull}
                                                        disabled
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"Total"}
                                                        name={"Total"}
                                                        label={t.frontOffice.registrationForm.total}
                                                        ariaLabel={"Total:"}
                                                        value={reserva.Total === 0 ? "" : `${reserva.Total.toFixed(2)} €`} // Se Total for 0, exibe como vazio
                                                        style={inputStyleFull}
                                                        disabled
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"Price"}
                                                        name={"Price"}
                                                        label={t.frontOffice.registrationForm.priceNight}
                                                        ariaLabel={"Price:"}
                                                        value={""} // Campos vazios
                                                        style={inputStyleFull}
                                                        disabled
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"Total"}
                                                        name={"Total"}
                                                        label={t.frontOffice.registrationForm.total}
                                                        ariaLabel={"Total:"}
                                                        value={""} // Campos vazios
                                                        style={inputStyleFull}
                                                        disabled
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/** Dados de cliente */}
                                <div className='bg-cardColor py-2 px-2 rounded-lg mt-1'>
                                    <p className='text-[#f7ba83] mb-1'>{t.frontOffice.registrationForm.guestDetails}</p>
                                    <div className='flex flex-row w-full mt-2'>
                                        <div className='mr-4'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Salutation"}
                                                name={"Salutation"}
                                                label={t.frontOffice.registrationForm.salutation}
                                                ariaLabel={"Salutation:"}
                                                value={guestInfo.Salution}
                                                style={"w-10 h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                                disabled
                                            />
                                        </div>
                                        <div className='w-full flex flex-row'>
                                            <div className='w-1/2'>
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"Last Name"}
                                                    name={"Last Name"}
                                                    label={
                                                        <div className='flex align-center gap-1'>
                                                            {t.frontOffice.registrationForm.lastName}
                                                            <span className='text-red-500  font-bold'>*</span>
                                                        </div>
                                                    }
                                                    ariaLabel={"Last Name:"}
                                                    value={guestInfo.LastName}
                                                    style={"w-72 h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                                    disabled
                                                />
                                            </div>
                                            <div className='w-1/2 -ml-2'>
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"First Name"}
                                                    name={"First Name"}
                                                    label={`${t.frontOffice.registrationForm.firstName}`}
                                                    ariaLabel={"First Name:"}
                                                    value={guestInfo.FirstName}
                                                    style={"w-full h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-row details-on-screen'>
                                    {/** Dados de Morada */}
                                    <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 mr-1 relative details-on-screen-card'>
                                        <p className='text-[#f7ba83] mb-1'>{t.frontOffice.registrationForm.address}</p>
                                        <div className='flex flex-col w-full mt-2'>
                                            <div className="absolute top-2 right-2 cursor-pointer z-10">
                                                <FaPencilAlt
                                                    size={15}
                                                    color="orange"
                                                    onClick={() => {
                                                        setisAddressModalOpen(true);
                                                    }}
                                                />
                                            </div>

                                            {isAddressModalOpen && (
                                                <AddressForm

                                                    onClose={() => setisAddressModalOpen(false)}
                                                    onSave={(newAddressData) => {
                                                        console.log("Dados recebidos do AddressForm:", newAddressData);
                                                        setAddressData(newAddressData); // guarda no state addressData
                                                    }}
                                                    address={address}
                                                    profileID={profileID}
                                                    propertyID={propertyID}
                                                    t={t}
                                                />
                                            )}

                                            <InputFieldControlled
                                                type="text"
                                                id="Country"
                                                name="Country"
                                                label={
                                                    <div className='flex align-center gap-1'>
                                                        {t.frontOffice.registrationForm.country}
                                                        <span className='text-red-500  font-bold'>*</span>
                                                    </div>
                                                }
                                                ariaLabel="Country:"
                                                value={addressData?.Country ?? address.Country ?? ""}
                                                style={inputStyleFull}
                                                disabled
                                            />

                                            <InputFieldControlled
                                                type="text"
                                                id="Street Address"
                                                name="Street Address"
                                                label={t.frontOffice.registrationForm.streetAddress}
                                                ariaLabel="Street Address:"
                                                value={addressData?.Street ?? address.Street ?? ""}
                                                style={inputStyleFull}
                                                disabled
                                            />

                                            <InputFieldControlled
                                                type="text"
                                                id="ZIP / Postal Code"
                                                name="ZIP / Postal Code"
                                                label={t.frontOffice.registrationForm.zipPostalCode}
                                                ariaLabel="ZIP / Postal Code:"
                                                value={addressData?.PostalCode ?? address.PostalCode ?? ""}
                                                style={inputStyleFull}
                                                disabled
                                            />

                                            <InputFieldControlled
                                                type="text"
                                                id="City"
                                                name="City"
                                                label={t.frontOffice.registrationForm.city}
                                                ariaLabel="City:"
                                                value={addressData?.City ?? address.City ?? ""}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                            {/* <InputFieldControlled
                                                type={"text"}
                                                id={"State / Province / Region"}
                                                name={"State / Province / Region"}
                                                label={t.frontOffice.registrationForm.stateProvinceRegion}
                                                ariaLabel={"State / Province / Region:"}
                                                value={address.Region}
                                                style={inputStyleFull}
                                            /> */}
                                        </div>
                                    </div>

                                    {/** Dados de Info pessoal */}
                                    <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 px-4 relative details-on-screen-card'>
                                        <p className='text-[#f7ba83] mb-1'>{t.frontOffice.registrationForm.personalId}</p>
                                        <div className='flex flex-row justify-between gap-4 mt-4'>
                                            <div className="absolute top-2 right-2 cursor-pointer z-10">
                                                <FaPencilAlt
                                                    size={15}
                                                    color="orange"
                                                    onClick={() => {
                                                        setisPersonalIDModalOpen(true);
                                                    }}
                                                />
                                            </div>

                                            {isPersonalIDModalOpen && (
                                                <PersonalIDForm
                                                    onClose={() => setisPersonalIDModalOpen(false)}
                                                    onSave={(newPersonalIDData) => {
                                                        console.log("Dados recebidos do modal PersonalID:", newPersonalIDData);
                                                        setPersonalIDData(newPersonalIDData); // armazena no state local
                                                    }}
                                                    personalID={personalID}
                                                    profileID={profileID}
                                                    propertyID={propertyID}
                                                    t={t}
                                                />
                                            )}

                                            <InputFieldControlled
                                                type={
                                                    personalIDData?.DateOfBirth && personalIDData.DateOfBirth.split('T')[0] !== '1900-01-01'
                                                        ? "date"
                                                        : "text"
                                                }
                                                id={"Date of Birth"}
                                                name={"Date of Birth"}
                                                label={
                                                    <div className='flex align-center gap-1'>
                                                        {t.frontOffice.registrationForm.dateOfBirth}
                                                        <span className='text-red-500  font-bold'>*</span>
                                                    </div>
                                                }
                                                ariaLabel={"Date of Birth:"}
                                                value={
                                                    personalIDData?.DateOfBirth === ""
                                                        ? ""
                                                        : personalIDData?.DateOfBirth && personalIDData.DateOfBirth.split('T')[0] !== '1900-01-01'
                                                            ? formatDate(personalIDData.DateOfBirth)
                                                            : personalID.DateOfBirth && personalID.DateOfBirth.split('T')[0] !== '1900-01-01'
                                                                ? personalID.DateOfBirth.split('T')[0]
                                                                : ""
                                                }
                                                style={inputStyleFullWithLine}
                                                disabled
                                            />

                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Country of Birth"}
                                                name={"Country of Birth"}
                                                label={
                                                    <div className='flex align-center gap-1'>
                                                        {t.frontOffice.registrationForm.countryOfBirth}
                                                        <span className='text-red-500  font-bold'>*</span>
                                                    </div>
                                                }
                                                ariaLabel={"Country of Birth:"}
                                                value={personalIDData?.CountryOfBirth ?? personalID.CountryOfBirth}
                                                style={`${inputStyleFullWithLine}`}
                                                disabled
                                            />
                                        </div>
                                        {/* <CountryAutocomplete
                                    label={"Nacionality"}
                                    style={"w-full h-9 -mt-2"}
                                    onChange={(value) => handleSelect(value)}
                                /> */}
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Nationality"}
                                            name={"Nationality"}
                                            label={t.frontOffice.registrationForm.nationality}
                                            ariaLabel={"Nationality:"}
                                            value={personalIDData?.NationalityLabel ?? personalID.Nationality}
                                            style={`${inputStyleFullWithLine}`}
                                            disabled
                                        />
                                        <div className='flex flex-row justify-between items-center gap-4 mt-4'>
                                            {/* <CountryAutocomplete
                                        label={"ID Doc"}
                                        style={"w-32 h-20"}
                                        onChange={(value) => handleSelect(value)}
                                    /> */}
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"ID Doc"}
                                                name={"ID Doc"}
                                                label={
                                                    <div className='flex align-center gap-1'>
                                                        {t.frontOffice.registrationForm.idDoc}
                                                        <span className='text-red-500  font-bold'>*</span>
                                                    </div>
                                                }
                                                ariaLabel={"ID Doc:"}
                                                value={personalIDData?.IDDoc ?? personalID.IDDoc}
                                                style={`${inputStyleFullWithLine}`}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"ID Doc Nr."}
                                                name={"ID Doc Nr."}
                                                label={
                                                    <div className='flex align-center gap-1'>
                                                        {t.frontOffice.registrationForm.idDocNumber}
                                                        <span className='text-red-500  font-bold'>*</span>
                                                    </div>
                                                }
                                                ariaLabel={"ID Doc Nr.:"}
                                                value={personalIDData?.NrDoc ?? personalID.NrDoc}
                                                style={`${inputStyleFullWithLine}`}
                                                disabled
                                            />
                                        </div>
                                        <div className='flex flex-row justify-between gap-4 mt-4'>
                                            <InputFieldControlled
                                                type={
                                                    personalIDData?.ExpDate
                                                        ? "date"
                                                        : "text"
                                                }
                                                id={"Exp. Date"}
                                                name={"Exp. Date"}
                                                label={t.frontOffice.registrationForm.expDate}
                                                ariaLabel={"Exp. Date:"}
                                                value={
                                                    personalIDData?.ExpDate
                                                        ? formatDate(personalIDData.ExpDate)
                                                        : personalID?.ExpDate //&& personalID.ExpDate.split('T')[0] !== '2050-12-31'
                                                            ? personalID.ExpDate.split('T')[0]
                                                            : ""
                                                }
                                                style={inputStyleFullWithLine}
                                                disabled
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Country issue"}
                                                name={"Country issue"}
                                                label={t.frontOffice.registrationForm.issue}
                                                ariaLabel={"Country issue:"}
                                                value={personalIDData?.Issue ?? personalID.Issue}
                                                style={inputStyleFullWithLine}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row details-on-screen">
                                    {/** Dados de contacto */}
                                    <div className="w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card">
                                        <div className="flex flex-row justify-between">
                                            <p className="text-[#f7ba83] mb-1">{t.frontOffice.registrationForm.contacts}</p>
                                            <div className="flex flex-row justify-end gap-4">
                                                <FaPencilAlt
                                                    size={15}
                                                    color="orange"
                                                    onClick={() => {
                                                        setModalField("Email"); // Define o campo em edição
                                                        setIsModalOpen(true); // Abre o modal
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <div className="flex flex-row justify-between items-center w-full">
                                                <div className="flex-grow">
                                                    <InputFieldControlled
                                                        type="text"
                                                        id="Email"
                                                        name="Email"
                                                        label={t.frontOffice.registrationForm.personalEmail}
                                                        ariaLabel="Email:"
                                                        value={email}
                                                        style={inputStyleFull}
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            <InputFieldControlled
                                                type="text"
                                                id="PhoneNumber"
                                                name="PhoneNumber"
                                                label={t.frontOffice.registrationForm.phoneNumber}
                                                ariaLabel="PhoneNumber:"
                                                value={phone}
                                                style={inputStyleFull}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/** Dados de faturação */}
                                    <div className="w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 details-on-screen-card">
                                        <div className="flex flex-row justify-between gap-4">
                                            <div className='flex justify-start gap-6'>
                                                <p className="text-[#f7ba83] mb-1">{t.frontOffice.registrationForm.invoiceData}</p>
                                                <div className="flex flex-row justify-center bg-gray-100 w-34 h-8 rounded-xl items-center -mt-1">
                                                    <div
                                                        onClick={() => setActiveKey("individual")}
                                                        className={`cursor-pointer p-2 ${activeKey === "individual" ? "h-6 flex items-center bg-white text-black rounded-lg m-0.5 text-xs text-bold border border-gray-200" : "text-gray-500 m-1 text-xs"}`}
                                                    >
                                                        Individual
                                                    </div>
                                                    <div
                                                        onClick={() => setActiveKey("company")}
                                                        className={`cursor-pointer p-2 ${activeKey === "company" ? "h-6 flex items-center bg-white text-black rounded-lg m-0.5 text-xs text-bold border border-gray-200" : "text-gray-500 m-1 text-xs"}`}
                                                    >
                                                        Company
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {activeKey === "individual" && (
                                                    <FaPencilAlt
                                                        size={15}
                                                        color={reserva.BlockedVatNO === 1 ? "gray" : "#FC9D25"}
                                                        style={{ cursor: reserva.BlockedVatNO === 1 ? "not-allowed" : "pointer" }}
                                                        title={reserva.BlockedVatNO === 1 ? "Fiscalizado" : ""}
                                                        onClick={() => {
                                                            if (reserva.BlockedVatNO === 0) {
                                                                setModalField("VAT No."); // Define o campo em edição
                                                                setIsModalOpen(true); // Abre o modal
                                                            }
                                                        }}
                                                    />
                                                )}

                                                {activeKey === "company" && (
                                                    reserva.hasCompanyVAT === 1 ? (
                                                        <FaPencilAlt
                                                            size={15}
                                                            color={(reserva.BlockedCVatNO) === 1 ? "gray" : "#FC9D25"}
                                                            style={{ cursor: (reserva.BlockedCVatNO) === 1 ? "not-allowed" : "pointer" }}
                                                            title={(reserva.BlockedCVatNO) === 1 ? "Fiscalizado" : ""}
                                                            onClick={() => {
                                                                console.log("BlockedCVatNO:", reserva.BlockedCVatNO);
                                                                console.log("hasCompanyVAT:", reserva.hasCompanyVAT);
                                                                if ((reserva.BlockedCVatNO) === 0) {
                                                                    const companyData = {
                                                                        companyName: reserva.Company || "",
                                                                        vatNo: reserva.CompanyVatNo || "",
                                                                        emailAddress: reserva.CompanyEmail || "",
                                                                        country: reserva.CompanyCountryID || "",
                                                                        streetAddress: reserva.CompanyStreetAddress || "",
                                                                        zipCode: reserva.CompanyZipCode || "",
                                                                        city: reserva.CompanyCity || "",
                                                                        state: reserva.CompanyState || "",
                                                                    };

                                                                    console.log("Definindo companyVATData:", companyData);
                                                                    setCompanyVATData(companyData);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <FaPlusCircle
                                                            size={20}
                                                            color="#FC9D25"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setOpenModal("search");
                                                                setIsCVATModalOpenInsert(true); // Abre o modal
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="!text-textLabelColor text-lg">
                                                {activeKey === "company"
                                                    ? (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1)
                                                        ? (newCompany?.companyName || reserva.Company || "")
                                                        : ""
                                                    : `${guestInfo.LastName}, ${guestInfo.FirstName}`}
                                            </p>
                                            <div className="mt-4">
                                                <InputFieldControlled
                                                    type="text"
                                                    id="VAT Nr."
                                                    name="VAT Nr."
                                                    label={t.frontOffice.registrationForm.vatNr}
                                                    ariaLabel="VAT Nr.:"
                                                    value={
                                                        activeKey === "company"
                                                            ? (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1)
                                                                ? (newCompany?.vatNo || reserva.CompanyVatNo || "")
                                                                : ""
                                                            : reserva.BlockedVatNO === 1 && !vatNo
                                                                ? "999999990"
                                                                : vatNo
                                                    }
                                                    style={inputStyleFull}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/** Modal Dinâmico */}
                                    {isModalOpen && (
                                        <EditRegistrationForm
                                            currentLabel={modalField === "Email" ? "E-mail" : "VAT No."}
                                            currentValue={modalField === "Email" ? email : vatNo}
                                            additionalValue={modalField === "Email" ? phone : undefined}
                                            validation={
                                                modalField === "Email"
                                                    ? (value) => !value.endsWith("@guest.booking.com")
                                                    : null
                                            }
                                            onSave={handleModalSave}
                                            onClose={() => setIsModalOpen(false)}
                                        />
                                    )}

                                    {/** Modal Dinâmico */}
                                    {isCVATModalOpen && (
                                        // <CompanyVATFormEdit
                                        //     onClose={() => setIsCVATModalOpen(false)}
                                        //     onSave={(newData) => {
                                        //         console.log("Dados finais vindos de BeforeCompanyVat:", newData);
                                        //         setNewCompany({
                                        //             companyName: newData.companyName,
                                        //             companyID: newData.companyID,
                                        //             vatNo: newData.vatNo,
                                        //             emailAddress: newData.emailAddress,
                                        //             countryName: newData.countryName,
                                        //             streetAddress: newData.streetAddress,
                                        //             zipCode: newData.zipCode,
                                        //             city: newData.city,
                                        //             state: newData.state,
                                        //             hasCompanyVAT: 1,
                                        //             BlockedCVatNO: 0,
                                        //             profileID: guestInfo.ProfileID,
                                        //             propertyID: propertyID,
                                        //             resNo: reserva.ResNo,
                                        //             OldCompanyID: reserva.CompanyID
                                        //         });
                                        //     }}
                                        //     profileID={guestInfo.ProfileID}
                                        //     propertyID={propertyID}
                                        //     initialData={companyVATData}
                                        //     resNo={reserva.ResNo}
                                        //     companyID={reserva.CompanyID}
                                        //     companyVATData={companyVATData}
                                        //     OldCompanyID={reserva.CompanyID}
                                        // />
                                        <MultiModalManager
                                            openModal={openModal}
                                            setOpenModal={setOpenModal}
                                            propertyID={propertyID}
                                            profileID={guestInfo.ProfileID}
                                            resNo={reserva.ResNo}
                                            companyID={reserva.CompanyID}
                                            companyData={companyVATData}
                                            onSave={(payload) => setNewCompany(payload)}
                                        />
                                    )}

                                    {isCVATModalOpenInsert && (
                                        // <BeforeCompanyVat
                                        //     onClose={() => setIsCVATModalOpenInsert(false)}
                                        //     onSave={(newData) => {
                                        //         console.log("Dados finais vindos de BeforeCompanyVat:", newData);
                                        //         setNewCompany({
                                        //             companyName: newData.companyName,
                                        //             companyID: newData.companyID,
                                        //             vatNo: newData.vatNo,
                                        //             emailAddress: newData.emailAddress,
                                        //             countryName: newData.countryName,
                                        //             streetAddress: newData.streetAddress,
                                        //             zipCode: newData.zipCode,
                                        //             city: newData.city,
                                        //             state: newData.state,
                                        //             hasCompanyVAT: 1,
                                        //             BlockedCVatNO: 0,
                                        //             profileID: guestInfo.ProfileID,
                                        //             propertyID: propertyID,
                                        //             resNo: reserva.ResNo,
                                        //             OldCompanyID: reserva.CompanyID
                                        //         });
                                        //     }}
                                        //     profileID={guestInfo.ProfileID}
                                        //     propertyID={propertyID}
                                        //     resNo={reserva.ResNo}
                                        //     OldCompanyID={reserva.CompanyID}
                                        // />
                                        <MultiModalManager
                                            openModal={openModal}
                                            setOpenModal={setOpenModal}
                                            propertyID={propertyID}
                                            profileID={guestInfo.ProfileID}
                                            resNo={reserva.ResNo}
                                            companyID={reserva.CompanyID}
                                            onSave={(payload) => {
                                                // force hasCompanyVAT to 1 on insert
                                                setNewCompany({
                                                    ...payload,
                                                    hasCompanyVAT: 1,
                                                    BlockedCVatNO: 0,
                                                    OldCompanyID: reserva.CompanyID,
                                                    profileID: guestInfo.ProfileID,
                                                    propertyID: propertyID,
                                                    resNo: reserva.ResNo,
                                                });

                                                // Also update reserva locally if needed
                                                reserva.hasCompanyVAT = 1;
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        <div className='w-1/2 ml-4 mr-4 half-screen'>
                            {/** Assinatura */}
                            <div className='bg-cardColor py-2 px-2 rounded-lg'>
                                <p className='text-[#f7ba83] mb-1'>{t.frontOffice.registrationForm.signature}</p>
                                {/* Termos e condições */}
                                <div className='flex flex-row mt-2 gap-8 details-on-screen'>
                                    <div className='w-1/2 flex flex-col details-on-screen-card'>
                                        <p className='text-xs font-semibold text-textPrimaryColor'>{t.frontOffice.registrationForm.acceptTerms}:</p>
                                        <div className='flex flex-row justify-between text-sm text-textPrimaryColor'>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="terms"
                                                    className="mr-2"
                                                    checked={termsAccepted === true}
                                                    onChange={() => setTermsAccepted(true)}
                                                />
                                                {t.frontOffice.registrationForm.agree}
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="terms"
                                                    className="mr-2"
                                                    checked={termsAccepted === false}
                                                    onChange={() => setTermsAccepted(false)}
                                                />
                                                {t.frontOffice.registrationForm.disagree}
                                            </label>
                                            <TermsConditionsForm
                                                buttonName={t.frontOffice.registrationForm.readMore}
                                                modalHeader={t.frontOffice.registrationForm.termsModalHeader}
                                                formTypeModal={11}
                                                content={termsToDisplay}
                                            />
                                        </div>
                                    </div>

                                    <div className='w-1/2 flex flex-col details-on-screen-card'>
                                        <p className='text-xs font-semibold text-textPrimaryColor'>{t.frontOffice.registrationForm.acceptHotelDataProtection}:</p>
                                        <div className='flex flex-row justify-between text-sm text-textPrimaryColor'>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="policy"
                                                    className="mr-2"
                                                    checked={policyAccepted === true}
                                                    onChange={() => setPolicyAccepted(true)}
                                                />
                                                {t.frontOffice.registrationForm.agree}
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="policy"
                                                    className="mr-2"
                                                    checked={policyAccepted === false}
                                                    onChange={() => setPolicyAccepted(false)}
                                                />
                                                {t.frontOffice.registrationForm.disagree}
                                            </label>
                                            <ProtectionPolicyForm
                                                buttonName={t.frontOffice.registrationForm.readMore}
                                                modalHeader={t.frontOffice.registrationForm.dataModalHeader}
                                                formTypeModal={11}
                                                content={privacyToDisplay}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Área para assinatura digital */}
                                <div className='mt-2'>
                                    <div className='border-2 border-gray-300 py-2 px-2'>
                                        <div className='flex justify-end'>
                                            <button
                                                onClick={clearSignature}
                                            >
                                                <GiCancel size={20} color='orange' />
                                            </button>
                                        </div>
                                        <canvas
                                            ref={canvasRef}
                                            className='w-full h-32'
                                        ></canvas>
                                    </div>
                                </div>
                                {/* Mensagem de Erro */}
                                {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                            </div>
                            <p className='text-xs text-gray-500 mt-4 text-justify text-style mr-4'>
                                {hotelTerms}
                            </p>
                            <div className='flex flex-row justify-between items-center mt-4 buttons-style'>
                                <button
                                    onClick={toggleTheme}
                                    className="relative w-20 h-8 flex items-center bg-gray-300 rounded-full transition"
                                >
                                    {/* Ícone do Sol - lado esquerdo */}
                                    <div
                                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 transition ${isDarkMode ? "opacity-100 text-gray-400" : "opacity-0"
                                            }`}
                                    >
                                        <MdSunny size={18} />
                                    </div>

                                    {/* Ícone da Lua - lado direito */}
                                    <div
                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition ${isDarkMode ? "opacity-0" : "opacity-100 text-gray-400"
                                            }`}
                                    >
                                        <FaMoon size={18} />
                                    </div>

                                    {/* Bolinha Deslizante */}
                                    <span
                                        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition ${isDarkMode ? "translate-x-12" : "translate-x-0"
                                            } flex items-center justify-center z-10`}
                                    >
                                        {/* Ícone dentro da Bolinha */}
                                        {isDarkMode ? (
                                            <FaMoon size={14} className="text-orange-400" />
                                        ) : (
                                            <MdSunny size={14} className="text-orange-400" />
                                        )}
                                    </span>
                                </button>

                                {isInternalUser ? (
                                    <div className='flex flex-row gap-4 justify-end px-4 buttons-style items-center'>
                                        {/** Botão de cancelar - Faz logout ao clicar */}
                                        <button
                                            className='bg-danger font-semibold text-white py-2 px-2 rounded-lg w-20 h-10'
                                            onClick={handleLogout}
                                        >
                                            Cancelar
                                        </button>

                                        {/** Botão de aceitar - Faz logout ao clicar */}
                                        <button
                                            className='bg-primary font-semibold text-white py-2 px-2 rounded-lg w-20 h-10'
                                            onClick={handleLogout}
                                        >
                                            Ok
                                        </button>
                                    </div>
                                ) : (
                                    <div className='flex flex-row gap-4 justify-end px-4 buttons-style items-center'>
                                        {/** Botão de cancelar */}
                                        <CancelPIN
                                            buttonName={t.frontOffice.registrationForm.cancel}
                                            modalHeader={"Insert PIN"}
                                            formTypeModal={11}
                                            editor={"teste"}
                                        />

                                        {/** Botão de aceitar */}
                                        <button
                                            onClick={handleOkClick}
                                            disabled={isSubmitting}
                                            className={`bg-primary font-semibold text-white py-2 px-4 rounded-lg w-20 h-10 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {isSubmitting ? "OK" : "OK"}
                                        </button>


                                        {/** Modal de erro */}
                                        {isErrorModalOpen && errorMessage && (
                                            <ErrorRegistrationForm
                                                modalHeader={t.frontOffice.registrationForm.attention}
                                                errorMessage={errorMessage}
                                                onClose={() => setIsErrorModalOpen(false)}
                                            />
                                        )}

                                        {/** Modal de sucesso */}
                                        {isSuccessModalOpen && successMessage && (
                                            <SuccessRegistrationForm
                                                modalHeader={t.frontOffice.registrationForm.attention}
                                                successMessage={successMessage}
                                            />
                                        )}

                                        {isMissingFieldsModalOpen && (
                                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl">

                                                    {/* HEADER */}
                                                    <div className="flex items-center justify-between p-4 border-b bg-primary rounded-t-xl">
                                                        <h2 className="font-bold text-white">{t.frontOffice.registrationForm.errors.pleaseFill}</h2>
                                                        <button
                                                            onClick={() => setIsMissingFieldsModalOpen(false)}
                                                            className="text-white hover:text-gray-200"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    {/* CONTENT */}
                                                    <div className="p-4 grid grid-cols-6 gap-2 h-full -mt-2">

                                                        <div className="col-span-5 space-y-6 h-full">

                                                            {/* ✔️ LINHA 1 + 2 COM BOTÃO ANTES */}
                                                            <div className="gap-2 items-end flex flex-col bg-gray-100 p-1 rounded-lg w-full">

                                                                {/* Container cinzento (inputs linha 1 e 2) */}
                                                                {/* <div className="row-span-2 grid grid-cols-3 gap-y-0.25 gap-2 bg-gray-100 p-2 rounded-lg"> */}
                                                                {/* --- COLUNA 1: DateOfBirth (completo) --- */}
                                                                <div className='flex flex-row gap-2 w-full justify-between'>
                                                                    <div className="gap-2 flex-1">
                                                                        <p className='text-xs text-gray-500'>{t.frontOffice.registrationForm.dateOfBirth}</p>
                                                                        <div className="flex items-center gap-2 w-full">

                                                                            <input
                                                                                type="text"
                                                                                className={`border rounded-md px-2 py-1 w-full 
                                                                                ${missingDobError ? "border-red-500" : "border-gray-300"}
                                                                                ${!missingValues["DateOfBirth"] ? "border-red-500" : "border-gray-300"}
                                                                                `}
                                                                                placeholder={
                                                                                    requiredFields.find(f => f.key === "DateOfBirth")?.label || "aaaa-mm-dd"
                                                                                }
                                                                                value={missingValues["DateOfBirth"] ?? ""}
                                                                                maxLength={10}
                                                                                onChange={(e) => {
                                                                                    let value = e.target.value.replace(/\D/g, "");

                                                                                    if (value.length > 4 && value.length <= 6) {
                                                                                        value = value.slice(0, 4) + "-" + value.slice(4);
                                                                                    } else if (value.length > 6) {
                                                                                        value =
                                                                                            value.slice(0, 4) +
                                                                                            "-" +
                                                                                            value.slice(4, 6) +
                                                                                            "-" +
                                                                                            value.slice(6, 8);
                                                                                    }

                                                                                    let err = "";

                                                                                    const isValidDate = (y, m, d) => {
                                                                                        const date = new Date(y, m - 1, d);
                                                                                        return (
                                                                                            date.getFullYear() === +y &&
                                                                                            date.getMonth() === m - 1 &&
                                                                                            date.getDate() === +d
                                                                                        );
                                                                                    };

                                                                                    if (value.length === 10) {
                                                                                        const [year, month, day] = value.split("-");

                                                                                        if (!isValidDate(year, month, day)) {
                                                                                            err = t.modals.errors.invalidDate || "Data inválida.";
                                                                                        } else {
                                                                                            const inputDate = new Date(`${year}-${month}-${day}`);
                                                                                            const today = new Date();

                                                                                            if (inputDate > today) {
                                                                                                err =
                                                                                                    t.modals.errors.invalidDate ||
                                                                                                    "A data de nascimento não pode ser superior à data de hoje.";
                                                                                            }
                                                                                        }
                                                                                    }

                                                                                    setMissingDobError(err);
                                                                                    setMissingValues(prev => ({ ...prev, DateOfBirth: value }));
                                                                                }}
                                                                            />

                                                                            <AiOutlineCalendar
                                                                                size={22}
                                                                                className="cursor-pointer text-gray-500 hover:text-orange-500"
                                                                                onClick={() => missingDobRef.current?.setOpen(true)}
                                                                            />
                                                                        </div>

                                                                        {missingDobError && (
                                                                            <p className="text-red-500 text-xs mt-1">{missingDobError}</p>
                                                                        )}

                                                                        <DatePicker
                                                                            ref={missingDobRef}
                                                                            selected={parseDate(missingValues.DateOfBirth) || null}
                                                                            onChange={(date) => {
                                                                                if (!date) {
                                                                                    setMissingValues(prev => ({ ...prev, DateOfBirth: "" }));
                                                                                    setMissingDobError("");
                                                                                    return;
                                                                                }

                                                                                const today = new Date();
                                                                                if (date > today) {
                                                                                    setMissingDobError(t.modals.errors.invalidDate);
                                                                                    return;
                                                                                }

                                                                                const year = date.getFullYear();
                                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                                const day = String(date.getDate()).padStart(2, "0");

                                                                                const formatted = `${year}-${month}-${day}`;

                                                                                setMissingValues(prev => ({ ...prev, DateOfBirth: formatted }));
                                                                                setMissingDobError("");
                                                                            }}
                                                                            dateFormat="yyyy-MM-dd"
                                                                            maxDate={new Date()}
                                                                            className="hidden"
                                                                        />
                                                                    </div>

                                                                    {/* Country */}
                                                                    <div className='flex-1'>
                                                                        <p className='text-xs text-gray-500'>{t.frontOffice.registrationForm.country}</p>
                                                                        <Select
                                                                            options={countryOptions}
                                                                            value={countryOptions.find(
                                                                                option => option.label === missingValues["Country"]
                                                                            )}
                                                                            onChange={(selectedOption) => {

                                                                                console.log("Country changed:", {
                                                                                    selectedLabel: selectedOption.label,
                                                                                    selectedValue: selectedOption.value,
                                                                                    previousLabel: missingValues["Country"],
                                                                                    previousID: missingValues["CountryID"]
                                                                                });

                                                                                setMissingValues(prev => ({
                                                                                    ...prev,
                                                                                    Country: selectedOption.label,
                                                                                    CountryID: selectedOption.value,
                                                                                }));

                                                                                setAddressData(prev => ({
                                                                                    ...prev,
                                                                                    Country: selectedOption.label,
                                                                                    CountryID: selectedOption.value,
                                                                                }));

                                                                                setCountryIDSelected({ CountryID: selectedOption.value });
                                                                            }}
                                                                            isSearchable
                                                                            classNames={{
                                                                                control: (state) =>
                                                                                    `!bg-background !text-textPrimaryColor !border !border-gray-300 !rounded-md 
                                                                                ${!missingValues["Country"] ? "border-red-500" : "border-gray-300"}
                                                                                ${state.isFocused ? '!border-blue-500' : ''
                                                                                    }`,
                                                                                menu: () => '!bg-background !text-textPrimaryColor',
                                                                                option: (state) =>
                                                                                    `!cursor-pointer ${state.isSelected
                                                                                        ? '!bg-primary !text-white'
                                                                                        : state.isFocused
                                                                                            ? '!bg-primary-100 !text-black'
                                                                                            : '!bg-background !text-textPrimaryColor'
                                                                                    }`,
                                                                                singleValue: () => '!text-textPrimaryColor',
                                                                                placeholder: () => '!text-gray-400',
                                                                            }}
                                                                        />
                                                                    </div>



                                                                    {/* CountryOfBirth */}
                                                                    <div className='flex-1'>
                                                                        <p className='text-xs text-gray-500'>{t.frontOffice.registrationForm.countryOfBirth}</p>
                                                                        <Select
                                                                            options={countryOptions}
                                                                            value={countryOptions.find(option => option.label === missingValues["CountryOfBirth"])}
                                                                            onChange={(selectedOption) => {

                                                                                console.log("CountryOfBirth changed:", {
                                                                                    selectedLabel: selectedOption.label,
                                                                                    selectedValue: selectedOption.value,
                                                                                    previousLabel: missingValues["CountryOfBirth"]
                                                                                });

                                                                                setMissingValues(prev => ({
                                                                                    ...prev,
                                                                                    CountryOfBirth: selectedOption.label,
                                                                                    CountryOfBirthID: selectedOption.value,
                                                                                }));

                                                                                setPersonalIDData(prev => ({
                                                                                    ...prev,
                                                                                    CountryOfBirth: selectedOption.label,
                                                                                    CountryOfBirthID: selectedOption.value,
                                                                                }));

                                                                            }}
                                                                            isSearchable
                                                                            classNames={{
                                                                                control: (state) =>
                                                                                    `!bg-background !text-textPrimaryColor !border !border-gray-300 !rounded-md 
                                                                                ${!missingValues["CountryOfBirth"] ? "border-red-500" : "border-gray-300"}
                                                                                ${state.isFocused ? '!border-blue-500' : ''}`,
                                                                                menu: () => '!bg-background !text-textPrimaryColor',
                                                                                option: (state) =>
                                                                                    `!cursor-pointer ${state.isSelected ? '!bg-primary !text-white' : state.isFocused ? '!bg-primary-100 !text-black' : '!bg-background !text-textPrimaryColor'}`,
                                                                                singleValue: () => '!text-textPrimaryColor',
                                                                                placeholder: () => '!text-gray-400',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>


                                                                {/* Linha 2 */}
                                                                {/* IDDoc */}
                                                                <div className='flex flex-row gap-2 w-full justify-between -mt-6'>
                                                                    <div className='flex-1'>
                                                                        <p className='text-xs text-gray-500'>{t.frontOffice.registrationForm.idDoc}</p>
                                                                        <Select
                                                                            options={docTypeOptions}
                                                                            value={docTypeOptions.find(option => option.label === missingValues["IDDoc"])}
                                                                            onChange={(selectedOption) => {

                                                                                console.log("IDDoc changed:", {
                                                                                    selectedLabel: selectedOption.label,
                                                                                    selectedValue: selectedOption.value,
                                                                                    previousLabel: missingValues["IDDoc"]
                                                                                });

                                                                                setMissingValues(prev => ({
                                                                                    ...prev,
                                                                                    IDDoc: selectedOption.label,
                                                                                    IDDocID: selectedOption.value,
                                                                                }));

                                                                                setPersonalIDData(prev => ({
                                                                                    ...prev,
                                                                                    IDDoc: selectedOption.label,
                                                                                    IDDocID: selectedOption.value,
                                                                                }));

                                                                            }}
                                                                            isSearchable
                                                                            classNames={{
                                                                                control: (state) =>
                                                                                    `!bg-background !text-textPrimaryColor !border !border-gray-300 !rounded-md 
                                                                                ${!missingValues["IDDoc"] ? "border-red-500" : "border-gray-300"} 
                                                                                ${state.isFocused ? '!border-blue-500' : ''
                                                                                    }`,
                                                                                menu: () => '!bg-background !text-textPrimaryColor',
                                                                                option: (state) =>
                                                                                    `!cursor-pointer ${state.isSelected
                                                                                        ? '!bg-primary !text-white'
                                                                                        : state.isFocused
                                                                                            ? '!bg-primary-100 !text-black'
                                                                                            : '!bg-background !text-textPrimaryColor'
                                                                                    }`,
                                                                                singleValue: () => '!text-textPrimaryColor',
                                                                                placeholder: () => '!text-gray-400',
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    {/* NrDoc */}
                                                                    <div className='flex-1'>
                                                                        <p className='text-xs text-gray-500'>
                                                                            {t.frontOffice.registrationForm.idDocNumber}
                                                                        </p>

                                                                        <input
                                                                            type="text"
                                                                            className={`border rounded-md px-2 py-1 w-full
                                                                                    ${!missingValues["NrDoc"] ? "border-red-500" : "border-gray-300"}
                                                                                `}
                                                                            placeholder={requiredFields.find(f => f.key === "NrDoc")?.label}
                                                                            value={missingValues["NrDoc"] ?? ""}
                                                                            onChange={(e) =>
                                                                                setMissingValues(prev => ({ ...prev, NrDoc: e.target.value }))
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {/* Nationality */}
                                                                    <div className='flex-1'>
                                                                        <p className='text-xs text-gray-500'>{t.frontOffice.registrationForm.nationality}</p>
                                                                        <Select
                                                                            options={countryOptions}
                                                                            value={countryOptions.find(option => option.label === missingValues["Nationality"])}
                                                                            onChange={(selectedOption) => {

                                                                                console.log("Nationality changed:", {
                                                                                    selectedLabel: selectedOption.label,
                                                                                    selectedValue: selectedOption.value,
                                                                                    previousLabel: missingValues["Nationality"]
                                                                                });

                                                                                setMissingValues(prev => ({
                                                                                    ...prev,
                                                                                    Nationality: selectedOption.label,
                                                                                    NationalityID: selectedOption.value,
                                                                                }));

                                                                                setPersonalIDData(prev => ({
                                                                                    ...prev,
                                                                                    Nationality: selectedOption.label,
                                                                                    NationalityID: selectedOption.value,
                                                                                }));

                                                                            }}
                                                                            isSearchable
                                                                            classNames={{
                                                                                control: (state) =>
                                                                                    `!bg-background !text-textPrimaryColor !border !border-gray-300 !rounded-md 
                                                                                ${!missingValues["Nationality"] ? "border-red-500" : "border-gray-300"}
                                                                                ${state.isFocused ? '!border-blue-500' : ''}`,
                                                                                menu: () => '!bg-background !text-textPrimaryColor',
                                                                                option: (state) =>
                                                                                    `!cursor-pointer ${state.isSelected ? '!bg-primary !text-white' : state.isFocused ? '!bg-primary-100 !text-black' : '!bg-background !text-textPrimaryColor'}`,
                                                                                singleValue: () => '!text-textPrimaryColor',
                                                                                placeholder: () => '!text-gray-400',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* ✔️ LINHA 3 */}
                                                            <div className=" gap-2 items-end">

                                                                {/* Container cinzento com inputs */}
                                                                <div className="bg-gray-100 p-1 rounded-lg flex gap-4 -mt-5">

                                                                    {/* EMAIL */}
                                                                    <div className="flex flex-row gap-2 items-center w-4/6">
                                                                        <MdEmail size={20} color='gray' />
                                                                        <input
                                                                            type="text"
                                                                            className="border rounded-md px-2 py-1 w-full"
                                                                            placeholder={requiredFields.find(f => f.key === "email")?.label}
                                                                            value={missingValues["email"] ?? ""}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                setMissingValues(prev => ({ ...prev, email: value }));
                                                                                setContacts(prev => ({ ...prev, email: value }));
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    {/* PHONE*/}
                                                                    <div className="w-2/6 flex flex-row gap-2 items-center">
                                                                        <FaPhone size={15} color='gray' />
                                                                        <input
                                                                            type="text"
                                                                            className="border rounded-md px-2 py-1 w-full"
                                                                            placeholder={requiredFields.find(f => f.key === "phone")?.label}
                                                                            value={missingValues["phone"] ?? ""}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                setMissingValues(prev => ({ ...prev, phone: value }));
                                                                                setContacts(prev => ({ ...prev, phone: value }));
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </div>

                                                            {/* ✔️ LINHA 4 + LINHA 5 AGRUPADAS COM 1 BOTÃO DE VERIFICAÇÃO */}
                                                            <div className="w-full bg-gray-100 rounded-xl -mt-5">

                                                                {/* WRAPPER DOS CARDS */}
                                                                <div className="col-span-5 flex gap-4 w-full -mt-5 p-1">

                                                                    {/* ====================== CARD 1 — INDIVIDUAL ====================== */}
                                                                    <div
                                                                        className={`flex-1 flex flex-col gap-3 p-1 rounded-xl border
                                                                    ${selectedType === "individual" ? "border-primary bg-primary-50" : "border-gray-300 bg-gray-100"}`}
                                                                        onClick={() => setSelectedType("individual")}
                                                                    >
                                                                        {/* Radio + Título */}

                                                                        {/* Inputs do INDIVIDUAL */}
                                                                        <div className='flex flex-row cursor-pointer justify-between'>
                                                                            <div className='flex flex-row items-center gap-2'>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="personType"
                                                                                    checked={selectedType === "individual"}
                                                                                    onChange={() => setSelectedType("individual")}
                                                                                />
                                                                                <InputFieldControlled
                                                                                    type="text"
                                                                                    id={"LastName"}
                                                                                    name={"LastName"}
                                                                                    label={requiredFields.find(f => f.key === "LastName")?.label}
                                                                                    ariaLabel={"LastName"}
                                                                                    value={missingValues["LastName"] ?? ""}
                                                                                    style={"border rounded-md px-2 py-1 !bg-gray-100 text-gray-500 h-7 w-full"}
                                                                                    disabled
                                                                                />
                                                                            </div>
                                                                            <InputFieldControlled
                                                                                type="text"
                                                                                id={"vatNo"}
                                                                                name={"vatNo"}
                                                                                label={requiredFields.find(f => f.key === "vatNo")?.label}
                                                                                ariaLabel={"vatNo"}
                                                                                value={missingValues["vatNo"] ?? ""}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value;
                                                                                    setMissingValues(prev => ({ ...prev, vatNo: value }));
                                                                                    setContacts(prev => ({ ...prev, vatNo: value }));
                                                                                }}
                                                                                style={"border rounded-md px-2 py-1 w-full"}
                                                                            />
                                                                        </div>
                                                                    </div>


                                                                    {/* ====================== CARD 2 — COMPANY ====================== */}
                                                                    <div
                                                                        className={`flex-1 flex flex-col gap-3 p-2 rounded-xl border cursor-pointer
                                                                    ${selectedType === "company" ? "border-primary bg-primary-50" : "border-gray-300 bg-gray-100"}`}
                                                                        onClick={() => {
                                                                            setSelectedType("company")
                                                                            const companyNameValue =
                                                                                missingValues["CompanyName"] !== undefined && missingValues["CompanyName"] !== ""
                                                                                    ? missingValues["CompanyName"]
                                                                                    : (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1
                                                                                        ? (newCompany?.companyName || reserva.Company || "")
                                                                                        : "");
                                                                            const companyVatValue =
                                                                                missingValues["CompanyVatNo"] !== undefined ? missingValues["CompanyVatNo"]
                                                                                    : (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1)
                                                                                        ? (newCompany?.vatNo || reserva.CompanyVatNo || "")
                                                                                        : "";
                                                                            if (!companyNameValue || !companyVatValue) {
                                                                                setOpenModal("search");
                                                                                setIsCVATModalOpenInsert(true);
                                                                            } else { // 👉 CARREGAR OS DADOS AQUI 
                                                                                setCompanyVATData({
                                                                                    companyName: reserva.Company || "",
                                                                                    vatNo: reserva.CompanyVatNo || "",
                                                                                    emailAddress: reserva.CompanyEmail || "",
                                                                                    country: reserva.CompanyCountryID || "",
                                                                                    streetAddress: reserva.CompanyStreetAddress || "",
                                                                                    zipCode: reserva.CompanyZipCode || "",
                                                                                    city: reserva.CompanyCity || "",
                                                                                    state: reserva.CompanyState || "",
                                                                                });
                                                                            }
                                                                        }}
                                                                    >

                                                                        {/* Radio + Título */}

                                                                        {/* Inputs da COMPANY */}
                                                                        <div className='flex flex-row gap-2 justify-between'>
                                                                            <div className='flex flex-row items-center gap-2'>
                                                                                <input
                                                                                    type="radio"
                                                                                    name="personType"
                                                                                    checked={selectedType === "company"}
                                                                                    onChange={() => setSelectedType("company")}
                                                                                />
                                                                                <InputFieldControlled
                                                                                    type="text"
                                                                                    id={"CompanyName"}
                                                                                    name={"CompanyName"}
                                                                                    label={requiredFields.find(f => f.key === "CompanyName")?.label}
                                                                                    ariaLabel={"CompanyName"}
                                                                                    value={
                                                                                        missingValues["CompanyName"] && missingValues["CompanyName"] !== ""
                                                                                            ? missingValues["CompanyName"]
                                                                                            : (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1)
                                                                                                ? (newCompany?.companyName || reserva.Company || "")
                                                                                                : ""
                                                                                    }
                                                                                    onChange={(e) => setMissingValues(prev => ({ ...prev, CompanyName: e.target.value }))}
                                                                                    style={"border rounded-md px-2 py-1 w-full"}
                                                                                />
                                                                            </div>

                                                                            <InputFieldControlled
                                                                                type="text"
                                                                                id={"CompanyVatNo"}
                                                                                name={"CompanyVatNo"}
                                                                                label={requiredFields.find(f => f.key === "CompanyVatNo")?.label}
                                                                                ariaLabel={"CompanyVatNo"}
                                                                                value={
                                                                                    missingValues["CompanyVatNo"] && missingValues["CompanyVatNo"] !== ""
                                                                                        ? missingValues["CompanyVatNo"]
                                                                                        : (reserva.hasCompanyVAT === 1 || newCompany?.hasCompanyVAT === 1)
                                                                                            ? (newCompany?.vatNo || reserva.CompanyVatNo || "")
                                                                                            : ""
                                                                                }
                                                                                onChange={(e) => setMissingValues(prev => ({ ...prev, CompanyVatNo: e.target.value }))}
                                                                                style={"border rounded-md px-2 py-1 w-full"}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='flex flex-col col-span-1 self-end'>
                                                            <div className='flex flex-col text-center items-center gap-2'>
                                                                <p className='text-lg font-bold'>{t.frontOffice.registrationForm.rating.header}</p>
                                                                <p className='text-xs'>{t.frontOffice.registrationForm.rating.ratingScore}</p>
                                                                {/* Estrelas */}
                                                                <div className="flex space-x-2 text-4xl cursor-pointer items-center justify-center mb-5">
                                                                    {[1, 2, 3, 4, 5].map((star) => {
                                                                        const filled = (hover || rating) >= star;

                                                                        return (
                                                                            <span
                                                                                key={star}
                                                                                onClick={() => setRating(star)}
                                                                                onMouseEnter={() => setHover(star)}
                                                                                onMouseLeave={() => setHover(0)}
                                                                            >
                                                                                {filled ? (
                                                                                    <FaStar className="text-primary" size={30} />
                                                                                ) : (
                                                                                    <FaRegStar className="text-gray-400" size={30} />
                                                                                )}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <button
                                                                    onClick={handleSaveMissing}
                                                                    disabled={!isOkEnabled}
                                                                    className={`bg-green text-white text-4xl font-bold px-6 rounded-md h-[70px] w-full flex items-center justify-center ${!isOkEnabled ? "opacity-50 cursor-not-allowed" : ""
                                                                        }`}
                                                                >
                                                                    OK
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {showRatingModal && (
                                                            <RatingForm
                                                                isOpen={showRatingModal}
                                                                onClose={() => setShowRatingModal(false)}
                                                                onSelectRating={(value) => {
                                                                    setRating(value);        // guardar rating selecionado
                                                                    setShowRatingModal(false);
                                                                    handleSaveMissing();     // ← CONTINUA AUTOMATICAMENTE
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}