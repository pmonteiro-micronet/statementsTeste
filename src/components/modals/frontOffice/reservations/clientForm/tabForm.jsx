"use client";

import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody, RadioGroup, Radio } from "@nextui-org/react";
// imports de icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";

import { expansion } from "@/components/functionsForm/expansion/page";

import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";
// import GenderAutocomplete from "@/components/functionsForm/autocomplete/gender/page";

import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
import individualsInsert from "@/components/functionsForm/CRUD/frontOffice/clientForm/individuals/page";
import companiesInsert from "@/components/functionsForm/CRUD/frontOffice/clientForm/companies/page";

import CompanyForm from "@/components/modal/frontOffice/reservations/clientForm/companies/page";

const clientForm = ({
    idIndividual,
    idCountry,
    idEmail,
    idPhone,
    idNif,
    idAddress,
    idZipCode,
    idLocality,
    buttonName,
    buttonIcon,
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    buttonColor,
    criado,
    editado,
    editor
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { toggleExpand, setIsExpanded, isExpanded } = expansion();

    // variaveis de estilo para inputs
    const inputStyle = "w-full border-b-2 border-gray-300 px-1 h-8 outline-none my-2 text-sm"
    const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2"

    // import de funções
    const { handleInputIndividual, handleSubmiIndividual, handleSelect, handleLanguageSelect } = individualsInsert();
    const { handleInputCompany, handleSubmiCompany } = companiesInsert();

    const content = "hidden"
    const showContent = "block"


    const [toggle, setToggle] = useState(1);
    const [formData, setFormData] = useState({});
    const [openModal, setOpenModal] = useState(false);

    function updateToogle(id) {
        setToggle(id);
        if (id === 2) {
            setOpenModal(true);
        }
    }

    const handleSubmiForm = (event) => {
        event.preventDefault();

        if (toggle === 1) {
            handleSubmiIndividual(event);
        } else if (toggle === 2) {
            handleSubmiCompany(event);
        }
    };

    return (
        <>
            <Button onPress={onOpen} color={buttonColor} className="w-fit">
                {buttonName} {buttonIcon}
            </Button>
            <Modal
                classNames={{
                    base: "max-h-screen",
                    wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
                    body: "h-full",
                }}
                size="full"
                className="bg-neutral-100"
                isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true} scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
                                <div className="flex flex-row justify-start gap-4">
                                    {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                </div>
                                <div className='flex flex-row items-center mr-5'>
                                    <Button color="transparent" onPress={onClose} className="-mr-5" type="submit"><TfiSave size={25} /></Button>
                                    <Button color="transparent" className="-mr-5" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
                                    <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row gap-10">
                                    <div className="mt-10 flex flex-col">
                                        <ul className="">
                                            <li className="mb-4 cursor-pointer" onClick={() => updateToogle(1)}>Individuais</li>
                                            <li className="mb-4 cursor-pointer" onClick={() => {
                                                console.log("onClick handler called");
                                                updateToogle(2);
                                            }}>Empresas</li>
                                        </ul>
                                    </div>
                                    <div className={toggle === 1 ? `${showContent}` : `${content}`}>
                                        <form onSubmit={handleSubmiForm}>
                                            <div className="flex flex-col ml-10">
                                                <div className="bg-white flex flex-row justify-between items-center py-5 px-5 mb-5 border boder-neutral-200">
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"name"}
                                                        name={"FirstName"}
                                                        label={"Nome"}
                                                        ariaLabel={"Nome"}
                                                        style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        onChange={handleInputIndividual}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"surname"}
                                                        name={"LastName"}
                                                        label={"Apelido"}
                                                        ariaLabel={"Apelido"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        onChange={handleInputIndividual}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"salutation"}
                                                        name={"Salutation"}
                                                        label={"Saudação"}
                                                        ariaLabel={"Saudação"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    />

                                                    <LanguageAutocomplete
                                                        label={"Idioma"}
                                                        style={""}
                                                        onChange={(value) => handleLanguageSelect(value)}
                                                    />
                                                </div>
                                                {/*primeira linha de comboboxs */}
                                                <div className="flex flex-row justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Endereço</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"address"}
                                                            name={"MainAddress"}
                                                            label={"Morada"}
                                                            ariaLabel={"Morada"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"zipCode"}
                                                            name={"MainZipCode"}
                                                            label={"Código-Postal"}
                                                            ariaLabel={"Código-Postal"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}

                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"local"}
                                                            name={"MainLocality"}
                                                            label={"Localidade"}
                                                            ariaLabel={"Localidade"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"region"}
                                                            name={"Region"}
                                                            label={"Estado-Região"}
                                                            ariaLabel={"Estado-Região"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <div className="w-full flex flex-col gap-4">
                                                            <CountryAutocomplete
                                                                label="País"
                                                                name={"CountryAddress"}
                                                                style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
                                                                onChange={(value) => handleSelect(value, "CountryAddress")}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="pb-5 text-black-100"><b>Contatos</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"personalEmail"}
                                                            name={"PersonalEmail"}
                                                            label={"E-mail Pessoal"}
                                                            ariaLabel={"E-mail Pessoal"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"workEmail"}
                                                            name={"WorkEmail"}
                                                            label={"E-mail Trabalho"}
                                                            ariaLabel={"E-mail Trabalho"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"personalPhone"}
                                                            name={"PersonalPhone"}
                                                            label={"Telemóvel Pessoal"}
                                                            ariaLabel={"Telemóvel Pessoal"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"workPhone"}
                                                            name={"WorkPhone"}
                                                            label={"Telemóvel Trabalho"}
                                                            ariaLabel={"Telemóvel Trabalho"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"house"}
                                                            name={"TelephoneNumber"}
                                                            label={"Casa"}
                                                            ariaLabel={"Casa"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Dados Pessoais</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"birthday"}
                                                            name={"Birthday"}
                                                            label={"Data de Nascimento"}
                                                            ariaLabel={"Data de Nascimento"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"birthdayLocal"}
                                                            name={"BirthTown"}
                                                            label={"Local de Nascimento"}
                                                            ariaLabel={"Local de Nascimento"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"natural"}
                                                            name={"NaturalLocality"}
                                                            label={"Naturalidade"}
                                                            ariaLabel={"Naturalidade"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <CountryAutocomplete
                                                            label="Nacionalidade"
                                                            name={"CountryNationality"}
                                                            style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
                                                            onChange={(value) => handleSelect(value, "CountryNationality")}
                                                        />
                                                        {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Informação Adicional</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"citizenCard"}
                                                            name={"CC"}
                                                            label={"Cartão de Cidadão"}
                                                            ariaLabel={"Cartão de Cidadão"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"issuedOn"}
                                                            name={"IssueDate"}
                                                            label={"Emitido em:"}
                                                            ariaLabel={"Emitido em:"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"expiredOn"}
                                                            name={"ExpiryDateDoc"}
                                                            label={"Expira em:"}
                                                            ariaLabel={"Expira em:"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <CountryAutocomplete
                                                            label="País de emissão"
                                                            name={"CountryEmission"}
                                                            style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
                                                            onChange={(value) => handleSelect(value, "CountryEmission")}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"GuestPersonalNif"}
                                                            name={"GuestPersonalNif"}
                                                            label={"Nr. Identificação fiscal"}
                                                            ariaLabel={"Nr. Identificação fiscal"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                    </div>
                                                </div>
                                                {/*segunda linha de comboboxs */}
                                                <div className="flex flex-row justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Dados Faturação</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"company"}
                                                            name={"Company"}
                                                            label={"Empresa"}
                                                            ariaLabel={"Empresa"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"GuestCompanyNif"}
                                                            name={"GuestCompanyNif"}
                                                            label={"Nr. Identificação fiscal"}
                                                            ariaLabel={"Nr. Identificação fiscal"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"address"}
                                                            name={"BillingAddress"}
                                                            label={"Morada"}
                                                            ariaLabel={"Morada"}
                                                            style={inputStyle}
                                                            onChange={handleInputIndividual}
                                                        />

                                                        <div className="flex flex-row gap-5">
                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"zipCode"}
                                                                name={"BillingZipCode"}
                                                                label={"Cod.-Postal"}
                                                                ariaLabel={"Cod.-Postal"}
                                                                style={sharedLineInputStyle}
                                                                onChange={handleInputIndividual}
                                                            />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"local"}
                                                                name={"BillinigLocality"}
                                                                label={"Localidade"}
                                                                ariaLabel={"Localidade"}
                                                                style={sharedLineInputStyle}
                                                                onChange={handleInputIndividual}
                                                            />

                                                        </div>
                                                        <CountryAutocomplete
                                                            label="País"
                                                            name={"CountryBilling"}
                                                            style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
                                                            onChange={(value) => handleSelect(value, "CountryBilling")}
                                                        />
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Marketing</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"code"}
                                                            name={"Code"}
                                                            label={"Códigos"}
                                                            ariaLabel={"Códigos"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"market"}
                                                            name={"Market"}
                                                            label={"Mercados"}
                                                            ariaLabel={"Mercados"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"marketing"}
                                                            name={"Marketing"}
                                                            label={"Marketing"}
                                                            ariaLabel={"Marketing"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"sentOn"}
                                                            name={"SentOn"}
                                                            label={"Enviado em:"}
                                                            ariaLabel={"Enviado em:"}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Class. empresarial</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"vipCode"}
                                                            name={"VIPCode"}
                                                            label={"Código VIP"}
                                                            ariaLabel={"Código VIP"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"profession"}
                                                            name={"Profession"}
                                                            label={"Profissão"}
                                                            ariaLabel={"Profissão"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"PriceTable"}
                                                            name={"PriceTable"}
                                                            label={"Tabelas de preços"}
                                                            ariaLabel={"Tabelas de preços"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"roomPreference"}
                                                            name={"RoomPreference"}
                                                            label={"Preferências de quartos"}
                                                            ariaLabel={"Preferências de quartos"}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Membros</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"process"}
                                                            name={"Process"}
                                                            label={"Processo"}
                                                            ariaLabel={"Processo"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"subscription"}
                                                            name={"Subscription"}
                                                            label={"Subscrição"}
                                                            ariaLabel={"Subscrição"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"admittedOn"}
                                                            name={"AdmittedOn"}
                                                            label={"Admitido em:"}
                                                            ariaLabel={"Admitido em:"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"experiedOn"}
                                                            name={"ExperiedOn"}
                                                            label={"Expira em:"}
                                                            ariaLabel={"Expira em:"}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                </div>
                                                {/*terceira linha de comboboxs */}
                                                <div className="flex flex-col justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Notas</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"observation1"}
                                                            name={"Observation1"}
                                                            label={"Obs.1."}
                                                            ariaLabel={"Obs.1."}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"observation2"}
                                                            name={"Observation2"}
                                                            label={"Obs.2."}
                                                            ariaLabel={"Obs.2."}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-full px-5 py-5 mb-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Anexos</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col ml-10">
                                                <div className="bg-white flex flex-row justify-between items-center py-5 px-5 mb-5 border boder-neutral-200">
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"companyName"}
                                                        name={"CompanyName"}
                                                        label={"Nome"}
                                                        ariaLabel={"Nome"}
                                                        style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        onChange={handleInputCompany}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"companyName2"}
                                                        name={"CompanyName2"}
                                                        label={"Abreviatura"}
                                                        ariaLabel={"Abreviatura"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        onChange={handleInputCompany}
                                                    />


                                                </div>
                                                {/*primeira linha de comboboxs */}
                                                <div className="flex flex-row justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Geral</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"country"}
                                                            name={"Country"}
                                                            label={"Morada"}
                                                            ariaLabel={"Morada"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"zipCodePostBox"}
                                                            name={"ZipCodePostBox"}
                                                            label={"Código-Postal"}
                                                            ariaLabel={"Código-Postal"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}

                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"town"}
                                                            name={"Town"}
                                                            label={"Localidade"}
                                                            ariaLabel={"Localidade"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"region"}
                                                            name={"Region"}
                                                            label={"Estado-Região"}
                                                            ariaLabel={"Estado-Região"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <div className="w-full flex flex-col gap-4">
                                                            <CountryAutocomplete label="País" name={"CountryAddress"} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} onInputChange={handleInputCompany} />
                                                        </div>
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Info.</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"geralEmail"}
                                                            name={"GeneralEmail"}
                                                            label={"E-mail Geral"}
                                                            ariaLabel={"E-mail Geral"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"departmentEmail"}
                                                            name={"DepartmentEmail"}
                                                            label={"E-mail departamento"}
                                                            ariaLabel={"E-mail departamento"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"geralPhone"}
                                                            name={"GeneralPhone"}
                                                            label={"Telefone Geral"}
                                                            ariaLabel={"Telefone Geral"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"departamentPhone"}
                                                            name={"DepartmentPhone"}
                                                            label={"Telefone departamento"}
                                                            ariaLabel={"Telefone departamento"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"websiteURL"}
                                                            name={"WebsiteURL"}
                                                            label={"URL"}
                                                            ariaLabel={"URL"}
                                                            style={inputStyle}
                                                            onChange={handleInputCompany}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Contacto 1</b></h4>
                                                        </div>
                                                        <div className="flex flex-row gap-5">
                                                            <LanguageAutocomplete label={"Idioma"} style={""} />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"saudation"}
                                                                name={"Saudation"}
                                                                label={"Saudação"}
                                                                ariaLabel={"Saudação"}
                                                                style={inputStyle}
                                                                onChange={handleInputCompany}
                                                            />
                                                        </div>

                                                        <div className="flex flex-row gap-5">
                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"firstName"}
                                                                name={"FirstName"}
                                                                label={"Nome"}
                                                                ariaLabel={"Nome"}
                                                                style={inputStyle}
                                                                onChange={handleInputCompany}
                                                            />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"secondName"}
                                                                name={"SecondName"}
                                                                label={"Apelido"}
                                                                ariaLabel={"Apelido"}
                                                                style={inputStyle}
                                                            />
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"department"}
                                                            name={"Department"}
                                                            label={"Departmento"}
                                                            ariaLabel={"Departmento"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"phoneNumber"}
                                                            name={"PhoneNumber"}
                                                            label={"Telemóvel"}
                                                            ariaLabel={"Telemóvel"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"email"}
                                                            name={"Email"}
                                                            label={"E-mail"}
                                                            ariaLabel={"E-mail"}
                                                            style={inputStyle}
                                                        />

                                                        {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
                                                        {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Contacto 2</b></h4>
                                                        </div>
                                                        <div className="flex flex-row gap-5">
                                                            <LanguageAutocomplete label={"Idioma"} style={sharedLineInputStyle} />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"saudation"}
                                                                name={"Saudation"}
                                                                label={"Saudação"}
                                                                ariaLabel={"Saudação"}
                                                                style={sharedLineInputStyle}
                                                                onChange={handleInputCompany}
                                                            />
                                                        </div>

                                                        <div className="flex flex-row gap-5">
                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"firstName"}
                                                                name={"FirstName"}
                                                                label={"Nome"}
                                                                ariaLabel={"Nome"}
                                                                style={sharedLineInputStyle}
                                                                onChange={handleInputCompany}
                                                            />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"secondName"}
                                                                name={"SecondName"}
                                                                label={"Apelido"}
                                                                ariaLabel={"Apelido"}
                                                                style={sharedLineInputStyle}
                                                            />
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"department"}
                                                            name={"Department"}
                                                            label={"Departmento"}
                                                            ariaLabel={"Departmento"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"phoneNumber"}
                                                            name={"PhoneNumber"}
                                                            label={"Telemóvel"}
                                                            ariaLabel={"Telemóvel"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"email"}
                                                            name={"email"}
                                                            label={"E-mail"}
                                                            ariaLabel={"E-mail"}
                                                            style={inputStyle}
                                                        />

                                                        {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
                                                        {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
                                                    </div>
                                                </div>
                                                {/*segunda linha de comboboxs */}
                                                <div className="flex flex-row justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Marketing</b></h4>
                                                        </div>
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"codes"}
                                                            name={"Codes"}
                                                            label={"Códigos"}
                                                            ariaLabel={"Códigos"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"market"}
                                                            name={"Market"}
                                                            label={"Mercado"}
                                                            ariaLabel={"Mercado"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"marketing"}
                                                            name={"Marketing"}
                                                            label={"Marketing"}
                                                            ariaLabel={"Marketing"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"sendData"}
                                                            name={"SendData"}
                                                            label={"Enviado em:"}
                                                            ariaLabel={"Enviado em:"}
                                                            style={inputStyle}
                                                        />
                                                    </div>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Classificação empresarial</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"Fiscal"}
                                                            name={"Fiscal"}
                                                            label={"Nr. Identificação Fiscal"}
                                                            ariaLabel={"Nr. Identificação Fiscal"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"CAECode"}
                                                            name={"CAECode"}
                                                            label={"Código CAE"}
                                                            ariaLabel={"Código CAE"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"prices"}
                                                            name={"Prices"}
                                                            label={"Tabela de preços"}
                                                            ariaLabel={"Tabela de preços"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"preferencesRoom"}
                                                            name={"preferencesRoom"}
                                                            label={"Preferencias de quartos"}
                                                            ariaLabel={"Preferencias de quartos"}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                </div>
                                                {/*terceira linha de comboboxs */}
                                                <div className="flex flex-col justify-between gap-2 mb-5">
                                                    <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Notas</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"observation1"}
                                                            name={"Observation1"}
                                                            label={"Obs.1."}
                                                            ariaLabel={"Obs.1."}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"observation2"}
                                                            name={"Observation2"}
                                                            label={"Obs.2."}
                                                            ariaLabel={"Obs.2."}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                    <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>Anexos</b></h4>
                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={""}
                                                            name={""}
                                                            label={""}
                                                            ariaLabel={""}
                                                            style={inputStyle}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    {/**TAB DE EMPRESAS */}
                                    <div className={toggle === 2 ? `${showContent}` : `${content}`}>
                                        <Modal isOpen={openModal} onOpenChange={setOpenModal}>
                                            <CompanyForm />
                                        </Modal>

                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default clientForm;