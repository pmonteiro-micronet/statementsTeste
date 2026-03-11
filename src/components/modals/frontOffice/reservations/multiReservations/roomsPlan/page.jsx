"use client"
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure, Tabs, Tab} from "@nextui-org/react";
//imports de icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";

import { expansion } from "@/components/functionsForm/expansion/page";

import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";

import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
import reservationInsert from "@/components/functionsForm/CRUD/frontOffice/reservation/roomsPlan/page";

import { useTranslations } from 'next-intl';

const reservationsForm = ({
    idReservation,
    idGuest,
    buttonName,
    buttonIcon,
    style,
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    buttonColor,
    criado,
    editado,
    editor,

    showModal,
    startDate,
    endDate,
    tipology,
    selectedDates, // Recebendo selectedDates como prop
    disabled,
    guestName,
    guestId
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { toggleExpand, setIsExpanded, isExpanded } = expansion();

    //variaveis de estilo para inputs
    const inputStyle = "w-full border-b-2 border-gray-300 px-1 h-8 outline-none my-2 text-sm"

    const { handleInputReservation, handleSubmitReservation, setReservation, reservation, handleLanguageSelect, handleTipologySelect, name } = reservationInsert(guestName, guestId, startDate, endDate, tipology, selectedDates);

    const t = useTranslations('Index');

    return (
        <>

            {formTypeModal === 0 && ( //reservations insert
                <>
                    <Button onPress={onOpen} color={buttonColor} className={`w-fit ${style}`} isDisabled={disabled}>
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
                        isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true} scrollBehavior="inside" >
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
                                                <Button color="transparent" variant="light" onClick={() => { onClose(); window.location.reload(); }}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-5 space-y-8 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                            <div className="bg-white flex flex-col py-5 px-5 border boder-neutral-200 rounded-lg">
                     
                                                <div className=" flex flex-row justify-between items-center">
                                                    {/*<ClientFormAutocomplete
                                                        label={"Documento"}
                                                        style={""}
                                                        onChange={(value) => handleClientSelect(value)}
                                                    />*/}
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"name"}
                                                        name={"firstName"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.name")}
                                                        ariaLabel={"Nome"}
                                                        style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        value={name.firstName}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"surname"}
                                                        name={"lastName"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.surname")}
                                                        ariaLabel={"Apelido"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        value={name.lastName}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"salutation"}
                                                        name={"Salutation"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.salutation")}
                                                        ariaLabel={"Saudação"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    />

                                                    <LanguageAutocomplete
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.language")}
                                                        style={""}
                                                        onChange={(value) => handleLanguageSelect(value)}
                                                    />
                                                </div>
                                            </div>
                                            {/*primeira linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="flex flex-col">
                                                    <Tabs aria-label="Options" >
                                                        {selectedDates.map((dateRange, index) => (
                                                            <Tab key={`client${index}`} title={`Client ${index + 1}`}>
                                                                <div className="flex flex-row justify-between gap-2">
                                                                    <div className="bg-white flex flex-col w-2/4 px-5 py-5 border border-neutral-200">
                                                                        <div className="">
                                                                            <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.label")}</b></h4>
                                                                        </div>
                                                                        <div className="flex flex-row">
                                                                            <InputFieldControlled
                                                                                type={"date"}
                                                                                id={"arrival"}
                                                                                name={"CheckIn"}
                                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.checkIn")}
                                                                                ariaLabel={"Arrival:"}
                                                                                style={inputStyle}
                                                                                value={dateRange.start}
                                                                                onChange={handleInputReservation}
                                                                            />

                                                                            <InputFieldControlled
                                                                                type={"date"}
                                                                                id={"optional"}
                                                                                name={"Optional"}
                                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.optional")}
                                                                                ariaLabel={"Optional:"}
                                                                                style={inputStyle}
                                                                            />

                                                                        </div>

                                                                        <div className="flex flex-row gap-5">
                                                                            <InputFieldControlled
                                                                                type={"text"}
                                                                                id={"nights"}
                                                                                name={"NightCount"}
                                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.nightCount")}
                                                                                ariaLabel={"Nights"}
                                                                                style={inputStyle}
                                                                                value={dateRange.numberNights}
                                                                                onChange={handleInputReservation}
                                                                            />

                                                                            <InputFieldControlled
                                                                                type={"text"}
                                                                                id={"guestsperRoom"}
                                                                                name={"GuestNumber"}
                                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.guestNumber")}
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
                                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.checkOut")}
                                                                            ariaLabel={"Departure:"}
                                                                            style={inputStyle}
                                                                            value={dateRange.end}
                                                                            onChange={handleInputReservation}
                                                                        />

                                                                        <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.payment")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
                                                                    </div>
                                                                    <div className="bg-white flex flex-col w-2/4 px-5 py-5 border border-neutral-200">
                                                                        <div className="flex justify-between items-center">
                                                                            <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.label")}</b></h4>
                                                                        </div>
                                                                        <InputFieldControlled
                                                                            type={"text"}
                                                                            id={"room"}
                                                                            name={"Room"}
                                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.inputs.room")}
                                                                            ariaLabel={"Room"}
                                                                            style={inputStyle}
                                                                            value={dateRange.roomName}
                                                                        />

                                                                        {/*<TipologyAutocomplete
                                                                            label="Room Type"
                                                                            style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"}
                                                                            onChange={(value) => handleTipologySelect(value)}
                                                        />*/}

                                                                        <InputFieldControlled 
                                                                        type={"text"}
                                                                        id={""}
                                                                        name={"Tipologia"}
                                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.inputs.roomType")}
                                                                        ariaLabel={"Tipologia"}
                                                                        style={inputStyle}
                                                                        value={dateRange.tipologyID}
                                                                        />

                                                                        <InputFieldControlled
                                                                            type={"text"}
                                                                            id={"roomtoCharge"}
                                                                            name={"Room to Charge"}
                                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.inputs.roomToCharge")}
                                                                            ariaLabel={"Room to Charge"}
                                                                            style={inputStyle}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Tab>
                                                            ))}
                                                    </Tabs>
                                                    <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                        <div className="">
                                                            <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.label")}</b></h4>
                                                        </div>
                                                        <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.rateCode")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                        <div className="flex flex-row gap-5">
                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"avgRate"}
                                                                name={"Avg. Rate"}
                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.avgRate")}
                                                                ariaLabel={"Avg. Rate"}
                                                                style={inputStyle}
                                                            />

                                                            <InputFieldControlled
                                                                type={"text"}
                                                                id={"totalRate"}
                                                                name={"Total Rate"}
                                                                label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.totalRate")}
                                                                ariaLabel={"Total Rate"}
                                                                style={inputStyle}
                                                            />


                                                        </div>

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"packages"}
                                                            name={"Packages"}
                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.packages")}
                                                            ariaLabel={"Packages"}
                                                            style={inputStyle}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"Price"}
                                                            name={"Price"}
                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.price")}
                                                            ariaLabel={"Price"}
                                                            style={inputStyle}
                                                        />
                                                    </div>
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