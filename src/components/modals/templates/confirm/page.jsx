"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { MdClose } from "react-icons/md";

const ConfirmRegistrationForm = ({
  modalHeader,
  errorMessage,
  onConfirm, // novo: usuário confirmou
  onCancel,  // novo: usuário cancelou
  t,
}) => {
  const errorMessages = errorMessage ? errorMessage.split("\n") : [];

  return (
    <Modal
      isOpen={!!errorMessage}
      hideCloseButton={true}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      size="md"
      className="z-50"
    >
      <ModalContent>
        <ModalHeader className="flex flex-row w-full justify-between items-center bg-primary text-white gap-1 text-lg py-1">
          {modalHeader}
          <Button
            color="transparent"
            variant="light"
            className="-mr-4"
            onClick={onCancel}
          >
            <MdClose size={25} />
          </Button>
        </ModalHeader>

        <ModalBody className="flex flex-col mx-1 my-5 space-y-8 max-h-96 overflow-y-auto text-textPrimaryColor">
          {errorMessages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button variant="light" color="default" onClick={onCancel}>
            {t.frontOffice.registrationForm.cancel}
          </Button>
          <Button color="primary" onClick={onConfirm}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmRegistrationForm;
