"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import Select from "react-select";
import axios from "axios";


const AddressForm = ({ onClose, personalID, propertyID, t }) => {
    //popula o select de pais
    const [countryOptions, setCountryOptions] = useState([]);

    const [formData, setFormData] = useState(() => ({
        Country: personalID?.Country || "",
        Street: personalID?.Street || "",
        PostalCode: personalID?.PostalCode || "",
        City: personalID?.City || "",
        Region: personalID?.Region || "",
    }));

    console.log("ID" , propertyID);
    const [isDataModified, setIsDataModified] = useState(false);
    const inputRef = useRef(null);

    const handleCloseModal = () => {
        if (isDataModified) {
            const confirmLeave = window.confirm("Você vai perder os dados, continuar?");
            if (confirmLeave) onClose();
        } else {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDataModified(true);
    };


    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    //useEffect para popular countryOptions
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                if(!propertyID) {
                    console.log("Não há propertyID associado"  , propertyID);
                }
                const response = await axios.get(`/api/reservations/checkins/registrationForm/countries?propertyID=${propertyID}`);
                const formattedOptions = response.data
                    .map((country) => ({
                        value: country.codenr,
                        label: country.land,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setCountryOptions(formattedOptions);
            } catch (error) {
                console.error("Erro ao buscar países:", error);
            }
        };
        fetchCountries();
    }, [propertyID]);


    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            {t.modals.Address.title }
                            <Button
                                color="transparent"
                                variant="light"
                                onClick={handleCloseModal}
                                className="w-auto min-w-0 p-0 m-0"
                            >
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>

                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {/*Vai buscar as diferentes traduções aos ficheiros no public ->locales */}
                                            {t.modals.Address.country}
                                        </label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(option => option.value === formData.Country)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Country: selectedOption.value,
                                                }));
                                                setIsDataModified(true);
                                            }}
                                            isSearchable
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.Address.streetAdress}
                                        </label>
                                        <input
                                            type="text"
                                            name="Street"
                                            value={formData.Street}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium">
                                            {t.modals.Address.zipCode}
                                        </label>
                                        <input
                                            type="text"
                                            name="PostalCode"
                                            value={formData.PostalCode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.Address.city} </label>
                                        <input
                                            type="text"
                                            name="City"
                                            value={formData.City}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium">{t.modals.Address.SPR} </label>
                                        <input
                                            type="text"
                                            name="Region"
                                            value={formData.Region}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 -mt-4">
                                    <Button color="error" onClick={handleCloseModal}>
                                        {t.modals.companyInfo.cancel}
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            onClose(formData);
                                        }}
                                    >
                                        {t.modals.companyInfo.save}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddressForm;
