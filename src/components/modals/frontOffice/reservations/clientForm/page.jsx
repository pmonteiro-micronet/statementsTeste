import React from 'react'

const CompanyForm = ()=> {
    return (
        <>
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
                                    <form onSubmit={handleSubmiCompany}>
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
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                            {/*<div className="h-1">
                                                <CompanyForm
                                                    buttonName={"Empresas"}
                                                    modalHeader={"Inserir Ficha de Cliente"}
                                                    modalEditArrow={<BsArrowRight size={25} />}
                                                    modalEdit={"Empresa"}
                                                    buttonColor={"transparent"}
                                                    formTypeModal={1}
                                                />
                            </div>*/}
                                            <div className="bg-white flex flex-row justify-start space-x-4 items-center py-5 px-5 border boder-neutral-200">
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
                                            <div className="flex flex-row justify-between gap-2">
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
                                            <div className="flex flex-row justify-between gap-2">
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
                                            <div className="flex flex-col justify-between gap-2">
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
                                        </ModalBody>
                                    </form>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
            </>
    )
}

export default CompanyForm;