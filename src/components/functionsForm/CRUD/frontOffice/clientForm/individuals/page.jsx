"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function individualsInsert() {

    //inserção na tabela client preference
    const [individual, setIndividual] = useState({
        FirstName: '',
        LastName: '',
        MainAddress: '',
        BillingAddress: '',
        ZipCode: '',
        PersonalEmail: '',
        WorkEmail: '',
        PersonalPhone: '',
        WorkPhone: '',
        Region: '',
        Country: '',
        Birthday: '',
        BirthTown: '',
        CC: '',
        IssueDate: '',
        ExpiryDateDoc: '',
        GuestPersonalNif: '',
        TelephoneNumber: '',
        GuestCompanyNif: '',
        Company: '',
        MainZipCode: '',
        BillingZipCode: '',
        MainLocality: '',
        BillinigLocality: '',
        NaturalLocality: '',
        CountryAddress: '',
        CountryNationality: '',
        CountryEmission: '',
        CountryBilling: '',
        Language: '',
    })


    //preenchimento automatico do país atraves de autocomplete
    const handleSelect = (country, fieldName) => {

        setIndividual({
            ...individual,
            [fieldName]: country.land
        })
    };

    //preenchimento automatico do país atraves de autocomplete
    const handleLanguageSelect = (language) => {
        console.log("porra pa: " + language.nation)
        setIndividual({
            ...individual,
            Language: language.codeNr
        });
    };

    const handleInputIndividual = (event) => {
        setIndividual({ ...individual, [event.target.name]: event.target.value })
    }
    async function handleSubmiIndividual(event) {
        event.preventDefault()

        if (!individual.FirstName || !individual.LastName || !individual.MainAddress || !individual.Region || !individual.Birthday ||
            !individual.BirthTown || !individual.CC || !individual.PersonalEmail || !individual.WorkEmail || !individual.PersonalPhone || !individual.WorkPhone ||
            !individual.TelephoneNumber || !individual.IssueDate || !individual.ExpiryDateDoc || !individual.GuestPersonalNif || !individual.BillingAddress || !individual.GuestCompanyNif ||
            !individual.Company || !individual.MainZipCode || !individual.BillingZipCode || !individual.MainLocality || !individual.BillinigLocality || !individual.NaturalLocality) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {

            // Envio da solicitação para criar os emails
            const countryCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/country', {
                data: {
                    countryAddress: individual.CountryAddress,
                    countryNationality: individual.CountryNationality,
                    countryEmission: individual.CountryEmission,
                    countryBilling: individual.CountryBilling,
                }
            });
            const countryID = await countryCreationInfo.data.newRecord.countryID.toString();

            // Envio da solicitação para criar os emails
            const emailCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/email', {
                data: {
                    personalEmail: individual.PersonalEmail,
                    professionalEmail: individual.WorkEmail,
                }
            });
            const guestEmailsID = await emailCreationInfo.data.newRecord.guestEmailsID.toString();


            const phoneCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/phone', {
                data: {
                    personalPhone: individual.PersonalPhone,
                    professionalPhone: individual.WorkPhone,
                }
            });
            const guestPhoneID = await phoneCreationInfo.data.newRecord.guestPhoneID.toString();

            const nifCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/nif', {
                data: {
                    guestPersonalNif: individual.GuestPersonalNif,
                    guestCompanyNif: individual.GuestCompanyNif,
                }
            });
            const guestNifID = await nifCreationInfo.data.newRecord.guestNifID.toString();

            // Envio da solicitação para criar as moradas
            const addressCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/address', {
                data: {
                    mainAddress: individual.MainAddress,
                    billingAddress: individual.BillingAddress,
                }
            });
            const guestAddressID = await addressCreationInfo.data.newRecord.guestAddressID.toString();

            // Envio da solicitação para criar codigo postal
            const zipCodeCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/zipcode', {
                data: {
                    mainZipCode: individual.MainZipCode,
                    billinigZipCode: individual.BillingZipCode,
                }
            });
            const guestZipCodeID = await zipCodeCreationInfo.data.newRecord.guestZipCodeID.toString();

            // Envio da solicitação para criar localidades
            const localityCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/locality', {
                data: {
                    mainLocality: individual.MainLocality,
                    billinigLocality: individual.BillinigLocality,
                    naturalLocality: individual.NaturalLocality,
                }
            });
            const guestLocalityID = await localityCreationInfo.data.newRecord.guestLocalityID.toString();

            // Envio da solicitação para criar o indivíduo
            const response = await axios.put('/api/v1/frontOffice/clientForm/individuals', {
                data: {
                    firstName: individual.FirstName,
                    secondName: individual.LastName,
                    country: guestAddressID,
                    zipCode: guestZipCodeID,
                    region: individual.Region,
                    countryAddress: countryID, //id da tabela secundaria paises
                    birthday: individual.Birthday,
                    birthTown: individual.BirthTown,
                    cc: individual.CC,
                    issuedate: individual.IssueDate,
                    expiryDateDoc: individual.ExpiryDateDoc,
                    email: guestEmailsID,
                    phoneNumber: guestPhoneID,
                    telephoneNumber: individual.TelephoneNumber,
                    nif: guestNifID,
                    name: individual.Company,
                    town: guestLocalityID,
                    languageID: individual.Language
                }
            });
            console.log(response); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }

    }
    return {
        handleInputIndividual, handleSubmiIndividual, handleSelect, handleLanguageSelect
    };
}

