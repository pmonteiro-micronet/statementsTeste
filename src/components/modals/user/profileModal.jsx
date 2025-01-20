"use client";
import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Switch,
} from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Tabs, Tab } from "@nextui-org/react";
import { FaPencilAlt } from "react-icons/fa";
import PropertiesEditForm from "@/components/modals/user/propertiesEdit/page";
import ChangePIN from "@/components/modals/user/changePin/page";

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
    const [selectedHotel, setSelectedHotel] = useState(null); // Estado para armazenar a propriedade selecionada
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusMap, setStatusMap] = useState({});

    const user = session?.user || {};
    const { firstName, secondName, email } = user;

    const isAdmin = user?.permission === 1; // Verifica se o usuário é admin

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

    const handleEditClick = (hotel) => {
        if (isAdmin) {
            setSelectedHotel(hotel); // Armazena a propriedade clicada
            setIsModalOpen(true); // Abre o modal de edição de propriedade
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário
        setErrorMessage("");
        setSuccessMessage("");

        if (isPasswordUpdate) {
            if (!oldPassword || !newPassword || !confirmNewPassword) {
                setErrorMessage("Please fill in all fields.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                setErrorMessage("New passwords do not match.");
                return;
            }

            try {
                const response = await axios.patch(`/api/user/changePassword/${user.id}`, {
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

    // Função para verificar propriedades
    const verifyProperties = async () => {
        const newStatusMap = { ...statusMap }; // Cria uma cópia para garantir a imutabilidade
    
        for (const hotel of hotels) {
            try {
                const hotelData = {
                    propertyServer: hotel.propertyServer,
                    propertyPort: hotel.propertyPort,
                    propertyName: hotel.propertyName, // Adicionando mais dados, se necessário
                };
    
                const response = await axios.post("/api/verifyProperty", hotelData); // Mudando para POST e enviando os dados no corpo
    
                // Atualizar o status do hotel na cópia do statusMap
                newStatusMap[hotel.propertyID] = response.data.success;
            } catch (error) {
                console.error(`Erro ao verificar propriedade ${hotel.propertyName}:`, error);
                newStatusMap[hotel.propertyID] = false; // Marca como off em caso de erro
            }
        }
    
        // Atualizar o estado de statusMap com a nova cópia
        setStatusMap(newStatusMap);
    };       

    useEffect(() => {
        if (hotels.length > 0) {
            verifyProperties(); // Verifica as propriedades ao abrir a aba
        }
    }, [hotels]);

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
                        onOpenChange={onOpenChange}
                        isDismissable={true}
                        isKeyboardDismissDisabled={false}
                        className="z-50"
                        size="sm"
                    >
                        <ModalContent>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white p-2">
                                    <div className="flex flex-row justify-start gap-4 pl-4">
                                        {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                                    </div>
                                    <div className="flex flex-row items-center justify-end">
                                        <Button
                                            color="transparent"
                                            variant="light"
                                            className="w-auto min-w-0 p-0 m-0 -pr-4"
                                            onClick={() => onOpenChange(false)}
                                        >
                                            <MdClose size={30} />
                                        </Button>
                                    </div>
                                </ModalHeader>
                                <ModalBody className="flex flex-col space-y-8 bg-background">
                                    <Tabs aria-label="Options" className="flex justify-center">
                                        <Tab key="idInfo" title="ID Info">
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
                                                <div className="flex flex-row justify-between">
                                                    {!showPasswordFields && (
                                                        <button
                                                            className="bg-primary text-white p-2 rounded-lg w-32 text-xs cursor-pointer"
                                                            onClick={() => {
                                                                setShowPasswordFields(true);
                                                                setIsPasswordUpdate(true);
                                                            }}
                                                        >
                                                            Change Password
                                                        </button>
                                                    )}

                                                    <div className="">
                                                        <ChangePIN
                                                            buttonName={"Change Pin"}
                                                            modalHeader={"Change Pin"}
                                                            userID={user.id}
                                                        />
                                                    </div>
                                                </div>


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
                                                        <div className="flex flex-row justify-between">
                                                            <Button
                                                                type="button"
                                                                className="w-32 text-xs bg-gray-300"
                                                                onClick={() => {
                                                                    setShowPasswordFields(false);
                                                                    setIsPasswordUpdate(false);
                                                                }}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                color="primary"
                                                                className="w-32 text-xs"
                                                            >
                                                                Update Password
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Tab>
                                        <Tab key="properties" title="Properties">
                                            <div>
                                                {hotels.length > 0 ? (
                                                    hotels.map((hotel) => (
                                                        <div
                                                            key={hotel.propertyID}
                                                            className="mb-4 flex flex-col items-left"
                                                        >
                                                            <label className="block text-sm font-medium text-gray-400">
                                                                {hotel.propertyName}
                                                            </label>
                                                            <div className="flex items-center gap-4">
                                                                <input
                                                                    type="text"
                                                                    value={hotel.propertyName || ""}
                                                                    readOnly
                                                                    className="w-full border border-gray-300 rounded-md px-2 py-1 bg-tableFooter text-gray-400 focus:outline-none"
                                                                />
                                                                <Switch
                                                                    size="sm"
                                                                    isSelected={statusMap[hotel.propertyID]}
                                                                    onChange={() =>
                                                                        console.log(
                                                                            `Switch ${hotel.propertyID} toggled`
                                                                        )
                                                                    }
                                                                />
                                                                <FaPencilAlt
                                                                    className={`cursor-pointer ${isAdmin
                                                                            ? "text-primary"
                                                                            : "text-gray-400"
                                                                        }`}
                                                                    onClick={() => handleEditClick(hotel)}
                                                                    style={{
                                                                        pointerEvents: isAdmin
                                                                            ? "auto"
                                                                            : "none",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No properties found.</p>
                                                )}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </ModalBody>
                            </form>
                        </ModalContent>
                    </Modal>
                </>
            )}

            {isModalOpen && selectedHotel && (
                <PropertiesEditForm
                    hotel={selectedHotel}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default ProfileModalForm;
