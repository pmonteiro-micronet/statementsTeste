'use client'
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import InputFieldControlled from "@/components/input/page";
import CountryAutocomplete from "@/components/autocompletes/country/page";
import { IoIosArrowForward } from "react-icons/io";
import CancelPIN from "@/components/modals/pin/cancel/page";
import { generatePDFTemplate } from "@/components/pdfTemplate/page";
import './styles.css';
import { FaPencilAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import SignaturePad from 'signature_pad';

export default function Page() {
    const [reserva, setReserva] = useState(null);
    const [guestInfo, setGuestInfo] = useState(null);
    const [address, setAddress] = useState(null);
    const [personalID, setPersonalID] = useState(null);
    const [contacts, setContacts] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
    const halfInputStyle = "w-10 h-4 outline-none my-2 text-sm text-gray-600 input-field"
    const inputStyle = "w-32 h-4 outline-none my-2 text-sm text-gray-600 input-field"
    const inputStyleFull = "w-full h-4 outline-none my-2 text-sm text-gray-600 input-field"
    const inputStyleFullWithLine = "w-full border-b-2 border-gray-200 px-1 h-4 outline-none my-2 text-sm text-gray-600 input-field"

       // Captura os parâmetros da URL diretamente
       useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const requestID = queryParams.get("requestID");
        const resNo = queryParams.get("resNo");

        // Função para buscar reserva específica
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

                    const reservaSelecionada = reservas[0]?.ReservationInfo?.find(r => r.ResNo === parseInt(resNo, 10));

                    if (reservaSelecionada) {
                        console.log("Reserva encontrada:", reservaSelecionada);

                        const guestInfo = reservas[0]?.GuestInfo?.[0]?.GuestDetails?.[0] || null;
                        const address = reservas[0]?.GuestInfo?.[0]?.Address?.[0] || null;
                        const personalID = reservas[0]?.GuestInfo?.[0]?.PersonalID?.[0] || null;
                        const contacts = reservas[0]?.GuestInfo?.[0]?.Contacts?.[0] || null;

                        console.log("Informações do hóspede:", guestInfo);
                        console.log("Informações do endereço:", address);
                        console.log("Informações do PersonalID:", personalID);
                        console.log("Informações de contato:", contacts);

                        setReserva(reservaSelecionada);
                        setGuestInfo(guestInfo);
                        setAddress(address);
                        setPersonalID(personalID);
                        setContacts(contacts);
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

        // Chama a função para buscar a reserva
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

    const [signatureDataUrl, setSignatureDataUrl] = useState(null); // Para armazenar a base64 da assinatura

    console.log(signatureDataUrl);
    // Função para capturar a assinatura e gerar o PDF
    const handleOkClick = () => {
        if (termsAccepted === null || policyAccepted === null || isCanvasEmpty()) {
            setError('All fields are required: please accept terms, policy, and sign.');
            setTimeout(() => setError(''), 5000); // Remove error message after 5 seconds
        } else {
            setError('');
            console.log('Form submitted');

            // Captura a assinatura em base64
            const canvas = canvasRef.current;
            if (!canvas) return;
            const signatureBase64 = canvas.toDataURL();
            setSignatureDataUrl(signatureBase64);

            // Aqui assumimos que `reserva` já está definido no escopo
            const reservaDetails = {
                ResNo: reserva.ResNo,
                Room: reserva.Room,
                DateCI: reserva.DateCI,
                DateCO: reserva.DateCO,
                Adults: reserva.Adults,
                Childs: reserva.Childs,
                LastName: reserva.LastName,
                FirstName: reserva.FirstName,
            };

            // Geração do PDF utilizando o template
            const pdfDoc = generatePDFTemplate(reservaDetails, signatureBase64);

            // Salva o PDF
            pdfDoc.save(`ResNo-${reservaDetails.ResNo}.pdf`);
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className='bg-gray-100 main-page min-h-screen'>
            {/** header */}
            <div className="pt-2 px-4 flex justify-between flag-position items-center">
                <div>Torel Quinta da Vacaria</div>
                <div>
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
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute top-full right-0 bg-white shadow-md rounded mt-1 z-10 w-14">
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
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
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
                                            style={halfInputStyle}
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
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 px-4 details-on-screen-card'>
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
                                        label={"Price"}
                                        ariaLabel={"Price:"}
                                        value={reserva.Price}
                                        style={inputStyleFull}
                                    />
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"Total"}
                                        name={"Total"}
                                        label={"Total"}
                                        ariaLabel={"Total:"}
                                        value={reserva.Total}
                                        style={inputStyleFull}
                                    />
                                </div>
                            </div>
                        </div>

                        {/** Dados de cliente */}
                        <div className='bg-white py-2 px-2 rounded-lg mt-1'>
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
                                        style={"w-10 h-5 outline-none my-2 text-lg text-gray-700"}
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
                                            style={"w-72 h-5 outline-none my-2 text-lg text-gray-700"}
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
                                            style={"w-full h-5 outline-none my-2 text-lg text-gray-700"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-row details-on-screen'>
                            {/** Dados de Morada */}
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
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
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 px-4 details-on-screen-card'>
                                <p className='text-[#f7ba83] mb-1'>Personal ID</p>
                                <div className='flex flex-row justify-between items-center gap-4 mt-4'>
                                    <InputFieldControlled
                                        type={"date"}
                                        id={"Date of Birth"}
                                        name={"Date of Birth"}
                                        label={"Date of Birth"}
                                        ariaLabel={"Date of Birth:"}
                                        value={personalID.DateOfBirth ? personalID.DateOfBirth.split('T')[0] : ""}
                                        style={inputStyleFullWithLine}
                                    />
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"Country of Birth"}
                                        name={"Country of Birth"}
                                        label={"Country of Birth"}
                                        ariaLabel={"Country of Birth:"}
                                        value={personalID.CountryOfBirth}
                                        style={`${inputStyleFullWithLine} -mb-6`}
                                    />
                                </div>
                                <CountryAutocomplete
                                    label={"Nacionality"}
                                    style={"w-full h-9 -mt-2"}
                                    onChange={(value) => handleSelect(value)}
                                />
                                <div className='flex flex-row justify-between items-center gap-4 mt-4'>
                                    <CountryAutocomplete
                                        label={"ID Doc"}
                                        style={"w-32 h-20 mt-1"}
                                        onChange={(value) => handleSelect(value)}
                                    />
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"ID Doc Nr."}
                                        name={"ID Doc Nr."}
                                        label={"Nr."}
                                        ariaLabel={"ID Doc Nr.:"}
                                        value={personalID.NrDoc}
                                        style={inputStyleFullWithLine}
                                    />
                                </div>
                                <div className='flex flex-row justify-between gap-4 -mt-2'>
                                    <InputFieldControlled
                                        type={"date"}
                                        id={"Exp. Date"}
                                        name={"Exp. Date"}
                                        label={"Exp. Date"}
                                        ariaLabel={"Exp. Date:"}
                                        value={personalID.ExpDate ? personalID.ExpDate.split('T')[0] : ""}
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
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 mr-1 details-on-screen-card'>
                                <div className='flex flex-row justify-between'>
                                    <p className='text-[#f7ba83] mb-1'>Contacts</p>
                                    <FaPencilAlt size={15} color='orange' />
                                </div>
                                <div className='mt-2'>
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"Email"}
                                        name={"Email"}
                                        label={"Personal E-mail"}
                                        ariaLabel={"Email:"}
                                        value={contacts.Email}
                                        style={inputStyleFull}
                                    />
                                    <InputFieldControlled
                                        type={"text"}
                                        id={"PhoneNumber"}
                                        name={"PhoneNumber"}
                                        label={"Phone Number"}
                                        ariaLabel={"PhoneNumber:"}
                                        value={contacts.PhoneNumber}
                                        style={inputStyleFull}
                                    />
                                </div>
                            </div>

                            {/** Dados de faturação */}
                            <div className='w-1/2 bg-white py-2 px-2 rounded-lg mt-1 details-on-screen-card'>
                                <div className='flex flex-row justify-between'>
                                    <p className='text-[#f7ba83] mb-1'>Invoice Data</p>
                                    <FaPencilAlt size={15} color='orange' />
                                </div>
                                <div className='mt-2'>
                                    <p className='text-gray-700 text-lg'>{guestInfo.LastName}, {guestInfo.FirstName}</p>
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
                    <div className='bg-white py-2 px-2 rounded-lg'>
                        <p className='text-[#f7ba83] mb-1'>Signature</p>
                        {/* Termos e condições */}
                        <div className='flex flex-row mt-2 gap-8 details-on-screen'>
                            <div className='w-1/2 flex flex-col details-on-screen-card'>
                                <p className='text-xs font-semibold'>I accept the Hotel Terms and Conditions:</p>
                                <div className='flex flex-row justify-between text-sm'>
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
                                    <button className='bg-[#DFEDB6] py-1 px-2 rounded-lg hover:bg-[#D2E69E]'>Read more</button>
                                </div>
                            </div>

                            <div className='w-1/2 flex flex-col details-on-screen-card'>
                                <p className='text-xs font-semibold'>I accept the Hotel Data Protection Policy:</p>
                                <div className='flex flex-row justify-between text-sm'>
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
                                    <button className='bg-[#DFEDB6] py-1 px-2 rounded-lg hover:bg-[#D2E69E]'>Read more</button>
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
                    <p className='text-xs text-gray-800 mt-4 text-justify text-style'>
                        I hereby give my express, informed, free and specific consent to the use and processing of my personal data by Quinta da Vacaria 1616 –
                        Vinhos, SA. I was further informed of the PRIVACY POLICY of the company Quinta da Vacaria 1616 – Vinhos, SA holding of the hotel Torel
                        Quinta da Vacaria through the website www.torelquintadavacaria.com.
                        <br></br>I authorize the use of the credit card left as guarantee to cover any consumptions after check-out.
                    </p>
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
    );
}
