"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const CompanyVATForm = ({ onClose, profileID, propertyID }) => {
    const [formData, setFormData] = useState({
        companyName: "",
        country: "",
        streetAddress: "",
        zipCode: "",
        city: "",
        state: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        for (const key in formData) {
            if (!formData[key].trim()) {
                setErrorMessage(`All fields must be filled.`);
                return;
            }
        }

        try {
            const response = await axios.post("/api/reservations/checkins/registrationForm/createCompanyVAT", {
                profileID,
                propertyID,
                ...formData
            });
            console.log("Success:", response.data);
            setErrorMessage("");
            onClose();
        } catch (error) {
            console.error("Error saving VAT info:", error);
            setErrorMessage("Failed to save. Please try again.");
        }
    };

    return (
        <Modal isOpen={true} onOpenChange={onClose} className="z-50" size="lg" hideCloseButton={true}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            Create new Company VAT No.
                            <Button color="transparent" variant="light" onClick={onCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor">
                            {["companyName", "country", "streetAddress", "zipCode", "city", "state"].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-textPrimaryColor">
                                        {field.replace(/([A-Z])/g, ' $1').trim()}:
                                    </label>
                                    <input
                                        ref={index === 0 ? inputRef : null}
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            ))}
                            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                            <div className="flex justify-end space-x-2">
                                <Button color="error" onClick={onCloseModal}>Cancel</Button>
                                <Button color="primary" onClick={handleSave}>Save</Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default CompanyVATForm;
