"use client";
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

const isDesktop = () => {
    if (typeof window !== "undefined") {
        return window.innerWidth >= 1024; // Define dispositivos desktop como largura maior ou igual a 1024px
    }
    return false;
};

const OkPIN = ({
    modalHeader,
    editIcon,
    modalEditArrow,
    modalEdit,
    isOpen, // Receber o estado de visibilidade como prop
    onClose, // Receber a função para fechar como prop
}) => {
    const [pin, setPin] = useState(""); // Estado para o PIN
    const [isPinError, setIsPinError] = useState(false);
    const [userPinHash, setUserPinHash] = useState(""); // Estado para o hash do PIN do usuário logado

    const router = useRouter();
    const { data: session, status } = useSession();
    const [setPropertyID] = useState("");
    const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);

    useEffect(() => {
        setAutoFocusEnabled(isDesktop());
    }, []);

    useEffect(() => {
        const checkSession = async () => {
            if (status === "loading") return;

            if (!session) {
                router.push("/auth");
            } else {
                const userPropertyID = localStorage.getItem("recordPropertyID");
                const userPinHash = session?.user?.pin; // Supondo que o PIN armazenado é o hash
                setPropertyID(userPropertyID);
                setUserPinHash(userPinHash);
            }
        };

        checkSession();
    }, [session, status, router]);

    const handlePinSubmit = async (e) => {
        if (e) e.preventDefault();

        try {
            const isPinCorrect = await bcrypt.compare(pin, userPinHash);
            if (isPinCorrect) {
                await axios.patch(`/api/get_jsons/${recordID}`);
                router.push("/homepage");
            } else {
                setPin("");
                setIsPinError(true);
            }
        } catch (error) {
            console.error("Erro ao marcar como visto:", error);
        }
    };

    return (
        <Modal
            isOpen={isOpen} // Controlado externamente
            hideCloseButton={true}
            onOpenChange={onClose} // Fechar quando o modal for encerrado
            isDismissable={true}
            isKeyboardDismissDisabled={false}
            className="z-50"
            size="sm"
        >
            <ModalContent>
                <form onSubmit={handlePinSubmit}>
                    <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white p-2">
                        <div className="flex flex-row justify-start gap-4 pl-4">
                            {editIcon} {modalHeader} {modalEditArrow} {modalEdit}
                        </div>
                        <div className="flex flex-row items-center justify-end">
                            <Button color="transparent" variant="light" onClick={onClose}>
                                <MdClose size={30} />
                            </Button>
                        </div>
                    </ModalHeader>
                    <ModalBody className="flex flex-col mx-5 my-2">
                        <input
                            type="password"
                            value={pin}
                            autoFocus={autoFocusEnabled}
                            onChange={(e) => {
                                setPin(e.target.value);
                                setIsPinError(false);
                            }}
                            className="border border-gray-300 p-2 w-full text-center mb-4 text-textPrimaryColor"
                            placeholder="• • • •"
                        />
                        {isPinError && <p className="text-red-500 -mt-4">PIN incorreto. Tente novamente.</p>}
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "OK"].map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        if (key === "C") {
                                            setPin("");
                                            setIsPinError(false);
                                        } else if (key === "OK") {
                                            handlePinSubmit();
                                        } else {
                                            setPin((prevPin) => prevPin + key.toString());
                                            setIsPinError(false);
                                        }
                                    }}
                                    className={`p-4 rounded ${
                                        key === "C"
                                            ? "bg-mediumGray text-textPrimaryColor"
                                            : key === "OK"
                                            ? "bg-primary text-white"
                                            : "bg-lightGray text-textPrimaryColor"
                                    } text-center font-bold`}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </ModalBody>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default OkPIN;
