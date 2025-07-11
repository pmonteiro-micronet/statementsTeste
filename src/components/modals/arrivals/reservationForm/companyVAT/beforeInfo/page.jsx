"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

import en from "../../../../../../../public/locales/english/common.json";
import pt from "../../../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const BeforeCompanyVat = ({ onClose, propertyID }) => {
  const [locale, setLocale] = useState("pt");
  const [formData, setFormData] = useState({ companyName: "", vatNo: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [vatError, setVatError] = useState("");
  const [isDataModified, setIsDataModified] = useState(false);
  const inputRef = useRef(null);
    console.log(errorMessage, isDataModified);
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) setLocale(storedLanguage);
  }, []);

  const t = translations[locale] || translations["pt"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setIsDataModified(true);

    if (name === "emailAddress") {
      const emailRegex = /\S+@\S+\.\S+/;
      setErrorMessage(emailRegex.test(value) ? "" : "E-mail inválido.");
    }
  };

  const handleBlur = () => {
    if (formData.country === "Portugal" && formData.vatNo && !/^\d{9}$/.test(formData.vatNo)) {
      setVatError("O NIF português deve ter exatamente 9 dígitos.");
    } else {
      setVatError("");
    }
  };

  const handleCloseModal = () => {
    if (onClose) onClose();
  };

  const handleSearchClick = async () => {
    try {
      const response = await fetch("/api/reservations/checkins/registrationForm/searchcompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyID,
          companyName: formData.companyName,
          vatNo: formData.vatNo,
          pageNumber: 1
        })
      });

      if (!response.ok) throw new Error("Erro ao buscar empresa");

      const data = await response.json();
      console.log("Resultado da empresa:", data);
      setSearchResults(data);
      setIsResultsModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
    }
  };

  return (
    <>
      {/* Modal de resultados */}
      {isResultsModalOpen && (
        <Modal
          isOpen={isResultsModalOpen}
          onOpenChange={() => setIsResultsModalOpen(false)}
          className="z-60"
          size="3xl"
          hideCloseButton={false}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex justify-between items-center bg-primary text-white h-12 px-4">
                  Empresas encontradas
                  <Button
                    color="transparent"
                    variant="light"
                    onClick={() => setIsResultsModalOpen(false)}
                    className="p-0"
                  >
                    <MdClose size={24} />
                  </Button>
                </ModalHeader>
                <ModalBody className="p-4 max-h-[60vh] overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <p>Nenhuma empresa encontrada.</p>
                  ) : (
                    <ul>
                      {searchResults.map((company, index) => (
                        <li key={company.kdnr || index} className="border-b border-gray-300 py-2">
                          <p><strong>Empresa:</strong> {company.shortname || "—"}</p>
                          <p><strong>NIF:</strong> {company.vatno || "—"}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      {/* Modal principal */}
      <Modal isOpen={true} onOpenChange={handleCloseModal} className="z-50" size="5xl" hideCloseButton={true}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-row justify-between items-center gap-1 bg-primary text-white h-12">
                {t.modals?.companyInfo?.insert || "Insert Company Info"}
                <Button color="transparent" variant="light" onClick={handleCloseModal} className="w-auto min-w-0 p-0 m-0">
                  <MdClose size={30} />
                </Button>
              </ModalHeader>
              <ModalBody className="flex flex-col mx-5 my-5 space-y-4 text-textPrimaryColor max-h-[70vh] overflow-y-auto">
                <div className="flex flex-col">
                  <div className="flex flex-row gap-2 mb-0.5 items-end">
                    <div className="w-1/3">
                      <label className="block text-sm font-medium text-textPrimaryColor">
                        {t.modals.companyInfo.vatNO}
                      </label>
                      <input
                        type="text"
                        name="vatNo"
                        value={formData.vatNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                      />
                      {vatError && <p className="text-red-500 text-xs mt-1">{vatError}</p>}
                    </div>

                    <div className="w-2/3">
                      <label className="block text-sm font-medium text-textPrimaryColor">
                        {t.modals.companyInfo.companyName}
                      </label>
                      <input
                        ref={inputRef}
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline focus:outline-black focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div className="self-end">
                      <button
                        onClick={handleSearchClick}
                        className="px-3 py-2 bg-primary text-white rounded-md flex items-center justify-center"
                      >
                        <CiSearch color="white" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BeforeCompanyVat;
