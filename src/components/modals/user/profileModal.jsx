"use client";
import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Tabs, Tab } from "@nextui-org/react";

const ProfileModalForm = ({
    buttonName,
    buttonIcon,
    buttonColor,
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { data: session } = useSession();
    const [hotels, setHotels] = useState([]);
    const [showPasswordFields, setShowPasswordFields] = useState(false); // Para exibir os campos de redefinição de senha
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const user = session?.user || {};
    const { firstName, secondName, email } = user;

    useEffect(() => {
        const fetchHotels = async () => {
            if (user?.propertyIDs && Array.isArray(user.propertyIDs)) {
                try {
                    const response = await axios.get(
                        `/api/properties?propertyIDs=${user.propertyIDs.join(",")}`
                    );
                    const allHotels = Array.isArray(response.data.response) ? response.data.response : [];
                    const filteredHotels = allHotels.filter((hotel) =>
                        user.propertyIDs.includes(hotel.propertyID)
                    );
                    setHotels(filteredHotels);
                } catch (error) {
                    console.error("Erro ao buscar hotéis:", error);
                }
            }
        };

        fetchHotels();
    }, [user]);

    const handleModalOpenChange = (isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    const resetForm = () => {
        setShowPasswordFields(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New passwords do not match.");
            return;
        }

        try {
            const response = await axios.patch(`/api/user/${user.id}`, {
                oldPassword,
                newPassword,
            });

            if (response.status === 200) {
                setSuccessMessage("Password updated successfully.");
                resetForm();
            } else {
                setErrorMessage("Failed to update password. Please try again.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setErrorMessage(error.response?.data?.message || "An error occurred.");
        }
    };


    return (
        <>
            {formTypeModal === 11 && (
                <>
                    <Button
                        fullWidth={true}
                        color={buttonColor}
                        size="ms"
                        onPress={onOpen}
                        className={`flex items-center gap-4 justify-start px-3 rounded-md hover:bg-background`}
                    >
                        {buttonIcon} {buttonName}
                    </Button>
                    <Modal
                        isOpen={isOpen}
                        hideCloseButton={true}
                        onOpenChange={handleModalOpenChange}
                        isDismissable={true}
                        isKeyboardDismissDisabled={false}
                        className="z-50"
                        size="sm"
                    >
                        <ModalContent>
                            {(onClose) => (
                                <form onSubmit={handlePasswordUpdate}>
                                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white p-2">
                                        <div className="flex flex-row justify-start gap-4 pl-4">
                                            {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                        </div>
                                        <div className="flex flex-row items-center justify-end">
                                            <Button
                                                color="transparent"
                                                variant="light"
                                                className="w-auto min-w-0 p-0 m-0 -pr-4"
                                                onClick={() => onClose()}
                                            >
                                                <MdClose size={30} />
                                            </Button>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody className="flex flex-col space-y-8 bg-background">
                                        <Tabs aria-label="Options" className="flex justify-center">
                                            <Tab key="idInfo" title="ID Info">
                                                {/* Informações do Usuário */}
                                                <div className="-mt-10 flex flex-col gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">{`Name:`}</label>
                                                        <input
                                                            type="text"
                                                            value={firstName || ""}
                                                            readOnly
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">{`Surname:`}</label>
                                                        <input
                                                            type="text"
                                                            value={secondName || ""}
                                                            readOnly
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-400">{`Email:`}</label>
                                                        <input
                                                            type="text"
                                                            value={email || ""}
                                                            readOnly
                                                            className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                        />
                                                    </div>
                                                    {/* Botão para exibir os campos de senha */}
                                                    {!showPasswordFields && (
                                                        <button
                                                            className="bg-primary text-white p-2 rounded-lg w-32 text-xs cursor-pointer"
                                                            onClick={() => setShowPasswordFields(true)}
                                                        >
                                                            Change Password
                                                        </button>
                                                    )}

                                                    {/* Campos de Redefinição de Senha */}
                                                    {showPasswordFields && (
                                                        <>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">{`Old Password:`}</label>
                                                                <input
                                                                    type="password"
                                                                    value={oldPassword}
                                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">{`New Password:`}</label>
                                                                <input
                                                                    type="password"
                                                                    value={newPassword}
                                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-400">{`Confirm New Password:`}</label>
                                                                <input
                                                                    type="password"
                                                                    value={confirmNewPassword}
                                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                                                                    required
                                                                />
                                                            </div>
                                                            {errorMessage && (
                                                                <p className="text-red-500 text-sm">{errorMessage}</p>
                                                            )}
                                                            {successMessage && (
                                                                <p className="text-green-500 text-sm">{successMessage}</p>
                                                            )}
                                                            <Button type="submit" color="primary">
                                                                Update Password
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </Tab>
                                            <Tab key="properties" title="Properties">
                                                <div>
                                                    {hotels.length > 0 ? (
                                                        <div>
                                                            {hotels.map((hotel, index) => (
                                                                <div key={index} className="mb-4">
                                                                    <label className="block text-sm font-medium text-gray-400">{`Property ${index + 1}`}</label>
                                                                    <input
                                                                        type="text"
                                                                        value={hotel.propertyName || ""}
                                                                        readOnly
                                                                        className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p>No properties found.</p>
                                                    )}
                                                </div>

                                            </Tab>
                                        </Tabs>
                                    </ModalBody>
                                </form>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ProfileModalForm;
