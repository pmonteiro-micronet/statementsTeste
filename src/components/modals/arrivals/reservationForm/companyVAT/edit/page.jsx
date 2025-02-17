"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const CompanyVATFormEdit = ({ onClose, profileID, propertyID, initialData }) => {
    const [formData, setFormData] = useState({
        companyName: initialData.companyName || "",
        vatNo: initialData.vatNo || "",
        emailAddress: initialData.emailAddress || "",
        country: initialData.country || "",
        streetAddress: initialData.streetAddress || "",
        zipCode: initialData.zipCode || "",
        city: initialData.city || "",
        state: initialData.state || ""
    });

    useEffect(() => {
        setFormData({
            companyName: initialData.companyName || "",
            vatNo: initialData.vatNo || "",
            emailAddress: initialData.emailAddress || "",
            country: initialData.country || "",
            streetAddress: initialData.streetAddress || "",
            zipCode: initialData.zipCode || "",
            city: initialData.city || "",
            state: initialData.state || ""
        });
    }, [initialData]);

    return (
        <Modal isOpen={true} onOpenChange={onClose} className="z-50" size="lg" hideCloseButton={true}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white">
                            {initialData ? "Edit Company VAT No." : "Create New Company VAT No."}
                            <Button color="transparent" variant="light" onClick={onCloseModal} className="w-auto min-w-0 p-0 m-0">
                                <MdClose size={30} />
                            </Button>
                        </ModalHeader>
                        <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                            {["companyName", "vatNo", "emailAddress", "country", "streetAddress", "zipCode", "city", "state"].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-textPrimaryColor">
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}:
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end space-x-2">
                                <Button color="error" onClick={onCloseModal}>Cancel</Button>
                                <Button color="primary" onClick={() => console.log("Saving data...", formData)}>Save</Button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};


export default CompanyVATFormEdit;
