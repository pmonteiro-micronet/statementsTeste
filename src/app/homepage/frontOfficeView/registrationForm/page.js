'use client'
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
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

import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { IoIosSave } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";

export default function Page() {
    const [reserva, setReserva] = useState(null);
    const [guestInfo, setGuestInfo] = useState(null);
    const [address, setAddress] = useState(null);
    const [personalID, setPersonalID] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [propertyID, setPropertyID] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const canvasRef = useRef(null);
    const signaturePadRef = useRef(null);

    // const searchParams = useSearchParams();  // Usando useSearchParams diretamente
    // const requestID = searchParams.get("requestID");  // Acessando parâmetro de URL
    // const resNo = searchParams.get("resNo");  // Acessando o parâmetro resNo

    console.log(isLoading);
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
    const halfInputStyle = "w-10 h-4 outline-none my-2 text-sm !text-textLabelColor bg-cardColor input-field"
    const inputStyle = "w-32 h-4 outline-none my-2 text-sm !text-textLabelColor bg-cardColor input-field"
    const inputStyleFull = "w-full h-4 outline-none my-2 text-sm !text-textLabelColor bg-cardColor input-field"
    const inputStyleFullWithLine = "w-full border-b-2 border-gray-200 px-1 h-4 outline-none my-2 text-sm !text-textLabelColor bg-cardColor input-field"

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const requestID = queryParams.get("requestID");
        const resNo = queryParams.get("resNo");
        const propertyID = queryParams.get("propertyID");
        setPropertyID(propertyID);

        const fetchReservaByRequestID = async () => {
            if (!requestID || !resNo) {
                console.warn("Parâmetros ausentes na URL: requestID ou resNo");
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.get(`/api/reservations/checkins/registrationForm/${requestID}`);
                console.log("Resposta da API para o requestID:", response);

                if (response.data?.response?.length > 0) {
                    const requestBody = response.data.response[0].requestBody;
                    const reservas = JSON.parse(requestBody);
                    console.log("Reservas encontradas no requestBody:", reservas);

                    const reservaSelecionada = reservas.find(r =>
                        r.ReservationInfo.some(info => `${info.ResNo}` === `${resNo}`)
                    );

                    if (reservaSelecionada) {
                        console.log("Reserva encontrada:", reservaSelecionada);

                        // Acessando informações diretamente do primeiro índice de GuestInfo
                        const guestInfo = reservaSelecionada.GuestInfo?.[0]?.GuestDetails?.[0] || null;
                        const address = reservaSelecionada.GuestInfo?.[0]?.Address?.[0] || null;
                        const personalID = reservaSelecionada.GuestInfo?.[0]?.PersonalID?.[0] || null;
                        const contacts = reservaSelecionada.GuestInfo?.[0]?.Contacts?.[0] || null;

                        console.log("Informações do hóspede:", guestInfo);
                        console.log("Informações do endereço:", address);
                        console.log("Informações do PersonalID:", personalID);
                        console.log("Informações de contato:", contacts);

                        setReserva(reservaSelecionada.ReservationInfo.find(info => `${info.ResNo}` === `${resNo}`));
                        setGuestInfo(guestInfo);
                        setAddress(address);
                        setPersonalID(personalID);
                        setContacts(contacts);

                        // Verifica se o e-mail termina com "@guest.booking.com"
                        if (contacts?.Email?.endsWith('@guest.booking.com')) {
                            setErrorMessage('Email inválido. O email não pode terminar em guest.booking.com');
                        } else {
                            setErrorMessage(''); // Limpa a mensagem de erro se o e-mail for válido
                        }
                    } else {
                        console.warn(`Nenhuma reserva encontrada com ResNo: ${resNo}`);
                    }
                } else {
                    console.warn(`Nenhuma reserva encontrada para o requestID: ${requestID}`);
                }
            } catch (error) {
                console.error("Erro ao buscar reserva específica:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (requestID && resNo) {
            fetchReservaByRequestID();
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
    useEffect(() => {
        if (canvasRef.current) {
            initializeSignaturePad();
        }

        // Atualizar o canvas ao redimensionar a janela
        const handleResize = () => {
            initializeSignaturePad();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup do event listener ao desmontar o componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    // Estado para controlar a bandeira ativa
    const [activeFlag, setActiveFlag] = useState('usa-uk'); // Bandeira padrão

    // Função para mudar a bandeira ativa
    const handleFlagClick = (flag) => {
        setActiveFlag(flag);
        setDropdownOpen(false); // Fecha o dropdown após a seleção
    };
    const [termsAccepted, setTermsAccepted] = useState(true); // "Agree" por padrão
    const [policyAccepted, setPolicyAccepted] = useState(true); // "Agree" por padrão
    const [error, setError] = useState('');

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
    // Função para capturar a assinatura e gerar o PDF
    const handleOkClick = async () => {
        if (termsAccepted === null || policyAccepted === null || isCanvasEmpty()) {
          setError('All fields are required: please accept terms, policy, and sign.');
          setTimeout(() => setError(''), 5000);
          return;
        }
      
        setError('');
        console.log('Form submitted');
      
        try {
          // Captura a assinatura do canvas em Base64
          const canvas = canvasRef.current;
          if (!canvas) return;
          const signatureBase64 = canvas.toDataURL().split(',')[1]; // Remove prefixo "data:..."
      
          // Detalhes da reserva
          const reservaDetails = {
            PropertyID: propertyID,
            ResNo: reserva.ResNo,
            Room: reserva.Room,
            DateCI: reserva.DateCI,
            DateCO: reserva.DateCO,
            Adults: reserva.Adults,
            Childs: reserva.Childs,
            LastName: guestInfo.LastName,
            FirstName: guestInfo.FirstName,
            Street: address.Street,
            Country: address.Country,
            IdDoc: personalID.IdDoc,
            NrDoc: personalID.NrDoc,
            Phone: contacts.PhoneNumber,
            ExpDate: personalID.ExpDate,
            DateOfBirth: personalID.DateOfBirth,
            Issue: personalID.Issue,
            CountryOfBirth: personalID.CountryOfBirth,
            VatNo: contacts.VatNo,
            PersonalEmail: contacts.Email,
          };
      
          // Gera o PDF em Base64
          const pdfDoc = await generatePDFTemplate(reservaDetails, `data:image/png;base64,${signatureBase64}`);
          const pdfBase64 = pdfDoc.output('datauristring').split(',')[1]; // Remove o prefixo
      
          // Envia os dados usando Axios
          const response = await axios.post(
            "/api/reservations/checkins/registration_form_base64",
            {
              PropertyID: propertyID,
              pdfBase64: pdfBase64, // Correção: inclusão explícita de pdfBase64
              fileName: `ResNo-${reserva.ResNo}.pdf`,
            }
          );
      
          console.log('Resposta da API:', response.data);
        } catch (error) {
          console.error('Erro ao gerar ou enviar o PDF:', error);
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
    const [isEditable, setIsEditable] = useState(false);

    // useEffect para definir o valor inicial de email com contacts.Email
    useEffect(() => {
        // Atualiza o estado do email se os dados de contacts mudarem
        if (contacts?.Email) {
            setEmail(contacts.Email);
        }
    }, [contacts]);

    // Função para lidar com mudanças no email
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        // Validação de email
        if (newEmail && newEmail.endsWith('@guest.booking.com')) {
            setErrorMessage('Email inválido. O email não pode terminar em guest.booking.com');
        } else {
            setErrorMessage('');
        }
    };

    // Ativar modo de edição
    const handleEditClick = () => {
        setIsEditable(true);
    };

    // Salvar o novo email
    const handleSaveClick = () => {
        // Atualiza o estado de contacts com o novo email
        setContacts((prevContacts) => ({
            ...prevContacts,
            Email: email,
        }));
        console.log("Novo email salvo:", email);
        setIsEditable(false); // Desativa a edição
    };

    // Cancelar a edição e restaurar o valor salvo
    const handleCancelClick = () => {
        setIsEditable(false);
        setEmail(contacts.Email); // Restaura o valor salvo
    };

    return (
        <div className='bg-background main-page min-h-screen'>
            {/* {isLoading ? (
            <LoadingBackdrop open={isLoading} />
        ) : ( */}
            {/* header  */}
            <>
                <div className="pt-2 px-4 flex justify-between flag-position items-center">
                    <div className='text-textPrimaryColor'>Torel Quinta da Vacaria</div>
                    <div className='text-textPrimaryColor'>
                        <p>Registration Form</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center language-row">
                        <div
                            className={`flag ${activeFlag === 'usa-uk' ? 'active' : 'inactive'}`}
                            onClick={() => handleFlagClick('usa-uk')}
                        >
                            <img
                                src="/flags/uk.png"
                                alt="english"
                                className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                            />
                        </div>
                        <div
                            className={`flag ${activeFlag === 'pt-br' ? 'active' : 'inactive'}`}
                            onClick={() => handleFlagClick('pt-br')}
                        >
                            <img
                                src="/flags/pt.webp"
                                alt="portuguese"
                                className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                            />
                        </div>
                        <div
                            className={`flag ${activeFlag === 'sp' ? 'active' : 'inactive'}`}
                            onClick={() => handleFlagClick('sp')}
                        >
                            <img
                                src="/flags/sp.png"
                                alt="spanish"
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
                                src={`/flags/${activeFlag === 'usa-uk' ? 'uk.png' : activeFlag === 'pt-br' ? 'pt.webp' : 'sp.png'}`}
                                alt={activeFlag}
                                className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                            />
                            {/* Seta indicando o dropdown */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 ml-2 transition-transform duration-300 transform" // Tamanho e margem da seta
                                style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} // Girar a seta quando aberto
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute top-full right-0 bg-cardColor shadow-md rounded mt-1 z-10 w-14">
                                <div
                                    className="flex items-center justify-center gap-2 p-2 cursor-pointer"
                                    onClick={() => handleFlagClick('usa-uk')}
                                >
                                    <img
                                        src="/flags/uk.png"
                                        alt="english"
                                        className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                    />
                                </div>
                                <div
                                    className="flex items-center justify-center gap-2 p-2 cursor-pointer"
                                    onClick={() => handleFlagClick('pt-br')}
                                >
                                    <img
                                        src="/flags/pt.webp"
                                        alt="portuguese"
                                        className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                    />
                                </div>
                                <div
                                    className="flex items-center justify-center gap-2 p-2 cursor-pointer"
                                    onClick={() => handleFlagClick('sp')}
                                >
                                    <img
                                        src="/flags/sp.png"
                                        alt="spanish"
                                        className="w-8 h-8 object-cover rounded-full" // Tornar a bandeira circular
                                    />
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
                                        <h3 className='text-[#f7ba83]'>Stay Details</h3>
                                        <IoIosArrowForward size={20} color='#f7ba83' />
                                        <h3 className='text-[#f7ba83]'>Res. Nr.: {reserva.ResNo}</h3>
                                    </div>
                                    {/** Info do quarto */}
                                    <div className='flex flex-row gap-5 mt-2'>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"de"}
                                            name={"De"}
                                            label={"Room"}
                                            ariaLabel={"De:"}
                                            value={reserva.Room}
                                            style={inputStyle}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"roomType"}
                                            name={"roomType"}
                                            label={"Room Type"}
                                            ariaLabel={"Room Type:"}
                                            value={reserva.RoomType}
                                            style={inputStyleFull}
                                        />
                                        <div className='flex flex-row gap-2'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Adults"}
                                                name={"Adults"}
                                                label={"Adults"}
                                                ariaLabel={"Adults:"}
                                                value={reserva.Adults}
                                                style={`${halfInputStyle}`}
                                            />
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Childs"}
                                                name={"Childs"}
                                                label={"Childs"}
                                                ariaLabel={"Childs:"}
                                                value={reserva.Childs}
                                                style={halfInputStyle}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-row justify-start gap-5 mt-2'>
                                        <InputFieldControlled
                                            type={"date"}
                                            id={"Arrival"}
                                            name={"Arrival"}
                                            label={"Arrival"}
                                            ariaLabel={"Arrival:"}
                                            value={reserva.DateCI}
                                            style={inputStyle}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Nights"}
                                            name={"Nights"}
                                            label={"Nights"}
                                            ariaLabel={"Nights:"}
                                            value={nights}
                                            style={halfInputStyle}
                                        />
                                        <InputFieldControlled
                                            type={"date"}
                                            id={"Departure"}
                                            name={"Departure"}
                                            label={"Departure"}
                                            ariaLabel={"Departure:"}
                                            value={reserva.DateCO}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/** Dados de Info pessoal */}
                                <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 px-4 details-on-screen-card'>
                                    <p className='text-[#f7ba83] mb-1'>Price Info</p>
                                    <div className='flex flex-row justify-between items-center gap-4 mt-2'>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Rate Code"}
                                            name={"Rate Code"}
                                            label={"Rate Code"}
                                            ariaLabel={"Rate Code:"}
                                            value={reserva.RateCode}
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"City Tax"}
                                            name={"City Tax"}
                                            label={"City Tax"}
                                            ariaLabel={"City Tax:"}
                                            value={reserva.CityTax}
                                            style={inputStyleFull}
                                        />
                                    </div>
                                    <div className='flex flex-row justify-between items-center gap-4 mt-2'>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Price"}
                                            name={"Price"}
                                            label={"Price\\Night"}
                                            ariaLabel={"Price:"}
                                            value={`${reserva.Price.toFixed(2)} €`} // Formata para 2 casas decimais
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Total"}
                                            name={"Total"}
                                            label={"Total"}
                                            ariaLabel={"Total:"}
                                            value={`${reserva.Total.toFixed(2)} €`} // Formata para 2 casas decimais
                                            style={inputStyleFull}
                                        />

                                    </div>
                                </div>
                            </div>

                            {/** Dados de cliente */}
                            <div className='bg-cardColor py-2 px-2 rounded-lg mt-1'>
                                <p className='text-[#f7ba83] mb-1'>Guest Details</p>
                                <div className='flex flex-row w-full mt-2'>
                                    <div className='mr-4'>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Salutation"}
                                            name={"Salutation"}
                                            label={"Salutation"}
                                            ariaLabel={"Salutation:"}
                                            value={guestInfo.Salution}
                                            style={"w-10 h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                        />
                                    </div>
                                    <div className='w-full flex flex-row'>
                                        <div className='w-1/2'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"Last Name"}
                                                name={"Last Name"}
                                                label={"Last Name"}
                                                ariaLabel={"Last Name:"}
                                                value={guestInfo.LastName}
                                                style={"w-72 h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                            />
                                        </div>
                                        <div className='w-1/2 -ml-2'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"First Name"}
                                                name={"First Name"}
                                                label={"First Name"}
                                                ariaLabel={"First Name:"}
                                                value={guestInfo.FirstName}
                                                style={"w-full h-5 outline-none my-2 text-lg !text-textSecondaryLabelColor bg-cardColor"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-row details-on-screen'>
                                {/** Dados de Morada */}
                                <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
                                    <p className='text-[#f7ba83] mb-1'>Address</p>
                                    <div className='flex flex-col w-full mt-2'>
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Country"}
                                            name={"Country"}
                                            label={"Country"}
                                            ariaLabel={"Country:"}
                                            value={address.Country}
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Street Address"}
                                            name={"Street Address"}
                                            label={"Street Address"}
                                            ariaLabel={"Street Address:"}
                                            value={address.Street}
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"ZIP / Postal Code"}
                                            name={"ZIP / Postal Code"}
                                            label={"ZIP / Postal Code"}
                                            ariaLabel={"ZIP / Postal Code:"}
                                            value={address.PostalCode}
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"City"}
                                            name={"City"}
                                            label={"City"}
                                            ariaLabel={"City:"}
                                            value={address.City}
                                            style={inputStyleFull}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"State / Province / Region"}
                                            name={"State / Province / Region"}
                                            label={"State / Province / Region"}
                                            ariaLabel={"State / Province / Region:"}
                                            value={address.Region}
                                            style={inputStyleFull}
                                        />
                                    </div>
                                </div>

                                {/** Dados de Info pessoal */}
                                <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 px-4 details-on-screen-card'>
                                    <p className='text-[#f7ba83] mb-1'>Personal ID</p>
                                    <div className='flex flex-row justify-between gap-4 mt-4'>
                                        <InputFieldControlled
                                            type={"date"}
                                            id={"Date of Birth"}
                                            name={"Date of Birth"}
                                            label={"Date of Birth"}
                                            ariaLabel={"Date of Birth:"}
                                            value={personalID.DateOfBirth && personalID.DateOfBirth.split('T')[0] !== '1900-01-01' ? personalID.DateOfBirth.split('T')[0] : ""}
                                            style={inputStyleFullWithLine}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Country of Birth"}
                                            name={"Country of Birth"}
                                            label={"Country of Birth"}
                                            ariaLabel={"Country of Birth:"}
                                            value={personalID.CountryOfBirth}
                                            style={`${inputStyleFullWithLine}`}
                                        />
                                    </div>
                                    {/* <CountryAutocomplete
                                    label={"Nacionality"}
                                    style={"w-full h-9 -mt-2"}
                                    onChange={(value) => handleSelect(value)}
                                /> */}
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"Nacionality"}
                                        name={"Nacionality"}
                                        label={"Nacionality"}
                                        ariaLabel={"Nacionality:"}
                                        value={personalID.Nacionality}
                                        style={`${inputStyleFullWithLine}`}
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
                                            label={"ID Doc"}
                                            ariaLabel={"ID Doc:"}
                                            value={""}
                                            style={`${inputStyleFullWithLine}`}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"ID Doc Nr."}
                                            name={"ID Doc Nr."}
                                            label={"Nr."}
                                            ariaLabel={"ID Doc Nr.:"}
                                            value={personalID.NrDoc}
                                            style={`${inputStyleFullWithLine}`}
                                        />
                                    </div>
                                    <div className='flex flex-row justify-between gap-4 mt-4'>
                                        <InputFieldControlled
                                            type={"date"}
                                            id={"Exp. Date"}
                                            name={"Exp. Date"}
                                            label={"Exp. Date"}
                                            ariaLabel={"Exp. Date:"}
                                            value={personalID.ExpDate && personalID.ExpDate.split('T')[0] !== '2050-12-31' ? personalID.DateOfBirth.split('T')[0] : ""}
                                            style={inputStyleFullWithLine}
                                        />
                                        <InputFieldControlled
                                            type={"text"}
                                            id={"Country issue"}
                                            name={"Country issue"}
                                            label={"Issue"}
                                            ariaLabel={"Country issue:"}
                                            value={personalID.Issue}
                                            style={inputStyleFullWithLine}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-row details-on-screen'>
                                {/** Dados de contacto */}
                                <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
                                    <div className='flex flex-row justify-between'>
                                        <p className='text-[#f7ba83] mb-1'>Contacts</p>
                                        <div className='flex flex-row justify-end gap-4'>
                                            {isEditable ? (
                                                <>
                                                    <button onClick={handleSaveClick} className="text-green-500">
                                                        <IoIosSave size={20} />
                                                    </button>
                                                    <button onClick={handleCancelClick} className="text-red-500">
                                                        <MdOutlineCancel size={20} />
                                                    </button>
                                                </>
                                            ) : (
                                                <FaPencilAlt size={15} color="orange" onClick={handleEditClick} />
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-2'>
                                        <div className='flex flex-row justify-between items-center w-full'>
                                            <div className='flex-grow'>
                                                <InputFieldControlled
                                                    type="text"
                                                    id="Email"
                                                    name="Email"
                                                    label="Personal E-mail"
                                                    ariaLabel="Email:"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    style={inputStyleFull}
                                                    disabled={!isEditable}
                                                />
                                            </div>
                                            {errorMessage && (
                                                <p className='text-red-500 text-xs' title={errorMessage}>
                                                    <CgDanger size={20} color='red' />
                                                </p>
                                            )}
                                        </div>

                                        <InputFieldControlled
                                            type={"text"}
                                            id={"PhoneNumber"}
                                            name={"PhoneNumber"}
                                            label={"Phone Number"}
                                            ariaLabel={"PhoneNumber:"}
                                            value={contacts.PhoneNumber}
                                            style={inputStyleFull}
                                            disabled
                                        />
                                    </div>
                                </div>

                                {/** Dados de faturação */}
                                <div className='w-1/2 bg-cardColor py-2 px-2 rounded-lg mt-1 details-on-screen-card'>
                                    <div className='flex flex-row justify-between'>
                                        <p className='text-[#f7ba83] mb-1'>Invoice Data</p>
                                        <FaPencilAlt size={15} color='orange' />
                                    </div>
                                    <div className='mt-2'>
                                        <p className='!text-textLabelColor text-lg'>{guestInfo.LastName}, {guestInfo.FirstName}</p>
                                        <div className='mt-4'>
                                            <InputFieldControlled
                                                type={"text"}
                                                id={"VAT Nr."}
                                                name={"VAT Nr."}
                                                label={"VAT Nr."}
                                                ariaLabel={"VAT Nr.:"}
                                                value={contacts.VatNo}
                                                style={inputStyleFull}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                    <div className='w-1/2 ml-4 mr-4 half-screen'>
                        {/** Assinatura */}
                        <div className='bg-cardColor py-2 px-2 rounded-lg'>
                            <p className='text-[#f7ba83] mb-1'>Signature</p>
                            {/* Termos e condições */}
                            <div className='flex flex-row mt-2 gap-8 details-on-screen'>
                                <div className='w-1/2 flex flex-col details-on-screen-card'>
                                    <p className='text-xs font-semibold text-textPrimaryColor'>I accept the Hotel Terms and Conditions:</p>
                                    <div className='flex flex-row justify-between text-sm text-textPrimaryColor'>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="terms"
                                                className="mr-2"
                                                checked={termsAccepted === true}
                                                onChange={() => setTermsAccepted(true)}
                                            />
                                            Agree
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="terms"
                                                className="mr-2"
                                                checked={termsAccepted === false}
                                                onChange={() => setTermsAccepted(false)}
                                            />
                                            Disagree
                                        </label>
                                        <TermsConditionsForm
                                            buttonName={"Read more"}
                                            modalHeader={"Hotel Terms and Conditions"}
                                            formTypeModal={11}
                                        />
                                    </div>
                                </div>

                                <div className='w-1/2 flex flex-col details-on-screen-card'>
                                    <p className='text-xs font-semibold text-textPrimaryColor'>I accept the Hotel Data Protection Policy:</p>
                                    <div className='flex flex-row justify-between text-sm text-textPrimaryColor'>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="policy"
                                                className="mr-2"
                                                checked={policyAccepted === true}
                                                onChange={() => setPolicyAccepted(true)}
                                            />
                                            Agree
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="policy"
                                                className="mr-2"
                                                checked={policyAccepted === false}
                                                onChange={() => setPolicyAccepted(false)}
                                            />
                                            Disagree
                                        </label>
                                        <ProtectionPolicyForm
                                            buttonName={"Read more"}
                                            modalHeader={"Hotel Data Protection Policy"}
                                            formTypeModal={11}
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
                        <p className='text-xs text-gray-500 mt-4 text-justify text-style'>
                            I hereby give my express, informed, free and specific consent to the use and processing of my personal data by Quinta da Vacaria 1616 –
                            Vinhos, SA. I was further informed of the PRIVACY POLICY of the company Quinta da Vacaria 1616 – Vinhos, SA holding of the hotel Torel
                            Quinta da Vacaria through the website www.torelquintadavacaria.com.
                            <br></br>I authorize the use of the credit card left as guarantee to cover any consumptions after check-out.
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

                            <div className='flex flex-row gap-4 justify-end px-4 buttons-style items-center'>
                                {/** Botão de cancelar */}
                                <CancelPIN
                                    buttonName={"Cancel"}
                                    buttonColor={"transparent"}
                                    modalHeader={"Insert PIN"}
                                    formTypeModal={11}
                                    editor={"teste"}
                                />

                                {/** Botão de aceitar */}
                                <button
                                    className='bg-primary font-semibold text-white py-2 px-2 rounded-lg w-20 h-10'
                                    onClick={handleOkClick}>
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            {/* )} */}
        </div>
    );
}