"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear, FaPlus } from "react-icons/fa6";
import ProfileModalEditForm from "@/components/modals/user/allProfiles/page";
import CreateUserModal from "@/components/modals/user/createUser/page";

import en from "../../../../public/locales/english/common.json";
import pt from "../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../public/locales/espanol/common.json";


const translations = { en, pt, es };

export default function AllProfiles({ }) {
    const [users, setUsers] = useState([]); // Estado para armazenar os usuários
    const [filteredUsers, setFilteredUsers] = useState([]); // Estado para usuários filtrados
    const [searchQuery, setSearchQuery] = useState(""); // Estado para a barra de pesquisa
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [locale, setLocale] = useState("pt");

    useEffect(() => {
        // Carregar o idioma do localStorage
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLocale(storedLanguage);
        }
    }, []);

    // Carregar as traduções com base no idioma atual
    const t = translations[locale] || translations["pt"]; // fallback para "pt"

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/user`);
                if (Array.isArray(response.data.response)) {
                    setUsers(response.data.response);
                    setFilteredUsers(response.data.response); // Inicializa usuários filtrados
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = users.filter(user =>
            user.userID.toString().includes(lowerCaseQuery) ||
            user.firstName.toLowerCase().includes(lowerCaseQuery) ||
            user.secondName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredUsers.slice(start, end);
    }, [page, rowsPerPage, filteredUsers]);

    const pages = Math.ceil(filteredUsers.length / rowsPerPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleOpenModal = (user) => {
        setSelectedUser(user); // Define o usuário selecionado
        setIsModalOpen(true); // Abre o modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null); // Limpa o usuário selecionado
    };

    return (
        <main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
            <div className="flex-grow overflow-y-auto p-4">
                <div className="flex justify-between items-center w-full">
                    <div className="header-container flex items-center !justify-between w-full">
                        <h2 className="text-xl text-textPrimaryColor">{t.allProfiles.title}</h2>
                        <CreateUserModal
                            buttonIcon={<FaPlus color="white" />}
                            buttonColor={"primary"}
                            formTypeModal={11}
                            modalHeader={t.allProfiles.createUserHeader}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder={t.allProfiles.table.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    />
                </div>

                <div className="mt-5">
                    <div className="overflow-auto md:overflow-visible">
                        <table className="w-full text-left mb-5 min-w-full md:min-w-0 border-collapse">
                            <thead>
                                <tr className="bg-primary text-white h-12">
                                    <td className="pl-2 pr-2 w-8 border-r border-[#e6e6e6] uppercase">
                                        <FaGear size={18} color="white" />
                                    </td>
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">ID</td>
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.allProfiles.table.name}</td>
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.allProfiles.table.lastName}</td>
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">{t.allProfiles.table.email}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((user, index) => (
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
                                                    <DropdownItem key="info" onClick={() => handleOpenModal(user)}>
                                                        {t.allProfiles.table.info}
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{user.userID}</td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{user.firstName}</td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{user.secondName}</td>
                                        <td className="pl-2 pr-2 border-r border-[#e6e6e6]">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 w-full bg-white p-0 m-0 pagination-container">
                <PaginationTable
                    page={page}
                    pages={pages}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    items={items}
                    setPage={setPage}
                    dataCSVButton={items.map((item) => ({
                        ID: item.userID,
                        Name: item.firstName,
                        LastName: item.secondName,
                        Email: item.email,
                    }))}
                />
            </div>

            {isModalOpen && selectedUser && (
                <ProfileModalEditForm
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    modalHeader={t.allProfiles.modalHeader}
                    formTypeModal={11}
                    firstName={selectedUser.firstName}
                    secondName={selectedUser.secondName}
                    email={selectedUser.email}
                    userID={selectedUser.userID}
                    expirationDate={selectedUser.expirationDate}
                />
            )}
        </main>
    );
}
