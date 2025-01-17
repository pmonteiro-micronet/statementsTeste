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
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import { DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from "@nextui-org/react";

const AllProfilesForm = ({
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
    const [users, setUsers] = useState([]); // Estado para armazenar os usuários

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/user`); // Faz a chamada para a API
                console.log("users", response);
                if (Array.isArray(response.data.response)) {
                    setUsers(response.data.response); // Atualiza o estado com os dados retornados
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchUsers();
    }, []);

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
                        size="2xl"
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
                                <div className="overflow-auto md:overflow-visible">
                                    <table className="w-full text-left mb-5 min-w-full md:min-w-0 border-collapse">
                                        <thead>
                                            <tr className="bg-primary text-white h-12">
                                                <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6] uppercase">
                                                    <FaGear size={18} color="white" />
                                                </td>
                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">Name</td>
                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">Last Name</td>
                                                <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">Email</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr
                                                    key={index}
                                                    className="h-10 border-b border-[#e8e6e6] text-left text-textPrimaryColor hover:bg-primary-50"
                                                >
                                                    <td className="pl-1 flex items-start border-r border-[#e6e6e6] relative z-10">
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                                <Button
                                                                    variant="light"
                                                                    className="flex justify-center items-center w-auto min-w-0 p-0 m-0 relative"
                                                                >
                                                                    <BsThreeDotsVertical size={20} className="text-textPrimaryColor" />
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu
                                                                aria-label="Static Actions"
                                                                closeOnSelect={true}
                                                                className="relative z-10 text-textPrimaryColor"
                                                            >
                                                                <DropdownItem key="info">Info</DropdownItem>
                                                                <DropdownItem key="test">Teste</DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </td>
                                                    <td className="pl-2 border-r border-[#e6e6e6]">{user.firstName}</td>
                                                    <td className="pl-2 border-r border-[#e6e6e6]">{user.secondName}</td>
                                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6]">{user.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
};

export default AllProfilesForm;
