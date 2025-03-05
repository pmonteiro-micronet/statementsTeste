"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OkPIN from "@/components/modals/pin/ok/okJson/page";
import CancelPIN from "@/components/modals/pin/cancel/page";
import "./styles.css";
import en from "../../../../public/locales/english/common.json";
import pt from "../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../public/locales/espanol/common.json";
import InputFieldControlled from "@/components/input/page";
import { FaPencilAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import CompanyVATFormEdit from "@/components/modals/arrivals/reservationForm/companyVAT/edit/page";
import CompanyVATFormInsert from "@/components/modals/arrivals/reservationForm/companyVAT/insert/page";
import EditVatNoModal from "@/components/modals/arrivals/reservationForm/vatEdit/page";

const translations = { en, pt, es };
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dp6iart4f/image/upload/hotels/";
const JsonViewPage = () => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userPinHash, setUserPinHash] = useState(""); // Estado para o hash do pin do usuário logado
  const router = useRouter();
  console.log(userPinHash, showModal);
  const [imageExists, setImageExists] = useState(false);
  console.log(setShowModal);
  const { data: session, status } = useSession();
  const [propertyID, setPropertyID] = useState("");

  const [activeKey, setActiveKey] = useState("individual");
  const inputStyleFull = "w-full h-4 outline-none my-2 text-sm !text-textLabelColor bg-cardColor input-field"

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCVATModalOpen, setIsCVATModalOpen] = useState(false);
  const [isCVATModalOpenInsert, setIsCVATModalOpenInsert] = useState(false);
  const [companyVATData, setCompanyVATData] = useState(null);
  const [vatNo, setVatNo] = useState("");
  const [initialVatNo, setInitialVatNo] = useState("");
  const [profileID, setProfileID] = useState(null);

  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, null, window.location.href);
    };

    // Adiciona evento para prevenir retrocesso
    window.addEventListener('popstate', preventBackNavigation);

    // Configura o estado inicial do histórico
    window.history.pushState(null, null, window.location.href);

    return () => {
      // Remove o evento quando o componente é desmontado
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  const [locale, setLocale] = useState("pt");

  useEffect(() => {
    // Carregar o idioma do localStorage
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLocale(storedLanguage);
    }
  }, []);

  // Carregar as traduções com base no idioma atual
  const t = translations[locale] || translations["pt"]; // fallback para "pt"


  useEffect(() => {
    const checkSession = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/auth");
      } else {
        // Pega o propertyID e o pin do usuário da sessão
        const userPropertyID = localStorage.getItem("recordPropertyID");
        const userPinHash = session?.user?.pin; // Supondo que o pin armazenado é o hash
        setPropertyID(userPropertyID);
        setUserPinHash(userPinHash); // Armazena o hash do pin
      }
    };

    checkSession();
  }, [session, status, router]);

  useEffect(() => {
    // Captura os parâmetros da URL
    const queryParams = new URLSearchParams(window.location.search);
    const recordID = queryParams.get("recordID");
    const propertyID = queryParams.get("propertyID");
    setPropertyID(propertyID); // Armazena o propertyID

    if (recordID && propertyID) {
      const fetchReservation = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/get_jsons/${recordID}`);
          setReservationData(response.data.response[0]);
        } catch (error) {
          setError("Erro ao carregar os dados: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReservation();
    }
  }, []);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const checkImage = async () => {
      if (!propertyID) return;

      console.log("Checking image for propertyID:", propertyID);

      const imgUrl = `${CLOUDINARY_BASE_URL}${propertyID}.png`; // Construindo a URL esperada
      setImageUrl(imgUrl); // Atualiza o estado com a URL da imagem

      const img = new Image();
      img.src = imgUrl;

      img.onload = () => {
        console.log("Image exists for propertyID:", propertyID);
        setImageExists(true);
      };
      img.onerror = () => {
        console.log("Image not found for propertyID:", propertyID);
        setImageExists(false);
      };
    };

    checkImage();
  }, [propertyID]);

  const handleOkClick = async () => {
    const vatNoToSend = vatNo !== initialVatNo ? vatNo : undefined;

    if (!vatNoToSend) {
      console.log("Nenhuma alteração no VAT. Apenas abrindo modal...");
      setIsModalOpen(true); // Use setIsModalOpen para abrir o modal sem enviar dados
      return;
    }

    try {
      const dataToSend = {
        vatNo: vatNoToSend,
        registerID: profileID,  // Usamos o profileID armazenado no estado
        propertyID: propertyID
      };

      console.log("Enviando dados para a API:", dataToSend);

      const response = await axios.post(`/api/reservations/checkins/registrationForm/valuesEdited`, dataToSend);

      console.log("Resposta da API:", response.data);

      // Abre o modal APÓS o sucesso no envio dos dados
      setIsModalOpen(true);  // Abrir o modal após sucesso no envio
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      // Aqui você pode definir um estado de erro, caso necessário, ou informar o usuário.
    }
  };


  if (status === "loading") {
    return <p>{t.errors.loading}</p>;
  }

  const handleEditClick = async () => {
    if (!reservationData || !reservationData.requestBody) {
      console.log("Erro: requestBody não encontrado");
      return;
    }

    try {
      const parsedData = JSON.parse(reservationData.requestBody);
      const reservations = parsedData[0]?.Reservation;
      const guestInfo = parsedData[0]?.GuestInfo;

      if (!Array.isArray(reservations) || reservations.length === 0) {
        console.log("Erro: Nenhuma reserva encontrada");
        return;
      }

      const blockedVatNO = reservations[0].BlockedVatNO;
      console.log("BlockedVatNO encontrado:", blockedVatNO);

      // Pegamos o profileID se GuestInfo existir
      const profileID = guestInfo?.length > 0 ? guestInfo[0].profileID : null;
      console.log("ProfileID encontrado:", profileID);

      if (profileID) {
        // Atualiza o estado de profileID
        setProfileID(profileID);  // Adiciona essa linha para atualizar o estado do profileID
      }

      if (blockedVatNO === 0) {
        console.log("Abrindo modal...");

        setIsModalEditOpen(true)
        setInitialVatNo(reservations[0].vatNo || ""); // Caso precise setar algum valor no estado
        setVatNo(reservations[0].vatNo || ""); // Atualiza o estado do VAT, se necessário
      } else {
        console.log("Modal não pode ser aberto porque BlockedVatNO não é 0");
      }
    } catch (error) {
      console.error("Erro ao processar o pedido:", error);
    }
  };



  return (
    <main className="overflow-y-auto pb-10 bodyContainer">
      {loading ? (
        <p>{t.errors.loading}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservationData ? (
        <>
          {imageExists && (
            <div className="mb-4 w-screen">
              <img
                src={imageUrl}
                alt="Property Image"
                className="mx-auto w-52"
              />
            </div>
          )}

          <div className="flex flex-col justify-between items-center w-[80%] mx-auto mt-4">
            <div className="flex flex-row justify-between w-[80%] mb-10 infoContainer">
              {/* Detalhes da Reserva */}
              <div className="text-left">
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.Reservation
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].Reservation.map(
                      (reservation, index) => (
                        <div key={index} className="text-textPrimaryColor">
                          <p className="font-bold text-3xl text-primary roomInfo">
                            {t.jsonView.room}:{" "}
                            <span className="font-bold">
                              {reservation.RoomNumber}
                            </span>
                          </p>
                          <p className="textInfo">
                            {t.jsonView.reservationNumber}:{" "}
                            <span className="font-bold">
                              {reservation.ReservationNumber}
                            </span>
                          </p>
                          <p className="textInfo">
                            {t.jsonView.checkIn}:{" "}
                            <span className="font-bold ml-6">
                              {new Date(reservation.DateCI).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="textInfo">
                            {t.jsonView.checkOut}:{" "}
                            <span className="font-bold ml-3">
                              {new Date(reservation.DateCO).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p>{t.jsonView.noReservationDetails}</p>
                  )
                ) : (
                  <p>{t.errors.loading}</p>
                )}
              </div>

              {/* Detalhes do Hóspede */}
              <div className="text-left mt-4 text-textPrimaryColor flex flex-col">
                <div className="flex flex-row justify-between items-center">
                  <div className="flex justify-start gap-6">
                    <p className="text-[#f7ba83] mb-1">Invoice Data</p>
                    <div className="flex flex-row justify-center bg-gray-100 w-34 h-8 rounded-xl items-center -mt-1">
                      <div
                        onClick={() => setActiveKey("individual")}
                        className={`cursor-pointer p-2 ${activeKey === "individual"
                          ? "h-6 flex items-center bg-white text-black rounded-lg m-0.5 text-xs text-bold border border-gray-200"
                          : "text-gray-500 m-1 text-xs"
                          }`}
                      >
                        Individual
                      </div>
                      <div
                        onClick={() => setActiveKey("company")}
                        className={`cursor-pointer p-2 ${activeKey === "company"
                          ? "h-6 flex items-center bg-white text-black rounded-lg m-0.5 text-xs text-bold border border-gray-200"
                          : "text-gray-500 m-1 text-xs"
                          }`}
                      >
                        Company
                      </div>
                    </div>
                  </div>

                  {/* Ícone de edição ou adição no mesmo local */}
                  <div>
                    {activeKey === "individual" ? (
                      <FaPencilAlt
                        size={15}
                        color={reservationData.BlockedVatNO === 1 ? "gray" : "#FC9D25"}
                        style={{
                          cursor: reservationData.BlockedVatNO === 1 ? "not-allowed" : "pointer",
                        }}
                        title={reservationData.BlockedVatNO === 1 ? "Fiscalizado" : ""}
                        onClick={handleEditClick}
                      />
                    ) : (
                      reservationData.hasCompanyVAT === 1 ? (
                        <FaPencilAlt
                          size={15}
                          color={reservationData.BlockedCVatNO === 1 ? "gray" : "#FC9D25"}
                          style={{
                            cursor: reservationData.BlockedCVatNO === 1 ? "not-allowed" : "pointer",
                          }}
                          title={reservationData.BlockedCVatNO === 1 ? "Fiscalizado" : ""}
                          onClick={() => {
                            if (reservationData.BlockedCVatNO === 0) {
                              const companyData = {
                                companyName: reservationData.Company || "",
                                vatNo: reservationData.CompanyVatNo || "",
                                emailAddress: reservationData.CompanyEmail || "",
                                country: reservationData.CompanyCountryName || "",
                                streetAddress: reservationData.CompanyStreetAddress || "",
                                zipCode: reservationData.CompanyZipCode || "",
                                city: reservationData.CompanyCity || "",
                                state: reservationData.CompanyState || "",
                              };

                              console.log("Definindo companyVATData:", companyData);
                              setCompanyVATData(companyData);
                            }
                          }}
                        />
                      ) : (
                        <FaPlusCircle
                          size={20}
                          color="#FC9D25"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setIsCVATModalOpenInsert(true);
                          }}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Informações do hóspede */}
                <div className="mt-4">
                  {reservationData && reservationData.requestBody ? (
                    (() => {
                      let parsedData = [];
                      try {
                        parsedData = JSON.parse(reservationData.requestBody);
                      } catch (error) {
                        console.error("Erro ao fazer o parse do JSON:", error);
                        return <p>{t.errors.loading}</p>;
                      }

                      const reservation = parsedData[0] || {};
                      const guests = Array.isArray(reservation.GuestInfo)
                        ? reservation.GuestInfo
                        : [];
                      const guest = guests.length > 0 ? guests[0] : {};

                      return (
                        <>
                          {/* Nome da empresa ou hóspede */}
                          <p className="!text-textLabelColor text-lg">
                            {activeKey === "company"
                              ? reservation.hasCompanyVAT === 1
                                ? reservation.Company || ""
                                : ""
                              : `${guest.LastName || ""}, ${guest.FirstName || ""}`}
                          </p>

                          {/* Campo VAT Nr. aparece para ambos os casos */}
                          <div className="mt-4">
                            <InputFieldControlled
                              type="text"
                              id="VAT Nr."
                              name="VAT Nr."
                              label={t.frontOffice.registrationForm.vatNr}
                              ariaLabel="VAT Nr.:"
                              value={
                                activeKey === "company"
                                  ? reservation.hasCompanyVAT === 1
                                    ? reservation.CompanyVatNo || ""
                                    : ""
                                  : reservation.BlockedVatNO === 1 && !vatNo
                                    ? "999999990"
                                    : vatNo || reservation.vatNo // 🔹 Usa o estado vatNo se já foi alterado
                              }
                              style={inputStyleFull}
                              disabled
                            />

                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <p>{t.errors.loading}</p>
                  )}
                </div>
              </div>
              {/** Modal Dinâmico */}
              {isModalEditOpen && (
                <EditVatNoModal
                  oldVatNo={vatNo} // Passa o VAT No atual
                  onSave={(newValue) => {
                    console.log("Novo VAT No salvo:", newValue);
                    setVatNo(newValue); // Atualiza o estado corretamente
                  }}
                  onClose={() => {
                    console.log("Fechando modal...");
                    setIsModalEditOpen(false);
                  }}
                />
              )}


              {/** Modal Dinâmico */}
              {isCVATModalOpen && (
                <CompanyVATFormEdit
                  onClose={() => setIsCVATModalOpen(false)}
                  profileID={reservationData.ProfileID}
                  propertyID={propertyID}
                  initialData={companyVATData} // Aqui usamos o nome correto da variável
                  resNo={reservationData.ResNo}
                  companyID={reservationData.CompanyID}
                  companyVATData={companyVATData}
                />
              )}

              {isCVATModalOpenInsert && (
                <CompanyVATFormInsert
                  onClose={() => setIsCVATModalOpenInsert(false)}
                  profileID={reservationData.ProfileID}
                  propertyID={propertyID}
                  resNo={reservationData.ResNo}
                />
              )}
            </div>


            {/* Tabela de Itens */}
            <table className="w-[80%] border-collapse border border-gray-300 mb-4 mx-auto containerTable">
              <thead>
                <tr className="text-white bg-primary">
                  <th className="border border-gray-300 p-2 text-xl h-20 headerTable uppercase">{t.jsonView.date}</th>
                  <th className="border border-gray-300 p-2 text-xl headerTable uppercase">{t.jsonView.description}</th>
                  <th className="border border-gray-300 p-2 text-xl headerTable uppercase">{t.jsonView.quantity}</th>
                  <th className="border border-gray-300 p-2 text-xl headerTable uppercase">{t.jsonView.unitPrice}</th>
                  <th className="border border-gray-300 p-2 text-xl headerTable uppercase">{t.jsonView.total}</th>
                </tr>
              </thead>
              <tbody>
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.Items
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].Items.map((item, index) => (
                      <tr
                        key={item.ID}
                        className={index % 2 === 0 ? "bg-white" : "bg-primary-100"}
                      >
                        <td className="border border-gray-300 p-2 w-32 text-center text-lg contentTable">
                          {item.Date}
                        </td>
                        <td className="border border-gray-300 p-2 h-20 text-lg contentTable">
                          <div className={`flex flex-col gap-2 ${!item.Description2 ? "justify-center text-left" : "text-left"}`}>
                            <span>{item.Description}</span>
                            {item.Description2 && !item.Description2.startsWith("IN") && <span>{item.Description2}</span>}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right w-20 text-lg contentTable">
                          {item.Qty}
                        </td>
                        <td className="border border-gray-300 p-2 text-right w-32 text-lg contentTable">
                          {isNaN(item.UnitPrice) ? 'N/A' : item.UnitPrice.toFixed(2)}€
                        </td>
                        <td className="border border-gray-300 p-2 text-right w-32 text-lg contentTable">
                          {isNaN(item.Total) ? 'N/A' : item.Total.toFixed(2)}€
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-2">
                        {t.jsonView.noItems}
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-2">
                      {t.errors.loading}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-end w-[80%] mx-auto">
              {reservationData && reservationData.requestBody ? (
                (() => {
                  const parsedData = JSON.parse(reservationData.requestBody);
                  const documentTotals = parsedData[0]?.DocumentTotals;

                  if (Array.isArray(documentTotals) && documentTotals.length > 0) {
                    return documentTotals.map((total, index) => (
                      <div key={index} className="w-full">
                        <p className="mt-4 text-5xl flex font-bold gap-20 justify-end tableTotal text-textPrimaryColor">
                          <span>{t.jsonView.totalBalance}</span>
                          <span>{isNaN(total.Balance) ? 'N/A' : total.Balance.toFixed(2)}€</span>
                        </p>
                      </div>
                    ));
                  } else {
                    return (
                      <div className="w-full">
                        <p className="mt-4 text-5xl flex font-bold gap-20 justify-end text-gray-500">
                          {t.jsonView.noTotalBalance}
                        </p>
                      </div>
                    );
                  }
                })()
              ) : (
                <div className="w-full">
                  <p className="mt-4 text-5xl flex font-bold gap-20 justify-end text-gray-500">
                    {t.jsonView.noTotalBalance}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <table className="w-auto border-collapse mb-4 text-xs ml-[18.5%] vatTable">
              <thead>
                <tr>
                  <th className="p-2 text-left">{t.jsonView.vat}</th>
                  <th className="p-2 text-right">{t.jsonView.gross}</th>
                  <th className="p-2 text-right">{t.jsonView.net}</th>
                  <th className="p-2 text-right">{t.jsonView.tax}</th>
                </tr>
              </thead>
              <tbody>
                {reservationData && reservationData.requestBody ? (
                  (() => {
                    const parsedData = JSON.parse(reservationData.requestBody);
                    const taxes = parsedData[0]?.Taxes;

                    if (Array.isArray(taxes) && taxes.length > 0) {
                      return taxes.map((tax) => (
                        <tr key={tax.ID}>
                          <td className="p-2">{tax.Taxes}%</td>
                          <td className="p-2 text-right">{isNaN(tax.TotalWithTaxes) ? 'N/A' : tax.TotalWithTaxes.toFixed(2)}€</td>
                          <td className="p-2 text-right">{isNaN(tax.TotalWithOutTaxes) ? 'N/A' : tax.TotalWithOutTaxes.toFixed(2)}€</td>
                          <td className="p-2 text-right">{isNaN(tax.TotalTaxes) ? 'N/A' : tax.TotalTaxes.toFixed(2)}€</td>
                        </tr>
                      ));
                    } else {
                      return (
                        <tr>
                          <td colSpan={4} className="p-2 text-center text-gray-500">
                            {t.jsonView.noTax}
                          </td>
                        </tr>
                      );
                    }
                  })()
                ) : (
                  <tr>
                    <td colSpan={4} className="p-2 text-center text-gray-500">
                      {t.errors.loading}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="fixed bottom-0 left-0 w-full shadow-md bg-background text-textPrimaryColor">
            {/* <h4 className='mb-2 font-semibold'>Fiscal Tax</h4> */}
            <div className="flex justify-center w-[65%] mx-auto mb-2 lineContainer">
              <div className="bg-gray-300 h-0.5 w-full"></div>
            </div>
            <div className="flex justify-between items-center mx-auto w-[65%] footerContainer">
              <div className="">
                {reservationData && reservationData.requestBody ? (
                  (() => {
                    // Faz o parse do requestBody uma única vez para evitar parse múltiplo
                    const parsedRequestBody = JSON.parse(reservationData.requestBody);

                    // Verifica se parsedRequestBody é um array e se o primeiro item tem o array de HotelInfo
                    return Array.isArray(parsedRequestBody) &&
                      Array.isArray(parsedRequestBody[0]?.HotelInfo) ? (
                      parsedRequestBody[0].HotelInfo.map((hotelInfo, index) => (
                        <p key={index}>{hotelInfo.HotelName}</p>
                      ))
                    ) : (
                      <p>{t.jsonView.noHotelInformation}</p> // Exibe mensagem caso HotelInfo esteja ausente
                    );
                  })()
                ) : (
                  <p>{t.jsonView.noReservationDetails}</p> // Exibe mensagem caso reservationData ou requestBody estejam ausentes
                )}
              </div>
              {/* Botões de Ação */}
              <div className="flex gap-3">
                <CancelPIN
                  buttonName={t.jsonView.cancel}
                  buttonColor={"transparent"}
                  modalHeader={t.jsonView.insertPin}
                  formTypeModal={11}
                  editor={"teste"}
                />
                <OkPIN
                  buttonName={"OK"}
                  buttonColor={"transparent"}
                  modalHeader={t.jsonView.insertPin}
                  formTypeModal={11}
                  isModalOpen={isModalOpen}  // Passa o estado que controla a visibilidade do modal
                  setIsModalOpen={setIsModalOpen}  // Passa a função para controlar a abertura
                  onClick={handleOkClick}  // Chama handleOkClick para enviar os dados antes de abrir o modal
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>{t.jsonView.noData}</p>
      )
      }
    </main >
  );
};

export default JsonViewPage;
