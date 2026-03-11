"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function agencyInsert() {

    //inserção na tabela client preference
    const [agency, setAgency] = useState({
        name: '',
        abreviature: '',
        //geral
        MainAddress: '',
        BillingAddress: '',
        MainZipCode: '',
        BillingZipCode: '',
        MainLocality: '',
        BillingLocality: '',
        Region: '',
        //info.
        url: '',
        //dados faturação
        GuestCompanyNif: ''
    })

    const handleInputAgency = (event) => {
        setAgency({ ...agency, [event.target.name]: event.target.value })
    }
    async function handleSubmiAgency(event) {
        event.preventDefault()

        if (!agency.name || !agency.abreviature || !agency.url || !agency.MainAddress || !agency.BillingAddress || !agency.MainZipCode || !agency.BillingZipCode ||
            !agency.MainLocality || !agency.BillingLocality || !agency.Region || !agency.GuestCompanyNif) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {
            const nifCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/travelAgency/nif', {
                data: {
                    guestCompanyNif: agency.GuestCompanyNif,
                }
            });
            const guestNifID = await nifCreationInfo.data.newRecord.guestNifID.toString();

            // Envio da solicitação para criar as moradas
            const addressCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/travelAgency/address', {
                data: {
                    mainAddress: agency.MainAddress,
                    billingAddress: agency.BillingAddress,
                }
            });
            const guestAddressID = await addressCreationInfo.data.newRecord.guestAddressID.toString();

            // Envio da solicitação para criar codigo postal
            const zipCodeCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/travelAgency/zipcode', {
                data: {
                    mainZipCode: agency.MainZipCode,
                    billinigZipCode: agency.BillingZipCode,
                }
            });
            const guestZipCodeID = await zipCodeCreationInfo.data.newRecord.guestZipCodeID.toString();

            // Envio da solicitação para criar localidades
            const localityCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/travelAgency/locality', {
                data: {
                    mainLocality: agency.MainLocality,
                    billinigLocality: agency.BillingLocality,
                }
            });
            const guestLocalityID = await localityCreationInfo.data.newRecord.guestLocalityID.toString();


            // Envio da solicitação para criar o indivíduo
            const response = await axios.put('/api/v1/frontOffice/clientForm/travelAgency', {
                data: {
                    name: agency.name,
                    shortName: agency.abreviature,
                    websiteURL: agency.url,
                    //geral
                    country: guestAddressID,
                    zipCode: guestZipCodeID,
                    town: guestLocalityID,
                    region: agency.Region,
                    //dados faturação
                    nif: guestNifID,

                }
            });
            //console.log(response); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }

    }
    return {
        handleInputAgency, handleSubmiAgency
    };
}

export function agencyEdit(idAgency, idNifAgency, idAddressAgency, idZipCodeAgency, idLocalityAgency) {
    //edição na tabela client preference
    const [valuesAgency, setValuesAgency] = useState({
        id: idAgency,
        name: '',
        abreviature: '',
        //geral
        Region: '',
        url: ''
    })

    //geral
    const [valuesAddress, setValuesAddress] = useState({
        MainAddress: '',
        BillingAddress: '',
    })
    const [valuesZipCode, setValuesZipCode] = useState({
        MainZipCode: '',
        BillinigZipCode: '',
    })
    const [valuesLocality, setValuesLocality] = useState({
        MainLocality: '',
        BillinigLocality: '',  
    })
    //dados faturação
    const [valuesNif, setValuesNif] = useState({
        GuestCompanyNif: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envio da solicitação para obter os dados do indivíduo
                const agencyResponse = await axios.get("/api/v1/frontOffice/clientForm/travelAgency/" + idAgency);

                setValuesAgency({
                    ...valuesAgency,
                    name: agencyResponse.data.response.name,
                    abreviature: agencyResponse.data.response.shortName,
                    //geral
                    Region: agencyResponse.data.response.region,
                    url: agencyResponse.data.response.websiteURL,
                });

                //Envio de solicitação para obter os dados do tlm
                const nifResponse = await axios.get("/api/v1/frontOffice/clientForm/travelAgency/nif/" + idNifAgency);
                setValuesNif({
                    ...valuesNif,
                    GuestCompanyNif: nifResponse.data.response.guestCompanyNif
                })

                //Envio de solicitação para obter os dados da morada
                const addressResponse = await axios.get("/api/v1/frontOffice/clientForm/travelAgency/address/" + idAddressAgency);
                setValuesAddress({
                    ...valuesAddress,
                    MainAddress: addressResponse.data.response.mainAddress,
                    BillingAddress: addressResponse.data.response.billingAddress
                })

                //Envio de solicitação para obter os dados do codigo postal
                const zipCodeResponse = await axios.get("/api/v1/frontOffice/clientForm/travelAgency/zipcode/" + idZipCodeAgency);
                setValuesZipCode({
                    ...valuesZipCode,
                    MainZipCode: zipCodeResponse.data.response.mainZipCode,
                    BillinigZipCode: zipCodeResponse.data.response.billinigZipCode
                })

                //Envio de solicitação para obter os dados da localidade
                const localityResponse = await axios.get("/api/v1/frontOffice/clientForm/travelAgency/locality/" + idLocalityAgency);
                setValuesLocality({
                    ...valuesLocality,
                    MainLocality: localityResponse.data.response.mainLocality,
                    BillinigLocality: localityResponse.data.response.billinigLocality,
                })

                console.log(agencyResponse, nifResponse, addressResponse, zipCodeResponse, localityResponse); // Exibe as respostas do servidor no console
            } catch (error) {
                console.error('Erro ao enviar requisições:', error);
            }
        };

        fetchData();
    }, [idAgency, idNifAgency, idAddressAgency, idZipCodeAgency, idLocalityAgency]);


    function handleUpdateTravelAgency(e) {
        e.preventDefault()
        axios.patch(`/api/v1/frontOffice/clientForm/travelAgency/` + idAgency, {
            data: {
                name: valuesAgency.name,
                shortName: valuesAgency.abreviature,
                //geral
                region: valuesAgency.Region,
                websiteURL: valuesAgency.url,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/travelAgency/nif/" + idNifAgency, {
            data: {
                guestCompanyNif: valuesNif.GuestCompanyNif,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/travelAgency/address/" + idAddressAgency, {
            data: {
                mainAddress: valuesAddress.MainAddress,
                billingAddress: valuesAddress.BillingAddress,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/travelAgency/zipcode/" + idZipCodeAgency, {
            data: {
                mainZipCode: valuesZipCode.MainZipCode,
                billinigZipCode: valuesZipCode.BillinigZipCode,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/travelAgency/locality/" + idLocalityAgency, {
            data: {
                mainLocality: valuesLocality.MainLocality,
                billinigLocality: valuesLocality.BillinigLocality,
            }
        })

            .catch(err => console.log(err))

    }

    return {
        handleUpdateTravelAgency, setValuesAgency, valuesAgency, setValuesAddress, valuesAddress, setValuesZipCode, valuesZipCode, setValuesLocality, valuesLocality,
        setValuesNif, valuesNif
    };
}
