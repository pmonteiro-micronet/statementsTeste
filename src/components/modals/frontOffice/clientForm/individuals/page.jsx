"use client"
// import React, { useState, useEffect } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
// //imports de icons
// import { TfiSave } from "react-icons/tfi";
// import { LiaExpandSolid } from "react-icons/lia";
// import { MdClose } from "react-icons/md";
// import { FiEdit3 } from "react-icons/fi";
// import { BsArrowRight } from "react-icons/bs";

// import { expansion } from "@/components/functionsForm/expansion/page";

// import CompanyForm from "../companies/page";
// import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
// import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";
// //import GenderAutocomplete from "@/components/functionsForm/autocomplete/gender/page";

// import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
// import individualsInsert, { individualsEdit } from "@/components/functionsForm/CRUD/frontOffice/clientForm/individuals/page";

// import en from "../../../../../../public/locales/english/common.json";
// import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
// import es from "../../../../../../public/locales/espanol/common.json";

// const translations = { en, pt, es };

const individualForm = ({
    // idIndividual,
    // idCountry,
    // idEmail,
    // idPhone,
    // idNif,
    // idAddress,
    // idZipCode,
    // idLocality,
    // buttonName,
    // buttonIcon,
    // modalHeader,
    // editIcon,
    // modalEditArrow,
    // modalEdit,
    // formTypeModal,
    // buttonColor,
    // buttonClass,
    // criado,
    // editado,
    // editor
}) => {

    // const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // const { toggleExpand, setIsExpanded, isExpanded } = expansion();

    // //variaveis de estilo para inputs
    // const inputStyle = "w-full border-b-2 border-gray-300 px-1 h-8 outline-none my-2 text-sm"
    // const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2"

    // //import de funções
    // const { handleInputIndividual, handleSubmiIndividual, handleSelect, handleLanguageSelect } = individualsInsert();
    // const { handleUpdateIndividual, setValuesIndividual, valuesIndividual, setValuesEmail, valuesEmail,
    //     setValuesPhone, valuesPhone, setValuesNif, valuesNif, setValuesAddress, valuesAddress, setValuesZipCode, valuesZipCode,
    //     setValuesLocality, valuesLocality, setCountry, country
    // } = individualsEdit(idIndividual, idEmail, idPhone, idNif, idAddress, idZipCode, idLocality, idCountry);

    //  const [locale, setLocale] = useState("pt");
    //   useEffect(() => {
    //     // Carregar o idioma do localStorage
    //     const storedLanguage = localStorage.getItem("language");
    //     if (storedLanguage) {
    //       setLocale(storedLanguage);
    //     }
    //   }, []);
    
    //   // Carregar as traduções com base no idioma atual
    //   const t = translations[locale] || translations["pt"]; // fallback para "pt"

    return (
        // <>

        //     {formTypeModal === 0 && ( //individuals insert
        //         <>
        //             <Button onPress={onOpen} color={buttonColor} className={`w-fit ${buttonClass}`}>
        //                 {buttonName} {buttonIcon}
        //             </Button>
        //             <Modal
        //                 classNames={{
        //                     base: "max-h-screen",
        //                     wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
        //                     body: "h-full",
        //                 }}
        //                 size="full"
        //                 className="bg-neutral-100"
        //                 isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true} scrollBehavior="inside">
        //                 <ModalContent>
        //                     {(onClose) => (
        //                         <>
        //                             <form onSubmit={handleSubmiIndividual}>
        //                                 <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
        //                                     <div className="flex flex-row justify-start gap-4">
        //                                         {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
        //                                     </div>
        //                                     <div className='flex flex-row items-center mr-5'>
        //                                         <Button color="transparent" onPress={onClose} className="-mr-5" type="submit"><TfiSave size={25} /></Button>
        //                                         <Button color="transparent" className="-mr-5" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
        //                                         <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
        //                                     </div>
        //                                 </ModalHeader>
        //                                 <ModalBody className="flex flex-col mx-5 my-5 space-y-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        //                                     {/*<div className="h-1">
        //                                         <CompanyForm
        //                                             buttonName={"Empresas"}
        //                                             modalHeader={"Inserir Ficha de Cliente"}
        //                                             modalEditArrow={<BsArrowRight size={25} />}
        //                                             modalEdit={"Empresa"}
        //                                             buttonColor={"transparent"}
        //                                             formTypeModal={1}
        //                                         />
        //                     </div>*/}
        //                                     <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"name"}
        //                                             name={"FirstName"}
        //                                             label={"First Name"}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputIndividual}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"surname"}
        //                                             name={"LastName"}
        //                                             label={"Last Name"}
        //                                             ariaLabel={"Last Name"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputIndividual}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"salutation"}
        //                                             name={"Salutation"}
        //                                             label={"Salutation"}
        //                                             ariaLabel={"Salutation"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                         />

        //                                         <LanguageAutocomplete
        //                                             label={"Language"}
        //                                             style={""}
        //                                             onChange={(value) => handleLanguageSelect(value)}
        //                                         />
        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.addressTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"MainAddress"}
        //                                                 label={"Address"}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"zipCode"}
        //                                                 name={"MainZipCode"}
        //                                                 label={"Postal Code"}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}

        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"local"}
        //                                                 name={"MainLocality"}
        //                                                 label={"Locality"}
        //                                                 ariaLabel={"Locality"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"region"}
        //                                                 name={"Region"}
        //                                                 label={"Region/State"}
        //                                                 ariaLabel={"Region/State"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete
        //                                                     label={"Country"}
        //                                                     name={"CountryAddress"}
        //                                                     style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                     onChange={(value) => handleSelect(value, "CountryAddress")}
        //                                                 />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="flex justify-between items-center">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contactsTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"personalEmail"}
        //                                                 name={"PersonalEmail"}
        //                                                 label={"Personal Email"}
        //                                                 ariaLabel={"Personal Email"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"workEmail"}
        //                                                 name={"WorkEmail"}
        //                                                 label={"Work Email"}
        //                                                 ariaLabel={"Work Email"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"personalPhone"}
        //                                                 name={"PersonalPhone"}
        //                                                 label={"Personal Phone"}
        //                                                 ariaLabel={"Personal Phone Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"workPhone"}
        //                                                 name={"WorkPhone"}
        //                                                 label={"Work Phone"}
        //                                                 ariaLabel={"Work Phone Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"house"}
        //                                                 name={"TelephoneNumber"}
        //                                                 label={"Home Phone"}
        //                                                 ariaLabel={"Home Phone Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.personalDataTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"date"}
        //                                                 id={"birthday"}
        //                                                 name={"Birthday"}
        //                                                 label={"Birthdate"}
        //                                                 ariaLabel={"Birthdate"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"birthdayLocal"}
        //                                                 name={"BirthTown"}
        //                                                 label={"Birthplace"}
        //                                                 ariaLabel={"Birthplace"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"natural"}
        //                                                 name={"NaturalLocality"}
        //                                                 label={"Origin Place"}
        //                                                 ariaLabel={"Origin Place"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <CountryAutocomplete
        //                                                 label={"Nationality"}
        //                                                 name={"CountryNationality"}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 onChange={(value) => handleSelect(value, "CountryNationality")}
        //                                             />
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.additionalInformationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"citizenCard"}
        //                                                 name={"CC"}
        //                                                 label={t("frontOffice.clientFiles.citizenCardLabel")}
        //                                                 ariaLabel={"Citizen Card"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"date"}
        //                                                 id={"issuedOn"}
        //                                                 name={"IssueDate"}
        //                                                 label={t("frontOffice.clientFiles.issuedLabel")}
        //                                                 ariaLabel={"Issued On:"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"date"}
        //                                                 id={"expiredOn"}
        //                                                 name={"ExpiryDateDoc"}
        //                                                 label={t("frontOffice.clientFiles.expiresLabel")}
        //                                                 ariaLabel={"Expires On:"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <CountryAutocomplete
        //                                                 label={t("frontOffice.clientFiles.countryIssueLabel")}
        //                                                 name={"CountryEmission"}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 onChange={(value) => handleSelect(value, "CountryEmission")}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"GuestPersonalNif"}
        //                                                 name={"GuestPersonalNif"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                     {/*segunda linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.billingDataTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"company"}
        //                                                 name={"Company"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Company"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"GuestCompanyNif"}
        //                                                 name={"GuestCompanyNif"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"BillingAddress"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputIndividual}
        //                                             />

        //                                             <div className="flex flex-row gap-5">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"zipCode"}
        //                                                     name={"BillingZipCode"}
        //                                                     label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                     ariaLabel={"Postal Code"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputIndividual}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"local"}
        //                                                     name={"BillinigLocality"}
        //                                                     label={t("frontOffice.clientFiles.localityLabel")}
        //                                                     ariaLabel={"Locality"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputIndividual}
        //                                                 />

        //                                             </div>
        //                                             <CountryAutocomplete
        //                                                 label={t("frontOffice.clientFiles.countryLabel")}
        //                                                 name={"CountryBilling"}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 onChange={(value) => handleSelect(value, "CountryBilling")}
        //                                             />
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.marketingTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"code"}
        //                                                 name={"Code"}
        //                                                 label={t("frontOffice.clientFiles.marketingCodesLabel")}
        //                                                 ariaLabel={"Marketing Codes"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"market"}
        //                                                 name={"Market"}
        //                                                 label={t("frontOffice.clientFiles.marketingMarketsLabel")}
        //                                                 ariaLabel={"Markets"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"marketing"}
        //                                                 name={"Marketing"}
        //                                                 label={t("frontOffice.clientFiles.marketingLabel")}
        //                                                 ariaLabel={"Marketing"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"sentOn"}
        //                                                 name={"SentOn"}
        //                                                 label={t("frontOffice.clientFiles.sentLabel")}
        //                                                 ariaLabel={"Sent on:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.businessClassTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"vipCode"}
        //                                                 name={"VIPCode"}
        //                                                 label={t("frontOffice.clientFiles.vipCodeLabel")}
        //                                                 ariaLabel={"VIP Code"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"profession"}
        //                                                 name={"Profession"}
        //                                                 label={t("frontOffice.clientFiles.professionLabel")}
        //                                                 ariaLabel={"Profession"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"PriceTable"}
        //                                                 name={"PriceTable"}
        //                                                 label={t("frontOffice.clientFiles.priceTableLabel")}
        //                                                 ariaLabel={"Price Table"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"roomPreference"}
        //                                                 name={"RoomPreference"}
        //                                                 label={t("frontOffice.clientFiles.roomPreferencesLabel")}
        //                                                 ariaLabel={"Room Preferences"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.membersTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"process"}
        //                                                 name={"Process"}
        //                                                 label={t("frontOffice.clientFiles.processLabel")}
        //                                                 ariaLabel={"Process"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"subscription"}
        //                                                 name={"Subscription"}
        //                                                 label={t("frontOffice.clientFiles.subscriptionLabel")}
        //                                                 ariaLabel={"Subscription"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"admittedOn"}
        //                                                 name={"AdmittedOn"}
        //                                                 label={t("frontOffice.clientFiles.admittedLabel")}
        //                                                 ariaLabel={"Admitted On:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"experiedOn"}
        //                                                 name={"ExperiedOn"}
        //                                                 label={t("frontOffice.clientFiles.expiresLabel")}
        //                                                 ariaLabel={"Expires On:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                     {/*terceira linha de comboboxs */}
        //                                     <div className="flex flex-col justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.notesTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"observation1"}
        //                                                 name={"Observation1"}
        //                                                 label={t("frontOffice.clientFiles.notesObs1Label")}
        //                                                 ariaLabel={"Obs.1."}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"observation2"}
        //                                                 name={"Observation2"}
        //                                                 label={t("frontOffice.clientFiles.notesObs2Label")}
        //                                                 ariaLabel={"Obs.2."}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.attachmentsTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                 </ModalBody>
        //                             </form>
        //                         </>
        //                     )}
        //                 </ModalContent>
        //             </Modal>
        //         </>
        //     )}

        //     {formTypeModal === 1 && ( //individuals edit
        //         <>
        //             <Button onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3">
        //                 {buttonName} {buttonIcon}
        //             </Button>
        //             <Modal
        //                 classNames={{
        //                     base: "max-h-screen",
        //                     wrapper: isExpanded ? "w-full h-screen" : "lg:pl-72 h-screen w-full",
        //                     body: "h-full",
        //                 }}
        //                 size="full"
        //                 className="bg-neutral-100"
        //                 isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true} scrollBehavior="inside">
        //                 <ModalContent>
        //                     {(onClose) => (
        //                         <>
        //                             <form onSubmit={(e) => handleUpdateIndividual(e)}>
        //                                 <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
        //                                     <div className="flex flex-row justify-start gap-4">
        //                                         {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
        //                                     </div>
        //                                     <div className='flex flex-row items-center mr-5'>
        //                                         <Button color="transparent" onPress={onClose} className="-mr-5" type="submit"><TfiSave size={25} /></Button>
        //                                         <Button color="transparent" className="-mr-5" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
        //                                         <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
        //                                     </div>
        //                                 </ModalHeader>
        //                                 <ModalBody className="flex flex-col mx-5 my-5 space-y-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
        //                                     {/*<div className="h-1">
        //                                         <CompanyForm
        //                                             buttonName={"Empresas"}
        //                                             modalHeader={"Inserir Ficha de Cliente"}
        //                                             modalEditArrow={<BsArrowRight size={25} />}
        //                                             modalEdit={"Empresa"}
        //                                             buttonColor={"transparent"}
        //                                             formTypeModal={1}
        //                                         />
        //                     </div>*/}
        //                                     <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"name"}
        //                                             name={"FirstName"}
        //                                             label={t("frontOffice.clientFiles.nameLabel")}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesIndividual.FirstName}
        //                                             onChange={e => setValuesIndividual({ ...valuesIndividual, FirstName: e.target.value })}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"surname"}
        //                                             name={"LastName"}
        //                                             label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                             ariaLabel={"Last Name"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesIndividual.LastName}
        //                                             onChange={e => setValuesIndividual({ ...valuesIndividual, LastName: e.target.value })}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"salutation"}
        //                                             name={"Salutation"}
        //                                             label={t("frontOffice.clientFiles.salutationLabel")}
        //                                             ariaLabel={"Salutation"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                         />

        //                                         <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={""} />
        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.addressTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"MainAddress"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 value={valuesAddress.MainAddress}
        //                                                 onChange={e => setValuesAddress({ ...valuesAddress, MainAddress: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"zipCode"}
        //                                                 name={"ZipCode"}
        //                                                 label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 value={valuesZipCode.mainZipCode}
        //                                                 onChange={e => setValuesZipCode({ ...valuesZipCode, mainZipCode: e.target.value })}

        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"local"}
        //                                                 name={"Local"}
        //                                                 label={t("frontOffice.clientFiles.localityLabel")}
        //                                                 ariaLabel={"Locality"}
        //                                                 style={inputStyle}
        //                                                 value={valuesLocality.MainLocality}
        //                                                 onChange={e => setValuesLocality({ ...valuesLocality, MainLocality: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"region"}
        //                                                 name={"Region"}
        //                                                 label={t("frontOffice.clientFiles.regionStateLabel")}
        //                                                 ariaLabel={"Region/State"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.Region}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, Region: e.target.value })}
        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete
        //                                                     label={t("frontOffice.clientFiles.countryLabel")}
        //                                                     name={"CountryAddress"}
        //                                                     style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                     value={country.CountryAddress} // Valor controlado
        //                                                     onChange={(newValue, fieldName) => setCountry({ ...country, [fieldName]: newValue.land })} // Atualiza o valor controlado
        //                                                     fieldName="CountryAddress" // Nome do campo
        //                                                 />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contactsTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"personalEmail"}
        //                                                 name={"PersonalEmail"}
        //                                                 label={t("frontOffice.clientFiles.personalEmailLabel")}
        //                                                 ariaLabel={"Personal Email"}
        //                                                 style={inputStyle}
        //                                                 value={valuesEmail.PersonalEmail}
        //                                                 onChange={e => setValuesEmail({ ...valuesEmail, PersonalEmail: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"workEmail"}
        //                                                 name={"WorkEmail"}
        //                                                 label={t("frontOffice.clientFiles.workEmailLabel")}
        //                                                 ariaLabel={"Work Email"}
        //                                                 style={inputStyle}
        //                                                 value={valuesEmail.WorkEmail}
        //                                                 onChange={e => setValuesEmail({ ...valuesEmail, WorkEmail: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"personalPhone"}
        //                                                 name={"PersonalPhone"}
        //                                                 label={t("frontOffice.clientFiles.personalPhoneNumberLabel")}
        //                                                 ariaLabel={"Personal Phone Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesPhone.PersonalPhone}
        //                                                 onChange={e => setValuesPhone({ ...valuesPhone, PersonalPhone: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"workPhone"}
        //                                                 name={"WorkPhone"}
        //                                                 label={t("frontOffice.clientFiles.workPhoneNumberLabel")}
        //                                                 ariaLabel={"Work Phone Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesPhone.WorkPhone}
        //                                                 onChange={e => setValuesPhone({ ...valuesPhone, WorkPhone: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"house"}
        //                                                 name={"House"}
        //                                                 label={t("frontOffice.clientFiles.homePhoneNumberLabel")}
        //                                                 ariaLabel={"Home Phone Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.TelephoneNumber}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, TelephoneNumber: e.target.value })}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.personalDataTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"birthday"}
        //                                                 name={"Birthday"}
        //                                                 label={t("frontOffice.clientFiles.birthdateLabel")}
        //                                                 ariaLabel={"Birthdate"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.Birthday}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, Birthday: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"birthdayLocal"}
        //                                                 name={"BirthdayTown"}
        //                                                 label={t("frontOffice.clientFiles.birthplaceLabel")}
        //                                                 ariaLabel={"Place of Birth"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.BirthTown}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, BirthTown: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"natural"}
        //                                                 name={"Natural"}
        //                                                 label={t("frontOffice.clientFiles.originPlaceLabel")}
        //                                                 ariaLabel={"Place of Origin"}
        //                                                 style={inputStyle}
        //                                                 value={valuesLocality.NaturalLocality}
        //                                                 onChange={e => setValuesLocality({ ...valuesLocality, NaturalLocality: e.target.value })}
        //                                             />

        //                                             <CountryAutocomplete
        //                                                 label={t("frontOffice.clientFiles.nationalityLabel")}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 value={country.CountryNationality} // Valor controlado
        //                                                 onChange={(newValue, fieldName) => setCountry({ ...country, [fieldName]: newValue.land })} // Atualiza o valor controlado
        //                                                 fieldName="CountryNationality" // Nome do campo
        //                                             />
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.additionalInformationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"citizenCard"}
        //                                                 name={"CC"}
        //                                                 label={t("frontOffice.clientFiles.citizenCardLabel")}
        //                                                 ariaLabel={"Citizen Card"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.CC}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, CC: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"issuedOn"}
        //                                                 name={"IssueDate"}
        //                                                 label={t("frontOffice.clientFiles.issuedLabel")}
        //                                                 ariaLabel={"Issued On:"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.IssueDate}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, IssueDate: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"expiredOn"}
        //                                                 name={"ExperiedOn"}
        //                                                 label={t("frontOffice.clientFiles.expiresLabel")}
        //                                                 ariaLabel={"Expires On:"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.ExpiryDateDoc}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, ExpiryDateDoc: e.target.value })}
        //                                             />

        //                                             <CountryAutocomplete
        //                                                 label={t("frontOffice.clientFiles.countryIssueLabel")}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 value={country.CountryEmission} // Valor controlado
        //                                                 onChange={(newValue, fieldName) => setCountry({ ...country, [fieldName]: newValue.land })} // Atualiza o valor controlado
        //                                                 fieldName="CountryEmission" // Nome do campo
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"fiscalNumber"}
        //                                                 name={"FiscalNumber"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesNif.GuestPersonalNif}
        //                                                 onChange={e => setValuesNif({ ...valuesNif, GuestPersonalNif: e.target.value })}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                     {/*segunda linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.billingDataTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"company"}
        //                                                 name={"Company"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Company Name"}
        //                                                 style={inputStyle}
        //                                                 value={valuesIndividual.Company}
        //                                                 onChange={e => setValuesIndividual({ ...valuesIndividual, Company: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"fiscalNumber"}
        //                                                 name={"FiscalNumber"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesNif.GuestCompanyNif}
        //                                                 onChange={e => setValuesNif({ ...valuesNif, GuestCompanyNif: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"BillingAddress"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 value={valuesAddress.BillingAddress}
        //                                                 onChange={e => setValuesAddress({ ...valuesAddress, BillingAddress: e.target.value })}
        //                                             />

        //                                             <div className="flex flex-row gap-5">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"zipCode"}
        //                                                     name={"billingZipCode"}
        //                                                     label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                     ariaLabel={"Postal Code"}
        //                                                     style={sharedLineInputStyle}
        //                                                     value={valuesZipCode.billinigZipCode}
        //                                                     onChange={e => setValuesZipCode({ ...valuesZipCode, billinigZipCode: e.target.value })}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"local"}
        //                                                     name={"Local"}
        //                                                     label={t("frontOffice.clientFiles.localityLabel")}
        //                                                     ariaLabel={"Locality"}
        //                                                     style={sharedLineInputStyle}
        //                                                     value={valuesLocality.BillinigLocality}
        //                                                     onChange={e => setValuesLocality({ ...valuesLocality, BillinigLocality: e.target.value })}
        //                                                 />

        //                                             </div>
        //                                             <CountryAutocomplete
        //                                                 label={t("frontOffice.clientFiles.countryLabel")}
        //                                                 style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}
        //                                                 value={country.CountryBilling} // Valor controlado
        //                                                 onChange={(newValue, fieldName) => setCountry({ ...country, [fieldName]: newValue.land })} // Atualiza o valor controlado
        //                                                 fieldName="CountryBilling" // Nome do campo
        //                                             />
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.marketingTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"code"}
        //                                                 name={"Code"}
        //                                                 label={t("frontOffice.clientFiles.marketingCodesLabel")}
        //                                                 ariaLabel={"Marketing Codes"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"market"}
        //                                                 name={"Market"}
        //                                                 label={t("frontOffice.clientFiles.marketingMarketsLabel")}
        //                                                 ariaLabel={"Markets"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"marketing"}
        //                                                 name={"Marketing"}
        //                                                 label={t("frontOffice.clientFiles.marketingLabel")}
        //                                                 ariaLabel={"Marketing"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"sentOn"}
        //                                                 name={"SentOn"}
        //                                                 label={t("frontOffice.clientFiles.sentLabel")}
        //                                                 ariaLabel={"Sent On:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.businessClassTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"vipCode"}
        //                                                 name={"VIPCode"}
        //                                                 label={t("frontOffice.clientFiles.vipCodeLabel")}
        //                                                 ariaLabel={"VIP Code"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"profession"}
        //                                                 name={"Profession"}
        //                                                 label={t("frontOffice.clientFiles.professionLabel")}
        //                                                 ariaLabel={"Profession"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"PriceTable"}
        //                                                 name={"PriceTable"}
        //                                                 label={t("frontOffice.clientFiles.priceTableLabel")}
        //                                                 ariaLabel={"Price Table"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"roomPreference"}
        //                                                 name={"RoomPreference"}
        //                                                 label={t("frontOffice.clientFiles.roomPreferencesLabel")}
        //                                                 ariaLabel={"Room Preferences"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.membersTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"process"}
        //                                                 name={"Process"}
        //                                                 label={t("frontOffice.clientFiles.processLabel")}
        //                                                 ariaLabel={"Process"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"subscription"}
        //                                                 name={"Subscription"}
        //                                                 label={t("frontOffice.clientFiles.subscriptionLabel")}
        //                                                 ariaLabel={"Subscription"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"admittedOn"}
        //                                                 name={"AdmittedOn"}
        //                                                 label={t("frontOffice.clientFiles.admittedLabel")}
        //                                                 ariaLabel={"Admitted On:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"experiedOn"}
        //                                                 name={"ExperiedOn"}
        //                                                 label={t("frontOffice.clientFiles.expiresLabel")}
        //                                                 ariaLabel={"Expires On:"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                     {/*terceira linha de comboboxs */}
        //                                     <div className="flex flex-col justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.notesTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"observation1"}
        //                                                 name={"Observation1"}
        //                                                 label={t("frontOffice.clientFiles.notesObs1Label")}
        //                                                 ariaLabel={"Obs.1."}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"observation2"}
        //                                                 name={"Observation2"}
        //                                                 label={t("frontOffice.clientFiles.notesObs2Label")}
        //                                                 ariaLabel={"Obs.2."}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.attachmentsTitle")}</b></h4>
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={""}
        //                                                 name={""}
        //                                                 label={""}
        //                                                 ariaLabel={""}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                     </div>
        //                                 </ModalBody>
        //                             </form>
        //                         </>
        //                     )}
        //                 </ModalContent>
        //             </Modal>
        //         </>
        //     )}
        // </>
        <div>teste</div>
    );
};

export default individualForm;