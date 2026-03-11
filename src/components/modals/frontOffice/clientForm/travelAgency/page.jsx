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

// import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
// import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";
// //import GenderAutocomplete from "@/components/functionsForm/autocomplete/gender/page";

// import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
// import agencyInsert, { agencyEdit } from "@/components/functionsForm/CRUD/frontOffice/clientForm/travelAgency/page";

// import en from "../../../../../../public/locales/english/common.json";
// import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
// import es from "../../../../../../public/locales/espanol/common.json";

// const translations = { en, pt, es };

const travelGroupForm = ({
    // idAgency,
    // idNifAgency,
    // idAddressAgency,
    // idZipCodeAgency,
    // idLocalityAgency,
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
    // const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2 text-sm"

    // //import de funções
    // const { handleInputAgency, handleSubmiAgency } = agencyInsert();
    // const { handleUpdateTravelAgency, setValuesAgency, valuesAgency, setValuesAddress, valuesAddress,
    //     setValuesZipCode, valuesZipCode, setValuesLocality, valuesLocality, setValuesNif, valuesNif
    // } = agencyEdit(idAgency, idNifAgency, idAddressAgency, idZipCodeAgency, idLocalityAgency);

    //         const [locale, setLocale] = useState("pt");
    //          useEffect(() => {
    //            // Carregar o idioma do localStorage
    //            const storedLanguage = localStorage.getItem("language");
    //            if (storedLanguage) {
    //              setLocale(storedLanguage);
    //            }
    //          }, []);
           
    //          // Carregar as traduções com base no idioma atual
    //          const t = translations[locale] || translations["pt"]; // fallback para "pt"

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
        //                             <form onSubmit={handleSubmiAgency}>
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
        //                                     <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"name"}
        //                                             name={"name"}
        //                                             label={t("frontOffice.clientFiles.nameLabel")}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputAgency}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"abreviatura"}
        //                                             name={"abreviature"}
        //                                             label={t("frontOffice.clientFiles.shortnameLabel")}
        //                                             ariaLabel={"Short Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputAgency}
        //                                         />

        //                                         <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={""} />
        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.generalTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"MainAddress"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"zipCode"}
        //                                                 name={"MainZipCode"}
        //                                                 label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"local"}
        //                                                 name={"MainLocality"}
        //                                                 label={t("frontOffice.clientFiles.localityLabel")}
        //                                                 ariaLabel={"Locality"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}

        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"region"}
        //                                                 name={"Region"}
        //                                                 label={t("frontOffice.clientFiles.regionStateLabel")}
        //                                                 ariaLabel={"Region/State"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}

        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} name={"Country"} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="flex justify-between items-center">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.informationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"generalEmail"}
        //                                                 name={"generalEmail"}
        //                                                 label={t("frontOffice.clientFiles.generalEmailLabel")}
        //                                                 ariaLabel={"General Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentEmail"}
        //                                                 name={"departmentEmail"}
        //                                                 label={t("frontOffice.clientFiles.departmentEmailLabel")}
        //                                                 ariaLabel={"Department Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"generalPhone"}
        //                                                 name={"generalPhone"}
        //                                                 label={t("frontOffice.clientFiles.generalPhoneNumberLabel")}
        //                                                 ariaLabel={"General Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentPhone"}
        //                                                 name={"departmentPhone"}
        //                                                 label={t("frontOffice.clientFiles.departmentPhoneNumberLabel")}
        //                                                 ariaLabel={"Department Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"link"}
        //                                                 name={"url"}
        //                                                 label={t("frontOffice.clientFiles.urlLabel")}
        //                                                 ariaLabel={"URL"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}

        //                                             />


        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact1Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row justify-center items-center gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={sharedLineInputStyle} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row justify-center items-center">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"firstName"}
        //                                                     name={"firstName"}
        //                                                     label={t("frontOffice.clientFiles.nameLabel")}
        //                                                     ariaLabel={"Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"lastName"}
        //                                                     name={"lastName"}
        //                                                     label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                     ariaLabel={"Last Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phone"}
        //                                                 name={"phone"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact2Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row justify-center items-center gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={sharedLineInputStyle} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row justify-center items-center">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"firstName"}
        //                                                     name={"firstName"}
        //                                                     label={t("frontOffice.clientFiles.nameLabel")}
        //                                                     ariaLabel={"Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"lastName"}
        //                                                     name={"lastName"}
        //                                                     label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                     ariaLabel={"Last Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phone"}
        //                                                 name={"phone"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
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
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"GuestCompanyNif"}
        //                                                 name={"GuestCompanyNif"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"address"}
        //                                                 name={"BillingAddress"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputAgency}

        //                                             />

        //                                             <div className="flex flex-row gap-5">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"zipCode"}
        //                                                     name={"BillingZipCode"}
        //                                                     label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                     ariaLabel={"Postal Code"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputAgency}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"local"}
        //                                                     name={"BillingLocality"}
        //                                                     label={t("frontOffice.clientFiles.localityLabel")}
        //                                                     ariaLabel={"Locality"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputAgency}
        //                                                 />

        //                                             </div>
        //                                             <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
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

        //     {formTypeModal === 1 && ( //individuals insert
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
        //                             <form onSubmit={(e) => handleUpdateTravelAgency(e)}>
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
        //                                     <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"name"}
        //                                             name={"name"}
        //                                             label={t("frontOffice.clientFiles.nameLabel")}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesAgency.name}
        //                                             onChange={e => setValuesAgency({ ...valuesAgency, name: e.target.value })}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"abreviatura"}
        //                                             name={"abreviature"}
        //                                             label={t("frontOffice.clientFiles.shortnameLabel")}
        //                                             ariaLabel={"Short Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesAgency.abreviature}
        //                                             onChange={e => setValuesAgency({ ...valuesAgency, abreviature: e.target.value })}
        //                                         />

        //                                         <LanguageAutocomplete label={"Idioma"} style={""} />
        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.generalTitle")}</b></h4>
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
        //                                                 name={"MainZipCode"}
        //                                                 label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 value={valuesZipCode.MainZipCode}
        //                                                 onChange={e => setValuesZipCode({ ...valuesZipCode, MainZipCode: e.target.value })}
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
        //                                                 value={valuesAgency.Region}
        //                                                 onChange={e => setValuesAgency({ ...valuesAgency, Region: e.target.value })}
        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} name={"Country"} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="flex justify-between items-center">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.informationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"generalEmail"}
        //                                                 name={"generalEmail"}
        //                                                 label={t("frontOffice.clientFiles.generalEmailLabel")}
        //                                                 ariaLabel={"General Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentEmail"}
        //                                                 name={"departmentEmail"}
        //                                                 label={t("frontOffice.clientFiles.departmentEmailLabel")}
        //                                                 ariaLabel={"Department Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"generalPhone"}
        //                                                 name={"generalPhone"}
        //                                                 label={t("frontOffice.clientFiles.generalPhoneNumberLabel")}
        //                                                 ariaLabel={"General Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentPhone"}
        //                                                 name={"departmentPhone"}
        //                                                 label={t("frontOffice.clientFiles.departmentPhoneNumberLabel")}
        //                                                 ariaLabel={"Department Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"link"}
        //                                                 name={"url"}
        //                                                 label={t("frontOffice.clientFiles.urlLabel")}
        //                                                 ariaLabel={"URL"}
        //                                                 style={inputStyle}
        //                                                 value={valuesAgency.url}
        //                                                 onChange={e => setValuesAgency({ ...valuesAgency, url: e.target.value })}

        //                                             />


        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact1Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row justify-center items-center gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={sharedLineInputStyle} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row justify-center items-center">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"firstName"}
        //                                                     name={"firstName"}
        //                                                     label={t("frontOffice.clientFiles.nameLabel")}
        //                                                     ariaLabel={"Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"lastName"}
        //                                                     name={"lastName"}
        //                                                     label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                     ariaLabel={"Last Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phone"}
        //                                                 name={"phone"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact2Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row justify-center items-center gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={sharedLineInputStyle} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row justify-center items-center">
        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"firstName"}
        //                                                     name={"firstName"}
        //                                                     label={t("frontOffice.clientFiles.nameLabel")}
        //                                                     ariaLabel={"Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"lastName"}
        //                                                     name={"lastName"}
        //                                                     label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                     ariaLabel={"Last Name"}
        //                                                     style={sharedLineInputStyle}
        //                                                 />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phone"}
        //                                                 name={"phone"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
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
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"GuestCompanyNif"}
        //                                                 name={"GuestCompanyNif"}
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
        //                                                     name={"BillinigZipCode"}
        //                                                     label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                     ariaLabel={"Postal Code"}
        //                                                     style={sharedLineInputStyle}
        //                                                     value={valuesZipCode.BillinigZipCode}
        //                                                     onChange={e => setValuesZipCode({ ...valuesZipCode, BillinigZipCode: e.target.value })}

        //                                                 />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"local"}
        //                                                     name={"BillinigLocality"}
        //                                                     label={t("frontOffice.clientFiles.localityLabel")}
        //                                                     ariaLabel={"Locality"}
        //                                                     style={sharedLineInputStyle}
        //                                                     value={valuesLocality.BillinigLocality}
        //                                                     onChange={e => setValuesLocality({ ...valuesLocality, BillinigLocality: e.target.value })}
        //                                                 />

        //                                             </div>
        //                                             <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
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

export default travelGroupForm;