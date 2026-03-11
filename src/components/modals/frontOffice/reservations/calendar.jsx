"use client"
import Reac from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
//imports de icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";

import { expansion } from "@/components/functionsForm/expansion/page";

import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";
import ClientFormAutocomplete from "@/components/functionsForm/autocomplete/clientForm/page";
//import GenderAutocomplete from "@/components/functionsForm/autocomplete/gender/page";

import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
import reservationInsert, { reservationEdit } from "@/components/functionsForm/CRUD/frontOffice/reservations/page";

const reservationsForm = ({
    idReservation,
    idGuest,
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
    editor,
    isOpen, onOpen, onOpenChange, onClose
}) => {

    const { toggleExpand, setIsExpanded, isExpanded } = expansion();

    //variaveis de estilo para inputs
    const inputStyle = "w-full border-b-2 border-gray-300 px-1 h-8 outline-none my-2 text-sm"
    const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2"

    const { handleInputReservation, handleSubmitReservation, setReservation, reservation, handleClientSelect } = reservationInsert();
    const { handleUpdateReservation, setValuesReserve, valuesReserve, setValuesGuest, valuesGuest } = reservationEdit(idReservation, idGuest);


    return (
        <>

            {formTypeModal === 0 && ( //reservations insert
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
                                    <form onSubmit={handleSubmitReservation}>
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
                                            <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
                                                <ClientFormAutocomplete
                                                    label={"Documento"}
                                                    style={""}
                                                    onChange={(value) => handleClientSelect(value)}
                                                />
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"name"}
                                                    name={"Name"}
                                                    label={"Nome"}
                                                    ariaLabel={"Nome"}
                                                    style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={reservation.Name}
                                                    onChange={handleInputReservation}
                                                />

                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"surname"}
                                                    name={"LastName"}
                                                    label={"Apelido"}
                                                    ariaLabel={"Apelido"}
                                                    style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={reservation.LastName}
                                                    onChange={handleInputReservation}
                                                />

                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"salutation"}
                                                    name={"Salutation"}
                                                    label={"Saudação"}
                                                    ariaLabel={"Saudação"}
                                                    style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                />

                                                <LanguageAutocomplete label={"Idioma"} style={""} />
                                            </div>
                                            {/*primeira linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Stay Details</b></h4>
                                                    </div>
                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"arrival"}
                                                            name={"CheckIn"}
                                                            label={"Arrival:"}
                                                            ariaLabel={"Arrival:"}
                                                            style={inputStyle}
                                                            value={reservation.CheckIn}
                                                            onChange={handleInputReservation}
                                                        />

                                                        <InputFieldControlled
                                                            type={"date"}
                                                            id={"optional"}
                                                            name={"Optional"}
                                                            label={"Optional:"}
                                                            ariaLabel={"Optional:"}
                                                            style={inputStyle}
                                                        />

                                                    </div>

                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"nights"}
                                                            name={"NightCount"}
                                                            label={"Nights"}
                                                            ariaLabel={"Nights"}
                                                            style={inputStyle}
                                                            value={reservation.NightCount}
                                                            onChange={handleInputReservation}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"guestsperRoom"}
                                                            name={"GuestNumber"}
                                                            label={"Guests per Room"}
                                                            ariaLabel={"Guests per Room"}
                                                            style={inputStyle}
                                                            value={reservation.GuestNumber}
                                                            onChange={handleInputReservation}
                                                        />

                                                    </div>

                                                    <InputFieldControlled
                                                        type={"date"}
                                                        id={"departure"}
                                                        name={"CheckOut"}
                                                        label={"Departure:"}
                                                        ariaLabel={"Departure:"}
                                                        style={inputStyle}
                                                        value={reservation.CheckOut}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <CountryAutocomplete label="Payment" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="pb-5 text-black-100"><b>Room Details</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"room"}
                                                        name={"Room"}
                                                        label={"Room"}
                                                        ariaLabel={"Room"}
                                                        style={inputStyle}
                                                    />

                                                    <CountryAutocomplete label="Room Type" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"roomtoCharge"}
                                                        name={"Room to Charge"}
                                                        label={"Room to Charge"}
                                                        ariaLabel={"Room to Charge"}
                                                        style={inputStyle}
                                                    />


                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Rate Details</b></h4>
                                                    </div>
                                                    <CountryAutocomplete label="Rate Code" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"avgRate"}
                                                            name={"Avg. Rate"}
                                                            label={"Avg. Rate"}
                                                            ariaLabel={"Avg. Rate"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"totalRate"}
                                                            name={"Total Rate"}
                                                            label={"Total Rate"}
                                                            ariaLabel={"Total Rate"}
                                                            style={inputStyle}
                                                        />


                                                    </div>

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"packages"}
                                                        name={"Packages"}
                                                        label={"Packages"}
                                                        ariaLabel={"Packages"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"allotment"}
                                                        name={"Allotment"}
                                                        label={"Allotment"}
                                                        ariaLabel={"Allotment"}
                                                        style={inputStyle}
                                                    />
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Segmentation</b></h4>
                                                    </div>

                                                    <CountryAutocomplete label="Market Code" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Distrib. Channel" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Comm. Channel" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Travel Reason" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />

                                                </div>
                                            </div>
                                            {/*segunda linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Traces</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Notes</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>User Defined</b></h4>
                                                    </div>


                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Attachements</b></h4>
                                                    </div>


                                                </div>

                                            </div>
                                            {/*terceira linha de comboboxs */}
                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/3 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Billing</b></h4>
                                                    </div>

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"payment"}
                                                        name={"Payment"}
                                                        label={"Payment:"}
                                                        ariaLabel={"Payment:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"charges"}
                                                        name={"Charges"}
                                                        label={"Charges:"}
                                                        ariaLabel={"Charges:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"balance"}
                                                        name={"Balance"}
                                                        label={"Balance:"}
                                                        ariaLabel={"Balance:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"forecast"}
                                                        name={"Forecast"}
                                                        label={"Forecast:"}
                                                        ariaLabel={"Forecast:"}
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
            )}

            {formTypeModal === 1 && ( //reservations edit
                <>
                    <Button onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3">
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
                                    <form onSubmit={(e) => handleUpdateReservation(e)}>
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
                                            <div className="bg-white flex flex-row justify-between items-center py-5 px-5 border boder-neutral-200">
                                                <ClientFormAutocomplete
                                                    label={"Documento"}
                                                    style={""}
                                                    onChange={(value) => handleClientSelect(value)}
                                                    idGuest={valuesGuest.GuestID}
                                                />
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"name"}
                                                    name={"name"}
                                                    label={"Nome"}
                                                    ariaLabel={"Nome"}
                                                    style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={valuesGuest.Name}
                                                    onChange={e => setValuesGuest({ ...valuesGuest, Name: e.target.value })}
                                                />

                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"abreviatura"}
                                                    name={"abreviature"}
                                                    label={"Abreviatura"}
                                                    ariaLabel={"Abreviatura"}
                                                    style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={valuesGuest.LastName}
                                                    onChange={e => setValuesGuest({ ...valuesGuest, LastName: e.target.value })}
                                                />

                                                <LanguageAutocomplete label={"Idioma"} style={""} />
                                            </div>
                                            {/*primeira linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Stay Details</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"arrival"}
                                                        label={"Arrival:"}
                                                        ariaLabel={"Arrival:"}
                                                        style={inputStyle}
                                                        value={valuesReserve.CheckIn}
                                                        onChange={e => setValuesReserve({ ...valuesReserve, CheckIn: e.target.value })}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"optional"}
                                                        name={"Optional"}
                                                        label={"Optional:"}
                                                        ariaLabel={"Optional:"}
                                                        style={inputStyle}
                                                    />

                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"nights"}
                                                            name={"Nights"}
                                                            label={"Nights"}
                                                            ariaLabel={"Nights"}
                                                            style={inputStyle}
                                                            value={valuesReserve.NightCount}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, NightCount: e.target.value })}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"guestsperRoom"}
                                                            name={"Guests per Room"}
                                                            label={"Guests per Room"}
                                                            ariaLabel={"Guests per Room"}
                                                            style={inputStyle}
                                                            value={valuesReserve.GuestNumber}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, GuestNumber: e.target.value })}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"departure"}
                                                            name={"Departure"}
                                                            label={"Departure:"}
                                                            ariaLabel={"Departure:"}
                                                            style={inputStyle}
                                                            value={valuesReserve.CheckOut}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, CheckOut: e.target.value })}
                                                        />

                                                    </div>

                                                    <div className="w-full flex flex-col gap-4">
                                                        <CountryAutocomplete label="Payment" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
                                                    </div>
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="pb-5 text-black-100"><b>Room Details</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"room"}
                                                        name={"Room"}
                                                        label={"Room"}
                                                        ariaLabel={"Room"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"roomtoCharge"}
                                                        name={"Room to Charge"}
                                                        label={"Room to Charge"}
                                                        ariaLabel={"Room to Charge"}
                                                        style={inputStyle}
                                                    />

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="pb-5 text-black-100"><b>Rate Details</b></h4>
                                                    </div>
                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"avgRate"}
                                                            name={"Avg. Rate"}
                                                            label={"Avg. Rate"}
                                                            ariaLabel={"Avg. Rate"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"totalRate"}
                                                            name={"Total Rate"}
                                                            label={"Total Rate"}
                                                            ariaLabel={"Total Rate"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"packages"}
                                                            name={"Packages"}
                                                            label={"Packages"}
                                                            ariaLabel={"Packages"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"allotment"}
                                                            name={"Allotment"}
                                                            label={"Allotment"}
                                                            ariaLabel={"Allotment"}
                                                            style={inputStyle}
                                                        />
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Segmentation</b></h4>
                                                    </div>

                                                    <CountryAutocomplete label="Market Code" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Distrib. Channel" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Comm. Channel" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label="Travel Reason" style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />

                                                </div>
                                            </div>
                                            {/*segunda linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Traces </b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Notes</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>User Defined</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Attachements</b></h4>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*terceira linha de comboboxs */}
                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>Billing</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"payment"}
                                                        name={"Payment"}
                                                        label={"Payment:"}
                                                        ariaLabel={"Payment:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"charges"}
                                                        name={"Charges"}
                                                        label={"Charges:"}
                                                        ariaLabel={"Charges:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"balance"}
                                                        name={"Balance"}
                                                        label={"Balance:"}
                                                        ariaLabel={"Balance:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"forecast"}
                                                        name={"Forecast"}
                                                        label={"Forecast:"}
                                                        ariaLabel={"Forecast:"}
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
            )}
        </>
    );
};

export default reservationsForm;