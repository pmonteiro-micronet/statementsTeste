"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function companiesInsert() {

     //inserção na tabela client preference
    const [company, setCompany] = useState({
        CompanyName: '',
        CompanyName2: '',
        Country: '',
        ZipCodePostBox: '',
        Town: '',
        Region: '',
        CountryAddress: '',
        WebsiteURL: '',
        GeneralPhone: '',
        DepartmentPhone: '',
        GeneralEmail: '',
        DepartmentEmail: ''
    })

    const handleInputCompany = (event) => {
        setCompany({ ...company, [event.target.name]: event.target.value })
    }
    async function handleSubmiCompany(event) {
        event.preventDefault()
      
        if (!company.CompanyName || !company.CompanyName2 || !company.Country || !company.ZipCodePostBox || !company.Town || !company.Region || /*!company.CountryAddress ||*/ !company.WebsiteURL || !company.GeneralEmail || !company.DepartmentEmail || !company.GeneralPhone || !company.DepartmentPhone) {
            alert("Preencha os campos corretamente");
            return;
        }
      
      try {
            // Envio da solicitação para criar os emails
            const emailCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/companies/email', {
                data: {
                    generalEmail: company.GeneralEmail,
                    departmentEmail: company.DepartmentEmail,
                }
            });
            const guestEmailsID = await emailCreationInfo.data.newRecord.guestEmailsID.toString();


            const phoneCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/companies/phone', {
                data: {
                    generalPhone: company.GeneralPhone,
                    departmentPhone: company.DepartmentPhone,
                }
            });
            const guestPhoneID = await phoneCreationInfo.data.newRecord.guestPhoneID.toString();

            /*
            const addressCreationInfo = await axios.put('/api/v1/frontOffice/clientForm/individuals/address', {
                data: {
                    mainAddress: individual.MainAddress,
                    billingAddress: individual.BillingAddress,
                }
            });
            const guestAddressID = await addressCreationInfo.data.newRecord.guestAddressID.toString();*/

            // Envio da solicitação para criar o indivíduo
            const response = await axios.put('/api/v1/frontOffice/clientForm/companies', {
                data: {
                companyName: company.CompanyName,
                companyName2: company.CompanyName2,
                country: company.Country,
                zipCodePostBox: company.ZipCodePostBox,
                town: company.Town,
                region: company.Region,
                //countryAddress: company.Country,
                websiteURL: company.WebsiteURL,
                email: guestEmailsID,
                phoneNumber: guestPhoneID,
                }
            });
            //console.log(response); // Exibe a resposta do servidor no console
        } catch (error) {
            console.error('Erro ao enviar requisições:', error);
        }
      
    }
    return { 
        handleInputCompany, handleSubmiCompany
    };
}

export function companiesEdit(idCompany, idEmail, idPhone) {
    //edição na tabela client preference
    const [valuesCompany, setValuesCompany] = useState({
        id: idCompany,
        CompanyName: '',
        CompanyName2: '',
        Country: '',
        ZipCodePostBox: '',
        Town: '',
        Region: '',
        CountryAddress: '',
        WebsiteURL: '',
        GeneralPhone: '',
        DepartmentPhone: '',
        GeneralEmail: '',
        DepartmentEmail: ''
    })
    
    const [valuesEmail, setValuesEmail] = useState({
        GeneralEmail: '',
        DepartmentEmail: '',
    })
    const [valuesPhone, setValuesPhone] = useState({
        GeneralPhone: '',
        DepartmentPhone: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Envio da solicitação para obter os dados do indivíduo
                const companyResponse = await axios.get("/api/v1/frontOffice/clientForm/companies/" + idCompany);
                
    
                setValuesCompany({ 
                    ...valuesCompany, 
                    CompanyName: companyResponse.data.response.companyName, 
                    CompanyName2: companyResponse.data.response.companyName2, 
                    Country: companyResponse.data.response.country,
                    ZipCodePostBox: companyResponse.data.response.zipCodePostBox,
                    Town: companyResponse.data.response.town,
                    Region: companyResponse.data.response.region,
                    CountryAddress: companyResponse.data.response.countryAddress,
                    WebsiteURL: companyResponse.data.response.websiteURL,
                    GeneralPhone: companyResponse.data.response.generalPhone,
                    DepartmentPhone: companyResponse.data.response.departmentPhone,
                    GeneralEmail: companyResponse.data.response.generalEmail,
                    DepartmentEmail: companyResponse.data.response.departmentEmail,
                });
    
                // Envio da solicitação para obter os dados de email
                
                const emailResponse = await axios.get("/api/v1/frontOffice/clientForm/companies/email/" + idEmail);
                setValuesEmail({ 
                    ...valuesEmail, 
                    GeneralEmail: emailResponse.data.response.generalEmail,
                    DepartmentEmail: emailResponse.data.response.departmentEmail
                });

                //Envio de solicitação para obter os dados do tlm
                const phoneResponse = await axios.get("/api/v1/frontOffice/clientForm/companies/phone/" + idPhone);
                setValuesPhone({
                    ...valuesPhone,
                    GeneralPhone: phoneResponse.data.response.generalPhone,
                    DepartmentPhone: phoneResponse.data.response.departmentPhone
                })
    
                console.log(companyResponse, emailResponse, phoneResponse); // Exibe as respostas do servidor no console
            } catch (error) {
                console.error('Erro ao enviar requisições:', error);
            }
        };
    
        fetchData();
    }, [idCompany, idEmail, idPhone]);


    function handleUpdateCompany(e) {
        e.preventDefault()
        axios.patch(`/api/v1/frontOffice/clientForm/companies/` + idCompany, {
            data: {
                companyName: valuesCompany.CompanyName,
                companyName2: valuesCompany.CompanyName2,
                country: valuesCompany.Country,
                zipCodePostBox: valuesCompany.ZipCodePostBox,
                town: valuesCompany.Town,
                region: valuesCompany.Region,
                websiteURL: valuesCompany.WebsiteURL,
            }
        });
        
        axios.patch(`/api/v1/frontOffice/clientForm/companies/email/` + idEmail, {
            data: {
                generalEmail: valuesEmail.GeneralEmail,
                departmentEmail: valuesEmail.DepartmentEmail,
            }
        });

        axios.patch("/api/v1/frontOffice/clientForm/companies/phone/" + idPhone, {
            data: {
                generalPhone: valuesPhone.GeneralPhone,
                departmentPhone: valuesPhone.DepartmentPhone,
            }
        })
            .catch(err => console.log(err))
            

    }

    return { 
        handleUpdateCompany, setValuesCompany, valuesCompany, setValuesEmail, valuesEmail, setValuesPhone, valuesPhone
    };
}
