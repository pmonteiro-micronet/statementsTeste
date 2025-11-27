"use client"
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

import en from "../../../../public/locales/english/common.json";
import pt from "../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const RatingForm = ({ isOpen, onClose, onSelectRating }) => {
    const [locale, setLocale] = useState("pt");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    console.log(setLocale);
    
    const t = translations[locale] || translations["pt"];

    const handleChoose = (value) => {
        setRating(value);
        onSelectRating(value);   // ← envia rating para o pai
        onClose();               // ← fecha o modal
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            hideCloseButton={true}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            size="md"
            className="z-50"
        >
            <ModalContent>
                <ModalHeader className="flex flex-row w-full !justify-between items-center bg-primary text-white gap-1 text-lg py-1 ">
                    {t.frontOffice.registrationForm.rating.header}
                    <Button color="transparent" variant="light" className="-mr-4" onClick={onClose}>
                        <MdClose size={25} />
                    </Button>
                </ModalHeader>

                <ModalBody className="flex flex-col mx-1 my-5 space-y-8 max-h-96 overflow-y-auto text-textPrimaryColor">
                    <div className="flex flex-col text-center items-center gap-2">
                        <p className="text-xs">{t.frontOffice.registrationForm.rating.ratingScore}</p>

                        <div className="flex space-x-2 text-4xl cursor-pointer items-center justify-center mb-5">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const filled = (hover || rating) >= star;

                                return (
                                    <span
                                        key={star}
                                        onClick={() => handleChoose(star)}   // ← AQUI!
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        {filled ? (
                                            <FaStar className="text-primary" size={30} />
                                        ) : (
                                            <FaRegStar className="text-gray-400" size={30} />
                                        )}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default RatingForm;