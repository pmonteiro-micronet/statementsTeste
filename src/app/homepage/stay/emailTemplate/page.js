'use client';

import React, { useState, useRef } from 'react';
import { FaGripLines } from 'react-icons/fa';
import { IoCopy } from 'react-icons/io5';

export default function EmailTemplate() {
    // Estados que você usava na aba
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isEditing, setIsEditing] = useState(true); // Presumi que começa editando
    const [showVariablesbar, setShowVariablesbar] = useState(false);
    const [hoveredVar, setHoveredVar] = useState(null);

    const textareaRef = useRef < HTMLTextAreaElement > (null);
    const [copiedVar, setCopiedVar] = useState(null);

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
        { key: '{{protelGuestFirstName}}', desc: 'Nome' },
        { key: '{{protelGuestLastName}}', desc: 'Sobrenome' },
        { key: '{{protelGuestMobilePhone}}', desc: 'Telemóvel' },
        { key: '{{email}}', desc: 'Email' },
    ];

    const reservationDetails = [
        { key: '{{protelRoomID}}', desc: 'Quarto' },
        { key: '{{protelReservationID}}', desc: 'Nrm. Reserva' },
        { key: '{{protelValidFrom}}', desc: 'Chegada' },
        { key: '{{protelValidUntil}}', desc: 'Partida' },
        { key: '{{adult}}', desc: 'Nrm. Adultos' },
        { key: '{{child}}', desc: 'Nrm. Crianças' },
        { key: '{{STAY_LINK}}', desc: 'Link da estadia VIP' },
    ];

    const hotelDetails = [
        { key: '{{hotel_name}}', desc: 'Nome do hotel' },
        { key: '{{hotel_email}}', desc: 'Email do hotel' },
        { key: '{{hotel_phone}}', desc: 'Tel. do hotel' },
    ];

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

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Editor de Email</h1>

            <p className="bg-gray-200 p-1 mb-2">Email</p>

            <div className="w-1/2 flex flex-col text-xs mb-4">
                <p>Email Subject</p>
                <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    disabled={!isEditing}
                />
            </div>

            <div className="mt-2">
                <button
                    type="button"
                    className="bg-[#FC9D25] text-white px-2 py-1 rounded-md text-xs font-bold"
                    onClick={() => {
                        const textarea = textareaRef.current;
                        if (!textarea || !isEditing) return;

                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const selectedText = emailBody.slice(start, end);
                        const before = emailBody.slice(0, start);
                        const after = emailBody.slice(end);

                        const bolded = `**${selectedText || ' '}**`;
                        const newText = before + bolded + after;

                        setEmailBody(newText);

                        setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + 2, end + 2);
                        }, 0);
                    }}
                >
                    B
                </button>
            </div>

            <div className="w-full flex flex-col text-xs mt-4 mb-8">
                <div className="flex flex-row justify-between items-center mb-1 cursor-pointer">
                    <div>
                        <p>Email Body</p>
                    </div>
                    <div
                        className="bg-[#FC9D25] p-1 rounded-lg"
                        onClick={() => setShowVariablesbar(!showVariablesbar)}
                    >
                        <FaGripLines color="white" size={15} />
                    </div>
                </div>

                <textarea
                    ref={textareaRef}
                    onDoubleClick={handleDoubleClick}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full h-72 border border-gray-300 rounded-md px-2 py-1 focus:outline-none resize-none"
                    disabled={!isEditing}
                />
            </div>

            {showVariablesbar && (
                <div className="fixed top-16 right-4 h-[calc(100%-4rem)] w-72 bg-white shadow-lg p-4 z-50 flex flex-col">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-sm font-bold">Elementos disponíveis</h2>
                        <button onClick={() => setShowVariablesbar(false)} className="text-gray-500 text-lg">
                            &times;
                        </button>
                    </div>

                    <div className="flex-shrink-0 font-bold flex justify-between border-b pb-1 mb-2 text-xs">
                        <span>VARIÁVEL</span>
                        <span>DESCRIÇÃO</span>
                    </div>

                    <div className="flex-grow overflow-y-auto text-xs space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Detalhes do hóspede</h3>
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

                        <div>
                            <h3 className="font-semibold mb-2">Detalhes da reserva</h3>
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

                        <div>
                            <h3 className="font-semibold mb-2">Detalhes do hotel</h3>
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
        </div>
    );
}
