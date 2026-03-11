"use client"
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
//imports de icons
import { TfiSave } from "react-icons/tfi";
import { LiaExpandSolid } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { BsArrowRight } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import axios from 'axios';


import { expansion } from "@/components/functionsForm/expansion/page";

import CountryAutocomplete from "@/components/functionsForm/autocomplete/country/page";
import RateGroupAutocomplete from "@/components/functionsForm/autocomplete/rateCode/page";
import LanguageAutocomplete from "@/components/functionsForm/autocomplete/language/page";
import TipologyAutocomplete from "@/components/functionsForm/autocomplete/tipology/page";
import RoomsAutocomplete from "@/components/functionsForm/autocomplete/rooms/page";

//import GenderAutocomplete from "@/components/functionsForm/autocomplete/gender/page";

import InputFieldControlled from "@/components/functionsForm/inputs/typeText/page";
import reservationInsert, { reservationEdit } from "@/components/functionsForm/CRUD/frontOffice/reservation/page";
import PriceFilterReservation from "@/components/functionsForm/CRUD/frontOffice/reservation/priceFilters/page";

import SearchModal from "@/components/modal/frontOffice/reservations/searchModal/page";
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
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { toggleExpand, setIsExpanded, isExpanded } = expansion();

    //variaveis de estilo para inputs
    const inputStyle = "w-full border-b-2 border-gray-300 px-1 h-8 outline-none my-2 text-sm"
    const sharedLineInputStyle = "w-1/2 border-b-2 border-gray-300 px-1 h-10 outline-none my-2"

    const { handleInputReservation, handleSubmitReservation, setReservation, reservation, handleClientSelect, handleLanguageSelect, handleTipologySelect, handleRoomSelect, GuestNumberNrm, NightNrm } = reservationInsert();
    const { handleUpdateReservation, setValuesReserve, valuesReserve, setValuesGuest, valuesGuest } = reservationEdit(idReservation, idGuest);
    const { handleRateCode, prices, setPrices, mp } = PriceFilterReservation(GuestNumberNrm, NightNrm);

    const t = useTranslations('Index');

    return (
        <>

            {formTypeModal === 0 && ( //reservations insert
                <>
                    <Button onPress={onOpen} color={buttonColor} className={`w-fit ${style}`}>
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
                                                <div className="mb-10">
                                                    <Input
                                                        className="mt-2 w-[40%]"
                                                        placeholder= {t("general.search")}
                                                        labelPlacement="outside"
                                                        aria-label="Pesquisar clientes"
                                                        startContent={
                                                            <FiSearch color={"black"} size={20} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                                        }
                                                        endContent={
                                                            <SearchModal
                                                                buttonIcon={<IoIosArrowDown size={20} color="black" />}
                                                                buttonColor={"transparent"}
                                                                handleClientSelect={handleClientSelect}
                                                                handleSubmitReservation={handleSubmitReservation}
                                                                reservation={reservation}
                                                            />
                                                        }
                                                    />
                                                </div>
                                                <div className=" flex flex-row justify-between items-center">
                                                    {/*<ClientFormAutocomplete
                                                        label={"Documento"}
                                                        style={""}
                                                        onChange={(value) => handleClientSelect(value)}
                                                    />*/}
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"name"}
                                                        name={"Name"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.name")}
                                                        ariaLabel={"Nome"}
                                                        style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        value={reservation.Name}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"surname"}
                                                        name={"LastName"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.surname")}
                                                        ariaLabel={"Apelido"}
                                                        style={"w-64 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                        value={reservation.LastName}
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
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
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
                                                            value={reservation.CheckIn}
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
                                                            value={reservation.NightCount}
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
                                                        value={reservation.CheckOut}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.payment")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.label")}</b></h4>
                                                    </div>

                                                    <RoomsAutocomplete
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.inputs.room")}
                                                        style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"}
                                                        onChange={(value) => handleRoomSelect(value)}
                                                    />

                                                    <TipologyAutocomplete
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.roomDetails.inputs.roomType")}
                                                        style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"}
                                                        onChange={(value) => handleTipologySelect(value)}
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
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.label")}</b></h4>
                                                    </div>
                                                    <RateGroupAutocomplete
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.inputs.rateCode")}
                                                        style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"}
                                                        onChange={(value) => handleRateCode(value)}
                                                    />

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
                                                        value={prices.Price}
                                                        onChange={handleInputReservation}
                                                    />
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.billing.label")}</b></h4>
                                                    </div>

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"payment"}
                                                        name={"Payment"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.payment")}
                                                        ariaLabel={"Payment:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"charges"}
                                                        name={"Charges"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.charges")}
                                                        ariaLabel={"Charges:"}
                                                        style={inputStyle}
                                                        value={prices.Charges}
                                                        onChange={handleInputReservation}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"balance"}
                                                        name={"Balance"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.balance")}
                                                        ariaLabel={"Balance:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"forecast"}
                                                        name={"Forecast"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.forecast")}
                                                        ariaLabel={"Forecast:"}
                                                        style={inputStyle}
                                                    />

                                                </div>
                                            </div>
                                            {/*segunda linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.traces.label")}</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.notes.label")}</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.userDefined.label")}</b></h4>
                                                    </div>


                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.attachements.label")}</b></h4>
                                                    </div>


                                                </div>

                                            </div>
                                            {/*terceira linha de comboboxs */}
                                            <div className="flex flex-col justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/3 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.segmentation.label")}</b></h4>
                                                    </div>

                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.marketCode")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.distribChannel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.commChannel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.travelReason")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />

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
                                                {/*<ClientFormAutocomplete
                                                    label={"Documento"}
                                                    style={""}
                                                    onChange={(value) => handleClientSelect(value)}
                                                    idGuest={valuesGuest.GuestID}
                            />*/}
                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"name"}
                                                    name={"name"}
                                                    label={t("frontOffice.frontDesk.bookings.modal.booking.name")}
                                                    ariaLabel={"Nome"}
                                                    style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={valuesGuest.Name}
                                                    onChange={e => setValuesGuest({ ...valuesGuest, Name: e.target.value })}
                                                />

                                                <InputFieldControlled
                                                    type={"text"}
                                                    id={"surname"}
                                                    name={"LastName"}
                                                    label={t("frontOffice.frontDesk.bookings.modal.booking.surname")}
                                                    ariaLabel={"LastName"}
                                                    style={"w-80 border-b-2 border-gray-300 px-1 h-10 outline-none"}
                                                    value={valuesGuest.LastName}
                                                    onChange={e => setValuesGuest({ ...valuesGuest, LastName: e.target.value })}
                                                />

                                                <LanguageAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.language")} style={""} />
                                            </div>
                                            {/*primeira linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.label")}</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"arrival"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.checkIn")}
                                                        ariaLabel={"Arrival:"}
                                                        style={inputStyle}
                                                        value={valuesReserve.CheckIn}
                                                        onChange={e => setValuesReserve({ ...valuesReserve, CheckIn: e.target.value })}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"optional"}
                                                        name={"Optional"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.optional")}
                                                        ariaLabel={"Optional:"}
                                                        style={inputStyle}
                                                    />

                                                    <div className="flex flex-row gap-5">
                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"nights"}
                                                            name={"Nights"}
                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.nightCount")}
                                                            ariaLabel={"Nights"}
                                                            style={inputStyle}
                                                            value={valuesReserve.NightCount}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, NightCount: e.target.value })}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"guestsperRoom"}
                                                            name={"Guests per Room"}
                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.guestNumber")}
                                                            ariaLabel={"Guests per Room"}
                                                            style={inputStyle}
                                                            value={valuesReserve.GuestNumber}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, GuestNumber: e.target.value })}
                                                        />

                                                        <InputFieldControlled
                                                            type={"text"}
                                                            id={"departure"}
                                                            name={"Departure"}
                                                            label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.checkOut")}
                                                            ariaLabel={"Departure:"}
                                                            style={inputStyle}
                                                            value={valuesReserve.CheckOut}
                                                            onChange={e => setValuesReserve({ ...valuesReserve, CheckOut: e.target.value })}
                                                        />

                                                    </div>

                                                    <div className="w-full flex flex-col gap-4">
                                                        <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.stayDetails.inputs.payment")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 h-10 my-2"} />
                                                    </div>
                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
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
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.rateDetails.label")}</b></h4>
                                                    </div>
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
                                                <div className="bg-white flex flex-col w-full px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.billing.label")}</b></h4>
                                                    </div>
                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"payment"}
                                                        name={"Payment"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.payment")}
                                                        ariaLabel={"Payment:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"charges"}
                                                        name={"Charges"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.charges")}
                                                        ariaLabel={"Charges:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"balance"}
                                                        name={"Balance"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.balance")}
                                                        ariaLabel={"Balance:"}
                                                        style={inputStyle}
                                                    />

                                                    <InputFieldControlled
                                                        type={"text"}
                                                        id={"forecast"}
                                                        name={"Forecast"}
                                                        label={t("frontOffice.frontDesk.bookings.modal.booking.billing.inputs.forecast")}
                                                        ariaLabel={"Forecast:"}
                                                        style={inputStyle}
                                                    />

                                                </div>
                                            </div>
                                            {/*segunda linha de comboboxs */}
                                            <div className="flex flex-row justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.traces.label")}</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.notes.label")}</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.userDefined.label")}</b></h4>
                                                    </div>

                                                </div>
                                                <div className="bg-white flex flex-col w-1/4 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.attachements.label")}</b></h4>
                                                    </div>
                                                </div>
                                            </div>
                                             {/*terceira linha de comboboxs */}
                                             <div className="flex flex-col justify-between gap-2">
                                                <div className="bg-white flex flex-col w-1/3 px-5 py-5 border border-neutral-200">
                                                    <div className="">
                                                        <h4 className="pb-5 text-black-100"><b>{t("frontOffice.frontDesk.bookings.modal.booking.segmentation.label")}</b></h4>
                                                    </div>

                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.marketCode")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.distribChannel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.commChannel")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />
                                                    <CountryAutocomplete label={t("frontOffice.frontDesk.bookings.modal.booking.segmentation.inputs.travelReason")} style={"flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-5 gap-4 h-10 my-2"} />

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