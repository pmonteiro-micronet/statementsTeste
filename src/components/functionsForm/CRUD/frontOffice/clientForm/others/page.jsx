"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function othersInsert() {

    //inserção na tabela client preference
    const [others, setOthers] = useState({
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

        setOthers({
            ...others,
            [fieldName]: country.land
        })
    };

    //preenchimento automatico do país atraves de autocomplete
    const handleLanguageSelect = (language) => {
        setOthers({
            ...others,
            Language: language.codeNr
        });
    };

    const handleInputOthers = (event) => {
        setOthers({ ...others, [event.target.name]: event.target.value })
    }
    async function handleSubmitOthers(event) {
        event.preventDefault()

        if (!others.LastName) {
            alert("Preencha os campos corretamente");
            return;
        }

        try {

            // Envio da solicitação para criar os emails
            const countryCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/country', {
                data: {
                    countryAddress: others.CountryAddress,
                    countryNationality: others.CountryNationality,
                    countryEmission: others.CountryEmission,
                    countryBilling: others.CountryBilling,
                }
            });
            const countryID = await countryCreationInfo.data.newRecord.countryID.toString();

            // Envio da solicitação para criar os emails
            const emailCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/email', {
                data: {
                    personalEmail: others.PersonalEmail,
                    professionalEmail: others.WorkEmail,
                }
            });
            const guestEmailsID = await emailCreationInfo.data.newRecord.guestEmailsID.toString();


            const phoneCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/phone', {
                data: {
                    personalPhone: others.PersonalPhone,
                    professionalPhone: others.WorkPhone,
                }
            });
            const guestPhoneID = await phoneCreationInfo.data.newRecord.guestPhoneID.toString();

            const nifCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/nif', {
                data: {
                    guestPersonalNif: others.GuestPersonalNif,
                    guestCompanyNif: others.GuestCompanyNif,
                }
            });
            const guestNifID = await nifCreationInfo.data.newRecord.guestNifID.toString();

            // Envio da solicitação para criar as moradas
            const addressCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/address', {
                data: {
                    mainAddress: others.MainAddress,
                    billingAddress: others.BillingAddress,
                }
            });
            const guestAddressID = await addressCreationInfo.data.newRecord.guestAddressID.toString();

            // Envio da solicitação para criar codigo postal
            const zipCodeCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/zipcode', {
                data: {
                    mainZipCode: others.MainZipCode,
                    billinigZipCode: others.BillingZipCode,
                }
            });
            const guestZipCodeID = await zipCodeCreationInfo.data.newRecord.guestZipCodeID.toString();

            // Envio da solicitação para criar localidades
            const localityCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/others/locality', {
                data: {
                    mainLocality: others.MainLocality,
                    billinigLocality: others.BillinigLocality,
                    naturalLocality: others.NaturalLocality,
                }
            });
            const guestLocalityID = await localityCreationInfo.data.newRecord.guestLocalityID.toString();

            // Envio da solicitação para criar o indivíduo
            const response = await axios.put('/api/v1/frontOffice/clientForm/others', {
                data: {
                    firstName: others.FirstName,
                    secondName: others.LastName,
                    country: guestAddressID,
                    zipCode: guestZipCodeID,
                    region: others.Region,
                    countryAddress: countryID, //id da tabela secundaria paises
                    birthday: others.Birthday,
                    birthTown: others.BirthTown,
                    cc: others.CC,
                    issuedate: others.IssueDate,
                    expiryDateDoc: others.ExpiryDateDoc,
                    email: guestEmailsID,
                    phoneNumber: guestPhoneID,
                    telephoneNumber: others.TelephoneNumber,
                    nif: guestNifID,
                    name: others.Company,
                    town: guestLocalityID,
                    languageID: others.Language
                }
            });
            console.log(response); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }

    }
    return {
        handleInputOthers, handleSubmitOthers, handleSelect, handleLanguageSelect
    };
}

