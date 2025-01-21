"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, } from "@nextui-org/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
// import { MdOutlineRefresh } from "react-icons/md";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

// import ArrivalInfoForm from "@/components/modals/arrivals/info/page";
// import LoadingBackdrop from "@/components/Loader/page";

// import { useRouter } from "next/navigation";
// import dayjs from 'dayjs';

// import ErrorRegistrationForm from "@/components/modals/arrivals/reservationForm/error/page";
import ProfileModalEditForm from "@/components/modals/user/allProfiles/page";

export default function AllProfiles({ }) {
    const [users, setUsers] = useState([]); // Estado para armazenar os usuários
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

   useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/user`);
                if (Array.isArray(response.data.response)) {
                    setUsers(response.data.response);
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchUsers();
    }, []);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return users.slice(start, end);
    }, [page, rowsPerPage, users]);

    const pages = Math.ceil(users.length / rowsPerPage);

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
                    <div className="header-container flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4 mx-auto">
                            <h2 className="text-xl text-textPrimaryColor">All Profiles</h2>
                        </div>
                    </div>
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
                                                    <DropdownItem key="info" onClick={() => handleOpenModal(user)}>
                                                        Info
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
                    modalHeader="User Info"
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