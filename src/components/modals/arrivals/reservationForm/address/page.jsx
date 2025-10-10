"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import Select from "react-select";
import axios from "axios";
import ConfirmRegistrationForm from "@/components/modals/templates/confirm/page.jsx";

const AddressForm = ({ onClose, onSave, address, propertyID, t }) => {
    //popula o select de pais
    const [countryOptions, setCountryOptions] = useState([]);

    const [formData, setFormData] = useState(() => ({
        Country: address?.Country || "",
        Street: address?.Street || "",
        PostalCode: address?.PostalCode || "",
        City: address?.City || "",
        // Region: address?.Region || "",
    }));

    const [countryIDSelected, setCountryIDSelected] = useState(() => ({
        CountryID: ""
    }));

    console.log("ID", propertyID);
    const [isDataModified, setIsDataModified] = useState(false);
    const inputRef = useRef(null);

   const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Lógica principal de fechamento
    const handleCloseModal = () => {
        if (isDataModified) {
            setShowConfirmModal(true);
        } else {
            onClose(); // fecha o modal principal
        }
    };

    // Quando o usuário confirma no modal de confirmação
    const handleConfirmClose = () => {
        setShowConfirmModal(false);
        onClose(); // fecha o modal principal
    };

    // Quando o usuário cancela o fechamento
    const handleCancelClose = () => {
        setShowConfirmModal(false); // fecha apenas o modal de confirmação
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
                if (!propertyID) {
                    console.log("Não há propertyID associado", propertyID);
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

//   const saveAddress = async () => {
//     try {
//         const payload = {
//             countryID: countryIDSelected.CountryID,
//             address: formData.Street,
//             postalcode: formData.PostalCode,
//             city: formData.City,
//             // region: formData.Region,
//             profileID: profileID,
//             propertyID: propertyID
//         };

//         const response = await axios.post('/api/reservations/checkins/registrationForm/editaddress', payload);

//         if (response.status === 200) {
//             setIsDataModified(false);
//             return { success: true };
//         } else {
//             console.error("Failed to save address:", response.data);
//             return { success: false, error: response.data };
//         }
//     } catch (error) {
//         console.error("Error saving address:", error?.response?.data || error.message);
//         return { success: false, error: error?.response?.data || error.message };
//     }
// };




// const handleSave = async () => {
//     const result = await saveAddress();
//     if (result?.success) {
//         setIsDataModified(false);
//         onClose(formData);
//     } else {
//         console.error("Erro ao alterar endereço:", result?.error);
//     }
// };

 const handleSave = () => {
        onSave({
            ...formData,
            CountryID: countryIDSelected.CountryID
        });
        setIsDataModified(false);
        onClose();
    };

    return (
        <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-10">
                            {t.modals.Address.title}
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
                                {/* Morada*/}
                                <div className="w-full">
                                    <label className="block text-sm font-medium">
                                        {t.modals.Address.streetAdress}
                                    </label>
                                    <input
                                        type="text"
                                        name="Street"
                                        value={formData.Street}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        ref={inputRef}
                                        autoFocus={true}
                                    />
                                </div>

                                {/* fila de baixo */}
                                <div className="flex gap-4 flex-wrap ">
                                    <div className="flex-1 min-w-[150px]">
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

                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium">
                                            {t.modals.Address.city}
                                        </label>
                                        <input
                                            type="text"
                                            name="City"
                                            value={formData.City}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-2 py-[0.375rem] focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div>

                                    {/* <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium">
                                            {t.modals.Address.SPR}
                                        </label>
                                        <input
                                            type="text"
                                            name="Region"
                                            value={formData.Region}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                        />
                                    </div> */}

                                    <div className="flex-1 min-w-[150px]">
                                        <label className="block text-sm font-medium">
                                            {t.modals.Address.country}*
                                        </label>
                                        <Select
                                            options={countryOptions}
                                            value={countryOptions.find(option => option.label === formData.Country)}
                                            onChange={(selectedOption) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    Country: selectedOption.label,
                                                }));

                                                setCountryIDSelected({
                                                    CountryID: selectedOption.value,
                                                });

                                                setIsDataModified(true);
                                            }}
                                            isSearchable
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 ">
                                    <Button color="error" onClick={handleCloseModal}>
                                        {t.modals.companyInfo.cancel}
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={handleSave}
                                    >
                                        {t.modals.companyInfo.save}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
            {showConfirmModal && (
                <ConfirmRegistrationForm
                    modalHeader={t.frontOffice.registrationForm.attention}
                    errorMessage={t.modals.errors.loseData}
                    onConfirm={handleConfirmClose} // confirma -> fecha ambos
                    onCancel={handleCancelClose}   // cancela -> fecha só o modal de confirmação
                    t={t}
                />
            )}
        </Modal>
    );
};

export default AddressForm;
