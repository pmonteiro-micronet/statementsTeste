import React, { useState } from 'react';
import {
    //imports de tabelas
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    //imports de dropdown menu
    Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    //imports de inputs
    Input
  } from "@nextui-org/react";

  import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from "@nextui-org/modal";

const SearchModalAutocomplete = ({ label, name, style, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomNumber, setRoomNumber] = useState('');

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleRoomNumberChange = (event) => {
        setRoomNumber(event.target.value);
    };

    const handleSearch = () => {
        onChange(roomNumber);
        handleCloseModal();
    };

    return (
        <div>
            <Button onClick={handleOpenModal} className="bg-blue-500 text-white">
                {label}
            </Button>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <ModalHeader>
                    <span>Filtrar pelo número do quarto</span>
                </ModalHeader>
                <ModalBody>
                    <Input
                        label="Número do Quarto"
                        placeholder="Insira o número do quarto"
                        value={roomNumber}
                        onChange={handleRoomNumberChange}
                        fullWidth
                    />
                </ModalBody>
                <ModalFooter>
                    <Button auto flat color="error" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button auto onClick={handleSearch}>
                        Procurar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default SearchModalAutocomplete;