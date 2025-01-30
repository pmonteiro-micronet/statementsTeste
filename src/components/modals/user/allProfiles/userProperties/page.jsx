import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    useDisclosure,
    Switch,
} from "@heroui/react";
import { MdClose } from "react-icons/md";

const UserPropertiesModal = ({
    buttonName,
    buttonIcon,
    buttonColor,
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    formTypeModal,
    userID,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [properties, setProperties] = useState([]);
    const [userProperties, setUserProperties] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    console.log(loading);
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`/api/properties`);
                if (Array.isArray(response.data.response)) {
                    setProperties(response.data.response);
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar propriedades:", error);
            }
        };

        const fetchUserProperties = async () => {
            try {
                const response = await axios.get(`/api/userProperties/${userID}`);
                if (Array.isArray(response.data.response)) {
                    setUserProperties(new Set(response.data.response.map(prop => prop.propertyID)));
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar propriedades do usuário:", error);
            }
        };

        if (isOpen) {
            fetchProperties();
            fetchUserProperties();
        }
    }, [isOpen, userID]);

    const handleToggleProperty = async (propertyId) => {
        const updatedUserProperties = new Set(userProperties);
        const isCurrentlyAssigned = updatedUserProperties.has(propertyId);

        try {
            setLoading(true);

            if (isCurrentlyAssigned) {
                await axios.delete(`/api/userProperties`, { data: { userID, propertyId } });
                updatedUserProperties.delete(propertyId);
            } else {
                await axios.post(`/api/userProperties`, { userID, propertyId });
                updatedUserProperties.add(propertyId);
            }

            setUserProperties(updatedUserProperties);
            setSuccessMessage("Atualização realizada com sucesso!");
        } catch (error) {
            setErrorMessage("Erro ao atualizar a propriedade.");
            console.error("Erro ao atualizar a propriedade:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {formTypeModal === 11 && (
                <>
                    <Button
                        color={buttonColor}
                        size="ms"
                        onPress={onOpen}
                        className="flex items-center justify-center rounded-md bg-primary px-2 h-8 w-5"
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
                                <div className="flex flex-col gap-2">
                                    <p className="font-semibold">Propriedades do Usuário:</p>
                                    {properties.length === 0 ? (
                                        <p>Nenhuma propriedade encontrada.</p>
                                    ) : (
                                        properties.map((property) => (
                                            <div key={property.propertyID} className="flex justify-between items-center p-2 border-b">
                                                <span>{property.propertyName}</span>
                                                <Switch
                                                    checked={userProperties.has(property.id)}
                                                    onChange={() => handleToggleProperty(property.id)}
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>
                                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                            </ModalBody>

                            <div className="flex justify-end p-4">
                                <Button
                                    color="primary"
                                    className="rounded-md"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Fechar
                                </Button>
                            </div>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};

export default UserPropertiesModal;