export function individualsEdit(idIndividual, idEmail, idPhone, idNif, idAddress, idZipCode, idLocality, idCountry) {
    //edição na tabela client preference
    const [valuesIndividual, setValuesIndividual] = useState({
        id: idIndividual,
        emailID: idEmail,
        FirstName: '',
        LastName: '',
        Region: '',
        Birthday: '',
        BirthTown: '',
        CC: '',
        IssueDate: '',
        ExpiryDateDoc: '',
        TelephoneNumber: '',
        Company: ''
    })
    const [valuesEmail, setValuesEmail] = useState({
        PersonalEmail: '',
        WorkEmail: '',
    })
    const [valuesPhone, setValuesPhone] = useState({
        PersonalPhone: '',
        WorkPhone: '',
    })
    const [valuesNif, setValuesNif] = useState({
        GuestPersonalNif: '',
        GuestCompanyNif: '',
    })
    const [valuesAddress, setValuesAddress] = useState({
        MainAddress: '',
        BillingAddress: '',
    })
    const [valuesZipCode, setValuesZipCode] = useState({
        mainZipCode: '',
        billinigZipCode: '',
    })
    const [valuesLocality, setValuesLocality] = useState({
        MainLocality: '',
        BillinigLocality: '',
        NaturalLocality: ''
    })
    const [country, setCountry] = useState({
        CountryAddress: '',
        CountryNationality: '',
        CountryEmission: '',
        CountryBilling: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envio da solicitação para obter os dados do indivíduo
                const individualResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/" + idIndividual);
                const formattedBirthday = new Date(individualResponse.data.response.birthday).toLocaleDateString();
                const formattedIssueDate = new Date(individualResponse.data.response.issuedate).toLocaleDateString();
                const formattedExpiryDateDoc = new Date(individualResponse.data.response.expiryDateDoc).toLocaleDateString();

                setValuesIndividual({
                    ...valuesIndividual,
                    FirstName: individualResponse.data.response.firstName,
                    LastName: individualResponse.data.response.secondName,
                    //MainAddress: individualResponse.data.response.country,
                    Region: individualResponse.data.response.region,
                    Birthday: formattedBirthday,
                    BirthTown: individualResponse.data.response.birthTown,
                    CC: individualResponse.data.response.cc,
                    TelephoneNumber: individualResponse.data.response.telephoneNumber,
                    IssueDate: formattedIssueDate,
                    ExpiryDateDoc: formattedExpiryDateDoc,
                    Company: individualResponse.data.response.name
                });

                // Envio da solicitação para obter os dados de email
                const emailResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/email/" + idEmail);
                setValuesEmail({
                    ...valuesEmail,
                    PersonalEmail: emailResponse.data.response.personalEmail,
                    WorkEmail: emailResponse.data.response.professionalEmail
                });

                //Envio de solicitação para obter os dados do tlm
                const phoneResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/phone/" + idPhone);
                setValuesPhone({
                    ...valuesPhone,
                    PersonalPhone: phoneResponse.data.response.personalPhone,
                    WorkPhone: phoneResponse.data.response.professionalPhone
                })

                //Envio de solicitação para obter os dados do tlm
                const nifResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/nif/" + idNif);
                setValuesNif({
                    ...valuesNif,
                    GuestPersonalNif: nifResponse.data.response.guestPersonalNif,
                    GuestCompanyNif: nifResponse.data.response.guestCompanyNif
                })

                //Envio de solicitação para obter os dados da morada
                const addressResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/address/" + idAddress);
                setValuesAddress({
                    ...valuesAddress,
                    MainAddress: addressResponse.data.response.mainAddress,
                    BillingAddress: addressResponse.data.response.billingAddress
                })

                //Envio de solicitação para obter os dados do codigo postal
                const zipCodeResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/zipcode/" + idZipCode);
                setValuesZipCode({
                    ...valuesZipCode,
                    mainZipCode: zipCodeResponse.data.response.mainZipCode,
                    billinigZipCode: zipCodeResponse.data.response.billinigZipCode
                })

                //Envio de solicitação para obter os dados da localidade
                const localityResponse = await axios.get("/api/v1/frontOffice/clientForm/individuals/locality/" + idLocality);
                setValuesLocality({
                    ...valuesLocality,
                    MainLocality: localityResponse.data.response.mainLocality,
                    BillinigLocality: localityResponse.data.response.billinigLocality,
                    NaturalLocality: localityResponse.data.response.naturalLocality,
                })

                //Envio de solicitação para obter os dados da localidade
                const countryResponse = await axios.get('/api/v1/frontOffice/clientForm/individuals/country/' + idCountry);
                setCountry({
                    ...country,
                    CountryAddress: countryResponse.data.response.countryAddress,
                    CountryNationality: countryResponse.data.response.countryNationality,
                    CountryEmission: countryResponse.data.response.countryEmission,
                    CountryBilling: countryResponse.data.response.countryBilling,
                })

                console.log(individualResponse, emailResponse, phoneResponse, addressResponse, zipCodeResponse, localityResponse, countryResponse); // Exibe as respostas do servidor no console
            } catch (error) {
                console.error('Erro ao enviar requisições:', error);
            }
        };

        fetchData();
    }, [idIndividual, idEmail, idPhone, idNif, idAddress, idZipCode, idLocality, idCountry]);


    function handleUpdateIndividual(e) {
        e.preventDefault()
        axios.patch(`/api/v1/frontOffice/clientForm/individuals/` + idIndividual, {
            data: {
                firstName: valuesIndividual.FirstName,
                secondName: valuesIndividual.LastName,
                //country: valuesIndividual.Address,
                region: valuesIndividual.Region,
                birthday: valuesIndividual.Birthday,
                birthTown: valuesIndividual.BirthTown,
                cc: valuesIndividual.CC,
                telephoneNumber: valuesIndividual.TelephoneNumber,
                issuedate: valuesIndividual.IssueDate,
                expiryDateDoc: valuesIndividual.ExpiryDateDoc,
                name: valuesIndividual.Company
            }
        });

        axios.patch(`/api/v1/frontOffice/clientForm/individuals/email/` + idEmail, {
            data: {
                personalEmail: valuesEmail.PersonalEmail,
                professionalEmail: valuesEmail.WorkEmail,
            }
        });

        axios.patch("/api/v1/frontOffice/clientForm/individuals/phone/" + idPhone, {
            data: {
                personalPhone: valuesPhone.PersonalPhone,
                professionalPhone: valuesPhone.WorkPhone,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/individuals/nif/" + idNif, {
            data: {
                guestPersonalNif: valuesNif.GuestPersonalNif,
                guestCompanyNif: valuesNif.GuestCompanyNif,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/individuals/address/" + idAddress, {
            data: {
                mainAddress: valuesAddress.MainAddress,
                billingAddress: valuesAddress.BillingAddress,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/individuals/zipcode/" + idZipCode, {
            data: {
                mainZipCode: valuesZipCode.mainZipCode,
                billinigZipCode: valuesZipCode.billinigZipCode,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/individuals/locality/" + idLocality, {
            data: {
                mainLocality: valuesLocality.MainLocality,
                billinigLocality: valuesLocality.BillinigLocality,
                naturalLocality: valuesLocality.NaturalLocality,
            }
        })

            .catch(err => console.log(err))

    }

    return {
        handleUpdateIndividual, setValuesIndividual, valuesIndividual, setValuesEmail, valuesEmail, setValuesPhone, valuesPhone,
        setValuesNif, valuesNif, setValuesAddress, valuesAddress, setValuesZipCode, valuesZipCode, setValuesLocality, valuesLocality,
        setCountry, country
    };
}
