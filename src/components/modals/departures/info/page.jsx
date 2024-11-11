"use client";
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
//imports de icons
import { MdClose } from "react-icons/md";
import { Tabs, Tab } from "@nextui-org/react";

const DepartureInfoForm = ({
    buttonName,
    buttonIcon,
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    buttonColor,
    roomNumber,
    dateCO,
    booker,
    salutation,
    lastName,
    firstName,
    roomType,
    resStatus,
    totalPax,
    balance,
    country
}) => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            {formTypeModal === 11 && (
                <>
                    <Button fullWidth={true} size="md" onPress={onOpen} color={buttonColor} className="-h-3 flex justify-start -p-3">
                        {buttonName} {buttonIcon}
                    </Button>
                    <Modal
                        isOpen={isOpen}
                        hideCloseButton={true}
                        onOpenChange={onOpenChange}
                        isDismissable={false}
                        isKeyboardDismissDisabled={true}
                        className="z-50"
                        size="sm"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <form>
                                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white p-2">
                                            <div className="flex flex-row justify-start gap-4 pl-4">
                                                {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                            </div>
                                            <div className='flex flex-row items-center justify-end'>
                                                <Button color="transparent" variant="light" className={"w-auto min-w-0 p-0 m-0 -pr-4"} onClick={() => { onClose() }}><MdClose size={30} /></Button>
                                            </div>
                                        </ModalHeader>
                                        <ModalBody className="flex flex-col mx-5 my-2 space-y-8">
                                            <Tabs aria-label="Options" className="flex justify-center">
                                                <Tab key="reservation" title="Reservation">
                                                    {/* Exibindo Room Number e DateCO */}
                                                    <div className="-mt-8 flex flex-col gap-5">
                                                        <div className="flex justify-between">
                                                            <p><strong>Room</strong></p>
                                                            <p>{roomNumber}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p><strong>RoomType</strong></p>
                                                            <p>{roomType}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p><strong>Status</strong></p>
                                                            <p>{resStatus}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p><strong>Departure</strong></p>
                                                            <p>{dateCO}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p><strong>Pax</strong></p>
                                                            <p>{totalPax}</p>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <p><strong>Balance</strong></p>
                                                            <p>{balance}</p>
                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab key="profiles" title="Profiles">
                                                    <div className="-mt-8 flex flex-col gap-4">
                                                        <p className="text-gray-400">TRAVEL AGENCY</p>
                                                        <p>{booker}</p>
                                                    </div>
                                                    <div className="mt-10 flex flex-col gap-4">
                                                        <p className="text-gray-400">COUNTRY</p>
                                                        <p>{country}</p>
                                                    </div>
                                                    <div className="mt-10 flex flex-col gap-4">
                                                        <p className="text-gray-400">GUESTS</p>
                                                        <p>{salutation}
                                                            {lastName && firstName
                                                                ? `${lastName}, ${firstName}`
                                                                : lastName || firstName}
                                                        </p>
                                                    </div>
                                                </Tab>
                                            </Tabs>
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

export default DepartureInfoForm;
