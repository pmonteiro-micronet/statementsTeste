'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import "./style.css";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

export default function CheckinRequester() {
    const [checkins, setCheckins] = useState([]);
    const [propertyNames, setPropertyNames] = useState({});
    const router = useRouter();
    const { data: session } = useSession();
    const propertyIDs = session?.user?.propertyIDs || [];

    const [locale, setLocale] = useState("pt");

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"

    const fixInvalidJSON = (raw) => {
        const fixed = `[${raw.replace(/}\s*{/g, '},{')}]`;
        return JSON.parse(fixed);
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/reservations/checkins/checkin_requests');
            let parsedCheckins = response.data.response
                .filter(item => Number(item.seen) !== 1)

                .map((item) => {
                    try {
                        const parsedBody = fixInvalidJSON(item.requestBody);
                        return { ...item, parsedBody };
                    } catch (err) {
                        console.error('Erro ao parsear requestBody:', err);
                        return { ...item, parsedBody: null };
                    }
                });


            // Ordena do mais recente para o mais antigo pelo campo requestDateTime
            parsedCheckins.sort((a, b) => {
                if (a.requestDateTime > b.requestDateTime) return -1;
                if (a.requestDateTime < b.requestDateTime) return 1;
                return 0;
            });

            // Limita a 6 checkins, removendo os mais antigos se necessário
            if (parsedCheckins.length > 6) {
                const toRemove = parsedCheckins.slice(6);

                // Apaga TODOS os removidos da base, independente do campo seen
                await Promise.all(toRemove.map(async (item) => {
                    try {
                        await axios.delete(`/api/reservations/checkins/checkin_requests/${item.requestID}`);
                    } catch (err) {
                        console.error(`Erro ao apagar checkin ${item.requestID}:`, err);
                    }
                }));

                parsedCheckins = parsedCheckins.slice(0, 6);
            }

            setCheckins(parsedCheckins);

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    }, []);

    useEffect(() => {
        fetchData(); // Busca inicial

        const intervalId = setInterval(() => {
            fetchData(); // Busca periódica a cada 15s
        }, 15000);

        return () => clearInterval(intervalId); // Limpa intervalo ao desmontar componente
    }, [fetchData]);

    useEffect(() => {
        const fetchPropertyNames = async () => {
            try {
                const uniquePropertyIDs = [...new Set(checkins.map(c => c.propertyID))];

                const promises = uniquePropertyIDs.map(id =>
                    axios.get(`/api/properties/${id}`).then(res => {
                        const property = res.data.response?.[0];
                        return { id, name: property?.propertyName };
                    })
                );

                const results = await Promise.all(promises);

                const namesMap = {};
                results.forEach(({ id, name }) => {
                    namesMap[id] = name;
                });

                setPropertyNames(namesMap);
            } catch (err) {
                console.error('Erro ao buscar nomes das propriedades:', err);
            }
        };

        if (checkins.length > 0) {
            fetchPropertyNames();
        }
    }, [checkins]);

    const filteredCheckins = checkins.filter(item => propertyIDs.includes(item.propertyID));

    const getGuestName = (firstName = "", lastName = "") => {
        const fullName = `${firstName} ${lastName}`.trim();
        return fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName;
    };

    return (
        <main className="min-h-screen flex flex-col p-8 bg-background">
            <div className="font-semibold text-2xl mb-6 text-textPrimaryColor">{t.frontOffice.registrationRequests.title}</div>

            <div className="grid-container gap-6">
                {filteredCheckins.map(({ parsedBody, propertyID, requestID }, index) => {
                    const reservation = parsedBody?.[0]?.ReservationInfo?.[0];
                    const guest = parsedBody?.[0]?.GuestInfo?.[0];

                    if (!reservation || !guest || !propertyID || !requestID) return null;

                    return (
                        <div key={index} className="relative flex flex-col bg-white rounded-lg shadow-md border border-gray-200 p-4 h-full">
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{propertyNames[propertyID] || 'Carregando...'}</p>
                                            <p className="text-lg font-semibold text-gray-900 whitespace-nowrap overflow-hidden">
                                                {getGuestName(guest.GuestDetails?.[0]?.FirstName, guest.GuestDetails?.[0]?.LastName)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-bold text-white bg-primary rounded-md px-3 py-1 inline-block">
                                                #{reservation.Room}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-200 mb-4" />

                                    <div className="gap-4 text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{t.frontOffice.registrationRequests.reservation}</p>
                                            <span>{reservation.ResNo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{t.frontOffice.registrationRequests.checkin}</p>
                                            <span>{reservation.DateCI}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{t.frontOffice.registrationRequests.checkout}</p>
                                            <span>{reservation.DateCO}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-semibold">{t.frontOffice.registrationRequests.guestEmail}</p>
                                            <span className="truncate">{guest.Contacts?.[0]?.Email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        className="w-full py-2 text-sm rounded-lg border-2 border-primary-50 bg-primary-100 hover:bg-primary hover:text-white transition-colors"
                                        onClick={() => {
                                            router.push(
                                                `/homepage/frontOfficeView/registrationForm?propertyID=${propertyID}&requestID=${requestID}&resNo=${reservation.ResNo}&profileID=${guest.GuestDetails?.[0]?.ProfileID}`
                                            );
                                        }}
                                    >
                                        {t.frontOffice.registrationRequests.ViewDetails}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
