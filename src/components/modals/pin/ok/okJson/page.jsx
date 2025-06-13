import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@heroui/react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

const isDesktop = () => {
    if (typeof window !== "undefined") {
        return window.innerWidth >= 2000;
    }
    return false;
};

const OkPIN = ({ isModalOpen, setIsModalOpen }) => {
    const [pin, setPin] = useState("");
    const [isPinError, setIsPinError] = useState(false);
    const [userPinHash, setUserPinHash] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();
    const [propertyID, setPropertyID] = useState("");
    const [autoFocusEnabled, setAutoFocusEnabled] = useState(false);
    const { onOpenChange } = useDisclosure();
    console.log(propertyID, onOpenChange);
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
                const userPinHash = session?.user?.pin;
                setPropertyID(userPropertyID);
                setUserPinHash(userPinHash);
            }
        };

        checkSession();
    }, [session, status, router]);

    const [selectedHotelID, setSelectedHotelID] = useState("");

    useEffect(() => {
        const savedHotelID = localStorage.getItem("selectedHotelID");
        setSelectedHotelID(savedHotelID || "defaultHotelID");
    }, []);

    const handlePinSubmit = async (e) => {
        if (e) e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        const recordID = queryParams.get("recordID");

        try {
            const isPinCorrect = await bcrypt.compare(pin, userPinHash);
            if (isPinCorrect) {
                await axios.patch(`/api/get_jsons/${recordID}`);
                router.push(`/homepage/frontOfficeView/${selectedHotelID}`);
            } else {
                setPin("");
                setIsPinError(true);
            }
        } catch (error) {
            console.error("Erro ao marcar como visto:", error);
        }
    };

    const handleModalOpenChange = (isOpen) => {
        setIsModalOpen(isOpen);
        setPin("");
        setIsPinError(false);
    };

    return (
        isModalOpen && (
            <Modal
                isOpen={isModalOpen}
                hideCloseButton={true}
                onOpenChange={handleModalOpenChange}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
                className="z-50"
                size="sm"
            >
                <ModalContent>
                    {() => (
                        <form onSubmit={handlePinSubmit}>
                            <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white p-2">
                                <div className="flex flex-row justify-start gap-4 pl-4">
                                    Digite seu PIN
                                </div>
                                <div className="flex flex-row items-center justify-end">
                                    <Button
                                        color="transparent"
                                        variant="light"
                                        className="w-auto min-w-0 p-0 m-0 -pr-4"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <MdClose size={30} />
                                    </Button>
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex flex-col mx-5 my-2">
                                <div className="flex flex-row gap-2">
                                    <input
                                        type="password"
                                        value={pin}
                                        autoFocus={autoFocusEnabled}
                                        onChange={(e) => {
                                            setPin(e.target.value);
                                            setIsPinError(false); // Reseta o erro ao digitar
                                        }}
                                        className="border border-gray-300 p-2 w-full text-center mb-4 text-textPrimaryColor"
                                        placeholder="• • • •"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePinSubmit}
                                        className="w-24 h-10 rounded bg-primary text-white text-center font-bold"
                                    >
                                        OK
                                    </button>
                                </div>

                                {isPinError && (
                                    <p className="text-red-500 -mt-4">Incorrect PIN. Try again.</p>
                                )}
                                {/* <div className="grid grid-cols-3 gap-2">
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
                                            className={`p-4 rounded ${key === "C" ? "bg-mediumGray text-textPrimaryColor" : key === "OK" ? "bg-primary text-white" : "bg-lightGray text-textPrimaryColor"} text-center font-bold`}
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div> */}
                            </ModalBody>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        )
    );
};

export default OkPIN;