export function othersEdit(idOthers, idEmail, idPhone, idNif, idAddress, idZipCode, idLocality, idCountry) {
    //edição na tabela client preference
    const [valuesOther, setValuesOther] = useState({
        id: idOthers,
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
                const otherResponse = await axios.get("/api/v1/frontOffice/clientForm/others/" + idOthers);
                const formattedBirthday = new Date(otherResponse.data.response.birthday).toLocaleDateString();
                const formattedIssueDate = new Date(otherResponse.data.response.issuedate).toLocaleDateString();
                const formattedExpiryDateDoc = new Date(otherResponse.data.response.expiryDateDoc).toLocaleDateString();

                setValuesOther({
                    ...valuesOther,
                    FirstName: otherResponse.data.response.firstName,
                    LastName: otherResponse.data.response.secondName,
                    //MainAddress: otherResponse.data.response.country,
                    Region: otherResponse.data.response.region,
                    Birthday: formattedBirthday,
                    BirthTown: otherResponse.data.response.birthTown,
                    CC: otherResponse.data.response.cc,
                    TelephoneNumber: otherResponse.data.response.telephoneNumber,
                    IssueDate: formattedIssueDate,
                    ExpiryDateDoc: formattedExpiryDateDoc,
                    Company: otherResponse.data.response.name
                });

                // Envio da solicitação para obter os dados de email
                const emailResponse = await axios.get("/api/v1/frontOffice/clientForm/others/email/" + idEmail);
                setValuesEmail({
                    ...valuesEmail,
                    PersonalEmail: emailResponse.data.response.personalEmail,
                    WorkEmail: emailResponse.data.response.professionalEmail
                });

                //Envio de solicitação para obter os dados do tlm
                const phoneResponse = await axios.get("/api/v1/frontOffice/clientForm/others/phone/" + idPhone);
                setValuesPhone({
                    ...valuesPhone,
                    PersonalPhone: phoneResponse.data.response.personalPhone,
                    WorkPhone: phoneResponse.data.response.professionalPhone
                })

                //Envio de solicitação para obter os dados do tlm
                const nifResponse = await axios.get("/api/v1/frontOffice/clientForm/others/nif/" + idNif);
                setValuesNif({
                    ...valuesNif,
                    GuestPersonalNif: nifResponse.data.response.guestPersonalNif,
                    GuestCompanyNif: nifResponse.data.response.guestCompanyNif
                })

                //Envio de solicitação para obter os dados da morada
                const addressResponse = await axios.get("/api/v1/frontOffice/clientForm/others/address/" + idAddress);
                setValuesAddress({
                    ...valuesAddress,
                    MainAddress: addressResponse.data.response.mainAddress,
                    BillingAddress: addressResponse.data.response.billingAddress
                })

                //Envio de solicitação para obter os dados do codigo postal
                const zipCodeResponse = await axios.get("/api/v1/frontOffice/clientForm/others/zipcode/" + idZipCode);
                setValuesZipCode({
                    ...valuesZipCode,
                    mainZipCode: zipCodeResponse.data.response.mainZipCode,
                    billinigZipCode: zipCodeResponse.data.response.billinigZipCode
                })

                //Envio de solicitação para obter os dados da localidade
                const localityResponse = await axios.get("/api/v1/frontOffice/clientForm/others/locality/" + idLocality);
                setValuesLocality({
                    ...valuesLocality,
                    MainLocality: localityResponse.data.response.mainLocality,
                    BillinigLocality: localityResponse.data.response.billinigLocality,
                    NaturalLocality: localityResponse.data.response.naturalLocality,
                })

                //Envio de solicitação para obter os dados da localidade
                const countryResponse = await axios.get('/api/v1/frontOffice/clientForm/others/country/' + idCountry);
                setCountry({
                    ...country,
                    CountryAddress: countryResponse.data.response.countryAddress,
                    CountryNationality: countryResponse.data.response.countryNationality,
                    CountryEmission: countryResponse.data.response.countryEmission,
                    CountryBilling: countryResponse.data.response.countryBilling,
                })

                console.log(otherResponse, emailResponse, phoneResponse, addressResponse, zipCodeResponse, localityResponse, countryResponse); // Exibe as respostas do servidor no console
            } catch (error) {
                console.error('Erro ao enviar requisições:', error);
            }
        };

        fetchData();
    }, [idOthers, idEmail, idPhone, idNif, idAddress, idZipCode, idLocality, idCountry]);


    function handleUpdateOther(e) {
        e.preventDefault()
        axios.patch(`/api/v1/frontOffice/clientForm/others/` + idOthers, {
            data: {
                firstName: valuesOther.FirstName,
                secondName: valuesOther.LastName,
                //country: valuesOther.Address,
                region: valuesOther.Region,
                birthday: valuesOther.Birthday,
                birthTown: valuesOther.BirthTown,
                cc: valuesOther.CC,
                telephoneNumber: valuesOther.TelephoneNumber,
                issuedate: valuesOther.IssueDate,
                expiryDateDoc: valuesOther.ExpiryDateDoc,
                name: valuesOther.Company
            }
        });

        axios.patch(`/api/v1/frontOffice/clientForm/others/email/` + idEmail, {
            data: {
                personalEmail: valuesEmail.PersonalEmail,
                professionalEmail: valuesEmail.WorkEmail,
            }
        });

        axios.patch("/api/v1/frontOffice/clientForm/others/phone/" + idPhone, {
            data: {
                personalPhone: valuesPhone.PersonalPhone,
                professionalPhone: valuesPhone.WorkPhone,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/others/nif/" + idNif, {
            data: {
                guestPersonalNif: valuesNif.GuestPersonalNif,
                guestCompanyNif: valuesNif.GuestCompanyNif,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/others/address/" + idAddress, {
            data: {
                mainAddress: valuesAddress.MainAddress,
                billingAddress: valuesAddress.BillingAddress,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/others/zipcode/" + idZipCode, {
            data: {
                mainZipCode: valuesZipCode.mainZipCode,
                billinigZipCode: valuesZipCode.billinigZipCode,
            }
        })

        axios.patch("/api/v1/frontOffice/clientForm/others/locality/" + idLocality, {
            data: {
                mainLocality: valuesLocality.MainLocality,
                billinigLocality: valuesLocality.BillinigLocality,
                naturalLocality: valuesLocality.NaturalLocality,
            }
        })

            .catch(err => console.log(err))

    }

    return {
        handleUpdateOther, setValuesOther, valuesOther, setValuesEmail, valuesEmail, setValuesPhone, valuesPhone,
        setValuesNif, valuesNif, setValuesAddress, valuesAddress, setValuesZipCode, valuesZipCode, setValuesLocality, valuesLocality,
        setCountry, country
    };
}
