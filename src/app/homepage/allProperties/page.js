"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import PaginationTable from "@/components/table/paginationTable/page";
import { Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from "@heroui/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear, FaPlus } from "react-icons/fa6";

import CreatePropertyModal from "@/components/modals/allProperties/createProperty/page";

import PropertiesEditForm from "@/components/modals/allProperties/propertiesEdit/page";

export default function AllProfiles({ }) {
    const [properties, setProperties] = useState([]); // Estado para armazenar os usuários
    const [filteredproperties, setFilteredproperties] = useState([]); // Estado para usuários filtrados
    const [searchQuery, setSearchQuery] = useState(""); // Estado para a barra de pesquisa
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        const fetchproperties = async () => {
            try {
                const response = await axios.get(`/api/properties`);
                if (Array.isArray(response.data.response)) {
                    setProperties(response.data.response);
                    setFilteredproperties(response.data.response); // Inicializa usuários filtrados
                } else {
                    console.error("Estrutura de resposta inesperada da API", response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };

        fetchproperties();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = properties.filter(property =>
            property.propertyID.toString().includes(lowerCaseQuery) ||
            property.propertyTag.toLowerCase().includes(lowerCaseQuery) ||
            property.propertyName.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredproperties(filtered);
    }, [searchQuery, properties]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredproperties.slice(start, end);
    }, [page, rowsPerPage, filteredproperties]);

    const pages = Math.ceil(filteredproperties.length / rowsPerPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleOpenModal = (property) => {
        setSelectedProperty(property); // Define o usuário selecionado
        setIsModalOpen(true); // Abre o modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null); // Limpa o usuário selecionado
        window.location.reload(); // Recarrega a página
    };

    return (
        <main className="flex flex-col flex-grow h-full overflow-hidden p-0 m-0 bg-background">
            <div className="flex-grow overflow-y-auto p-4">
                <div className="flex justify-between items-center w-full">
                    <div className="header-container flex items-center !justify-between w-full">
                        <h2 className="text-xl text-textPrimaryColor">All Properties</h2>
                        <CreatePropertyModal
                            buttonIcon={<FaPlus color="white" />}
                            buttonColor={"primary"}
                            formTypeModal={11}
                            modalHeader={"Create Property"}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Search by ID, Property Name, or Property Tag"
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
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">Property Tag</td>
                                    <td className="pl-2 pr-2 border-r border-[#e6e6e6] uppercase">Property Name</td>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((property, index) => (
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
                                                    <DropdownItem key="info" onClick={() => handleOpenModal(property)}>
                                                        Info
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{property.propertyID}</td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{property.propertyTag}</td>
                                        <td className="pl-2 border-r border-[#e6e6e6]">{property.propertyName}</td>
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
                        ID: item.propertyID,
                        PropertyTag: item.propertyTag,
                        PropertyName: item.propertyName,
                    }))}
                />
            </div>
            {isModalOpen && selectedProperty && (
                <>
                    <PropertiesEditForm
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        modalHeader="User Info"
                        formTypeModal={11}
                        propertyID={selectedProperty.propertyID}
                        hotel={selectedProperty}
                    />
                </>
            )}

        </main>
    );
}
