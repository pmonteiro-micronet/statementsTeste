import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function usePriceFilterReservation(GuestNumberNrm, NightNrm) {
    const [prices, setPrices] = useState({
        Charges: '',
        Price: '',
        RateCode: ''
    });

    const [mp, setMp] = useState([]); // Definindo mp como um estado

    const [mpNumber, setMpNumber] = useState(1);

    useEffect(() => {
        if (GuestNumberNrm !== null) {
            setMpNumber(GuestNumberNrm); // Define mpNumber diretamente com base no número de hóspedes
        }
    }, [GuestNumberNrm]);

    const handleRateCode = (rateCode) => {
        setPrices(prevPrices => ({
            ...prevPrices,
            RateCode: rateCode.rategrpID,
        }));
    };

    useEffect(() => {
        if (GuestNumberNrm !== null) {
            const fetchData = async () => {
                try {
                    const res = await axios.get("/api/v1/prices/priceDescription");
                    const mpFieldName = `mp${mpNumber}`; // Forma o nome do campo baseado no número do mp
                    const allMp = res.data.response.filter(item => item[mpFieldName]); // Filtra os resultados com base no campo mp correspondente
                    setMp(allMp);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            };
            fetchData();
        }
    }, [GuestNumberNrm, mpNumber]);

    useEffect(() => {
        if (prices.RateCode && mp.length > 0) {
            const matchedItem = mp.find(item => item.rateCodeID === prices.RateCode);
            if (matchedItem) {
                const mpFieldName = `mp${mpNumber}`;
                const mpValue = matchedItem[mpFieldName];
                const totalMp = mpValue * NightNrm; // Multiplica o valor de mp pelo número de noites
                console.log(`Matched ${mpFieldName} multiplied by NightNrm:`, totalMp);
                setPrices(prevPrices => ({
                    ...prevPrices,
                    Charges: totalMp.toString(), // Atualiza o estado Charges com o valor totalMp convertido para string
                    Price: mpValue,
                }));
            } else {
                console.log("No matching item found for RateCode:", prices.RateCode);
            }
        }
    }, [prices.RateCode, mp, mpNumber, NightNrm]);

    console.log(prices.Charges);

    return {
        handleRateCode, prices, setPrices, mp
    };
}
