"use client"
// import React, { useState, useEffect } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea, Autocomplete, Divider, AutocompleteItem, ScrollShadow } from "@nextui-org/react";
// import { AiOutlineGlobal } from "react-icons/ai";
// import axios from 'axios';
// import { useSearchParams, useRouter, useParams } from 'next/navigation';
// import { usePathname } from "next/navigation";
// //imports de icons
// import { TfiSave } from "react-icons/tfi";
// import { LiaExpandSolid } from "react-icons/lia";
// import { RxExit } from "react-icons/rx";
// import { MdClose } from "react-icons/md";
// import { BsArrowRight } from "react-icons/bs";

// import { expansion } from "@/components/functionsForm/expansion/page";

// import CompanyForm from "../companies/page";
// import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
// import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";

// import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
// import companiesInsert, { companiesEdit } from "@/components/functionsForm/CRUD/frontOffice/clientForm/companies/page";

// import en from "../../../../../../public/locales/english/common.json";
// import pt from "../../../../../../public/locales/portuguesPortugal/common.json";
// import es from "../../../../../../public/locales/espanol/common.json";

// const translations = { en, pt, es };

const companyForm = ({
    // idCompany,
    // idEmail,
    // idPhone,
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
    // const inputStyle = "border-b-2 border-gray-300 px-1 h-10 outline-none text-sm::placeholder my-2"
    // const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2"

    // const { handleInputCompany, handleSubmiCompany } = companiesInsert();
    // const { handleUpdateCompany, setValuesCompany, valuesCompany, setValuesEmail, valuesEmail, setValuesPhone, valuesPhone } = companiesEdit(idCompany, idEmail, idPhone);

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
        //                             <form onSubmit={handleSubmiCompany}>
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
        //                                     <div className="bg-white flex flex-row justify-start space-x-4 items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"companyName"}
        //                                             name={"CompanyName"}
        //                                             label={t("frontOffice.clientFiles.nameLabel")}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputCompany}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"companyName2"}
        //                                             name={"CompanyName2"}
        //                                             label={t("frontOffice.clientFiles.shortnameLabel")}
        //                                             ariaLabel={"Short Name"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             onChange={handleInputCompany}
        //                                         />


        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.generalTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"country"}
        //                                                 name={"Country"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"zipCodePostBox"}
        //                                                 name={"ZipCodePostBox"}
        //                                                 label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}

        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"town"}
        //                                                 name={"Town"}
        //                                                 label={t("frontOffice.clientFiles.localityLabel")}
        //                                                 ariaLabel={"Locality"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"region"}
        //                                                 name={"Region"}
        //                                                 label={t("frontOffice.clientFiles.regionStateLabel")}
        //                                                 ariaLabel={"Region/State"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} name={"CountryAddress"} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} onInputChange={handleInputCompany} />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.informationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"geralEmail"}
        //                                                 name={"GeneralEmail"}
        //                                                 label={t("frontOffice.clientFiles.generalEmailLabel")}
        //                                                 ariaLabel={"General Email"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentEmail"}
        //                                                 name={"DepartmentEmail"}
        //                                                 label={t("frontOffice.clientFiles.departmentEmailLabel")}
        //                                                 ariaLabel={"Department Email"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"geralPhone"}
        //                                                 name={"GeneralPhone"}
        //                                                 label={t("frontOffice.clientFiles.generalPhoneNumberLabel")}
        //                                                 ariaLabel={"General Phone Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departamentPhone"}
        //                                                 name={"DepartmentPhone"}
        //                                                 label={t("frontOffice.clientFiles.departmentPhoneNumberLabel")}
        //                                                 ariaLabel={"Department Phone Number"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"websiteURL"}
        //                                                 name={"WebsiteURL"}
        //                                                 label={t("frontOffice.clientFiles.urlLabel")}
        //                                                 ariaLabel={"URL"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact1Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={""} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={inputStyle}
        //                                                     onChange={handleInputCompany}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row gap-5">
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"firstName"}
        //                                                 name={"FirstName"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Name"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"secondName"}
        //                                                 name={"SecondName"}
        //                                                 label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                 ariaLabel={"Last Name"}
        //                                                 style={inputStyle}
        //                                             />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"Department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phoneNumber"}
        //                                                 name={"PhoneNumber"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"Email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact2Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={''} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputCompany}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row gap-5">
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"firstName"}
        //                                                 name={"FirstName"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Name"}
        //                                                 style={sharedLineInputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"secondName"}
        //                                                 name={"SecondName"}
        //                                                 label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                 ariaLabel={"Last Name"}
        //                                                 style={sharedLineInputStyle}
        //                                             />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"Department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phoneNumber"}
        //                                                 name={"PhoneNumber"}
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

        //                                             {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                     </div>
        //                                     {/*segunda linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.marketingTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"codes"}
        //                                                 name={"Codes"}
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
        //                                                 type={"date"}
        //                                                 id={"sendData"}
        //                                                 name={"SendData"}
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
        //                                                 id={"Fiscal"}
        //                                                 name={"Fiscal"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"CAECode"}
        //                                                 name={"CAECode"}
        //                                                 label={t("frontOffice.clientFiles.CAECodeLabel")}
        //                                                 ariaLabel={"CAE Code"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"prices"}
        //                                                 name={"Prices"}
        //                                                 label={t("frontOffice.clientFiles.priceTableLabel")}
        //                                                 ariaLabel={"Price Table"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"preferencesRoom"}
        //                                                 name={"preferencesRoom"}
        //                                                 label={t("frontOffice.clientFiles.roomPreferencesLabel")}
        //                                                 ariaLabel={"Room Preferences"}
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
        //                 isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true} scrollBehavior="inside">
        //                 <ModalContent>
        //                     {(onClose) => (
        //                         <>
        //                         <form onSubmit={(e) => handleUpdateCompany(e)}>
        //                             <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary-600 text-white">
        //                                 <div className="flex flex-row justify-start gap-4">
        //                                     {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
        //                                 </div>
        //                                 <div className='flex flex-row items-center mr-5'>
        //                                     <Button color="transparent" onPress={onClose} className="-mr-5" type="submit"><TfiSave size={25} /></Button>
        //                                     <Button color="transparent" className="-mr-5" onClick={toggleExpand}><LiaExpandSolid size={30} /></Button>
        //                                     <Button color="transparent" variant="light" onPress={onClose}><MdClose size={30} /></Button>
        //                                 </div>
        //                             </ModalHeader>
        //                             <ModalBody className="flex flex-col mx-5 my-5 space-y-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
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
        //                                     <div className="bg-white flex flex-row justify-start items-center py-5 px-5 border boder-neutral-200">
        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"companyName"}
        //                                             name={"CompanyName"}
        //                                             label={t("frontOffice.clientFiles.nameLabel")}
        //                                             ariaLabel={"Name"}
        //                                             style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesCompany.CompanyName}
        //                                             onChange={e => setValuesCompany({ ...valuesCompany, CompanyName: e.target.value })}
        //                                         />

        //                                         <InputFieldControlled
        //                                             type={"text"}
        //                                             id={"companyName2"}
        //                                             name={"CompanyName2"}
        //                                             label={t("frontOffice.clientFiles.shortnameLabel")}
        //                                             ariaLabel={"Short Name"}
        //                                             style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
        //                                             value={valuesCompany.CompanyName2}
        //                                             onChange={e => setValuesCompany({ ...valuesCompany, CompanyName2: e.target.value })}
        //                                         />


        //                                     </div>
        //                                     {/*primeira linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.generalTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"country"}
        //                                                 name={"Country"}
        //                                                 label={t("frontOffice.clientFiles.addressLabel")}
        //                                                 ariaLabel={"Address"}
        //                                                 style={inputStyle}
        //                                                 value={valuesCompany.Country}
        //                                                 onChange={e => setValuesCompany({ ...valuesCompany, Country: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"zipCodePostBox"}
        //                                                 name={"ZipCodePostBox"}
        //                                                 label={t("frontOffice.clientFiles.postalCodeLabel")}
        //                                                 ariaLabel={"Postal Code"}
        //                                                 style={inputStyle}
        //                                                 value={valuesCompany.ZipCodePostBox}
        //                                                 onChange={e => setValuesCompany({ ...valuesCompany, ZipCodePostBox: e.target.value })}

        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"town"}
        //                                                 name={"Town"}
        //                                                 label={t("frontOffice.clientFiles.localityLabel")}
        //                                                 ariaLabel={"Locality"}
        //                                                 style={inputStyle}
        //                                                 value={valuesCompany.ZipCodePostBox}
        //                                                 onChange={e => setValuesCompany({ ...valuesCompany, ZipCodePostBox: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"region"}
        //                                                 name={"Region"}
        //                                                 label={t("frontOffice.clientFiles.regionStateLabel")}
        //                                                 ariaLabel={"Region/State"}
        //                                                 style={inputStyle}
        //                                                 value={valuesCompany.Region}
        //                                                 onChange={e => setValuesCompany({ ...valuesCompany, Region: e.target.value })}
        //                                             />

        //                                             <div className="w-full flex flex-col gap-4">
        //                                                 <CountryAutocomplete label={t("frontOffice.clientFiles.countryLabel")} name={"CountryAddress"} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} onInputChange={handleInputCompany} />
        //                                             </div>
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.informationTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"geralEmail"}
        //                                                 name={"GeneralEmail"}
        //                                                 label={t("frontOffice.clientFiles.generalEmailLabel")}
        //                                                 ariaLabel={"General Email"}
        //                                                 style={inputStyle}
        //                                                 value={valuesEmail.GeneralEmail}
        //                                                 onChange={e => setValuesEmail({ ...valuesEmail, GeneralEmail: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departmentEmail"}
        //                                                 name={"DepartmentEmail"}
        //                                                 label={t("frontOffice.clientFiles.departmentEmailLabel")}
        //                                                 ariaLabel={"Department Email"}
        //                                                 style={inputStyle}
        //                                                 value={valuesEmail.DepartmentEmail}
        //                                                 onChange={e => setValuesEmail({ ...valuesEmail, DepartmentEmail: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"geralPhone"}
        //                                                 name={"GeneralPhone"}
        //                                                 label={t("frontOffice.clientFiles.generalPhoneNumberLabel")}
        //                                                 ariaLabel={"General Phone Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesPhone.GeneralPhone}
        //                                                 onChange={e => setValuesPhone({ ...valuesPhone, GeneralPhone: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"departamentPhone"}
        //                                                 name={"DepartmentPhone"}
        //                                                 label={t("frontOffice.clientFiles.departmentPhoneNumberLabel")}
        //                                                 ariaLabel={"Department Phone Number"}
        //                                                 style={inputStyle}
        //                                                 value={valuesPhone.DepartmentPhone}
        //                                                 onChange={e => setValuesPhone({ ...valuesPhone, DepartmentPhone: e.target.value })}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"websiteURL"}
        //                                                 name={"WebsiteURL"}
        //                                                 label={t("frontOffice.clientFiles.urlLabel")}
        //                                                 ariaLabel={"URL"}
        //                                                 style={inputStyle}
        //                                                 value={valuesCompany.WebsiteURL}
        //                                                 onChange={e => setValuesCompany({ ...valuesCompany, WebsiteURL: e.target.value })}
        //                                             />

        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact1Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={""} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={inputStyle}
        //                                                     onChange={handleInputCompany}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row gap-5">
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"firstName"}
        //                                                 name={"FirstName"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Name"}
        //                                                 style={inputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"secondName"}
        //                                                 name={"SecondName"}
        //                                                 label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                 ariaLabel={"Last Name"}
        //                                                 style={inputStyle}
        //                                             />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"Department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phoneNumber"}
        //                                                 name={"PhoneNumber"}
        //                                                 label={t("frontOffice.clientFiles.phoneNumberLabel")}
        //                                                 ariaLabel={"Phone Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"email"}
        //                                                 name={"Email"}
        //                                                 label={t("frontOffice.clientFiles.emailLabel")}
        //                                                 ariaLabel={"Email"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.contact2Title")}</b></h4>
        //                                             </div>
        //                                             <div className="flex flex-row gap-5">
        //                                                 <LanguageAutocomplete label={t("frontOffice.clientFiles.languageLabel")} style={sharedLineInputStyle} />

        //                                                 <InputFieldControlled
        //                                                     type={"text"}
        //                                                     id={"saudation"}
        //                                                     name={"Saudation"}
        //                                                     label={t("frontOffice.clientFiles.salutationLabel")}
        //                                                     ariaLabel={"Salutation"}
        //                                                     style={sharedLineInputStyle}
        //                                                     onChange={handleInputCompany}
        //                                                 />
        //                                             </div>

        //                                             <div className="flex flex-row gap-5">
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"firstName"}
        //                                                 name={"FirstName"}
        //                                                 label={t("frontOffice.clientFiles.nameLabel")}
        //                                                 ariaLabel={"Name"}
        //                                                 style={sharedLineInputStyle}
        //                                                 onChange={handleInputCompany}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"secondName"}
        //                                                 name={"SecondName"}
        //                                                 label={t("frontOffice.clientFiles.lastNameLabel")}
        //                                                 ariaLabel={"Last Name"}
        //                                                 style={sharedLineInputStyle}
        //                                             />
        //                                             </div>

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"department"}
        //                                                 name={"Department"}
        //                                                 label={t("frontOffice.clientFiles.departmentLabel")}
        //                                                 ariaLabel={"Department"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"phoneNumber"}
        //                                                 name={"PhoneNumber"}
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

        //                                             {/*<CountryAutocomplete label="Nacionalidade" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />*/}
        //                                             {/*<GenderAutocomplete label="Género" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"}/>*/}
        //                                         </div>
        //                                     </div>
        //                                     {/*segunda linha de comboboxs */}
        //                                     <div className="flex flex-row justify-between gap-2">
        //                                         <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
        //                                             <div className="">
        //                                                 <h4 className="pb-5 text-black-100"><b>{t("frontOffice.clientFiles.marketingTitle")}</b></h4>
        //                                             </div>
        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"codes"}
        //                                                 name={"Codes"}
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
        //                                                 type={"date"}
        //                                                 id={"sendData"}
        //                                                 name={"SendData"}
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
        //                                                 id={"Fiscal"}
        //                                                 name={"Fiscal"}
        //                                                 label={t("frontOffice.clientFiles.fiscalNumberLabel")}
        //                                                 ariaLabel={"Fiscal Number"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"CAECode"}
        //                                                 name={"CAECode"}
        //                                                 label={t("frontOffice.clientFiles.CAECodeLabel")}
        //                                                 ariaLabel={"CAE Code"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"prices"}
        //                                                 name={"Prices"}
        //                                                 label={t("frontOffice.clientFiles.priceTableLabel")}
        //                                                 ariaLabel={"Price Table"}
        //                                                 style={inputStyle}
        //                                             />

        //                                             <InputFieldControlled
        //                                                 type={"text"}
        //                                                 id={"preferencesRoom"}
        //                                                 name={"preferencesRoom"}
        //                                                 label={t("frontOffice.clientFiles.roomPreferencesLabel")}
        //                                                 ariaLabel={"Room Preferences"}
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
        //                                 </form>
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

export default companyForm;