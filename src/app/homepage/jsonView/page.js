"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OkPIN from "@/components/modals/pin/ok/page";  // Importação do modal OkPIN
import CancelPIN from "@/components/modals/pin/cancel/page";  // Importação do modal CancelPIN
import "./styles.css";

const JsonViewPage = () => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userPinHash, setUserPinHash] = useState(""); // Estado para o hash do pin do usuário logado
  const router = useRouter();
  const [imageExists, setImageExists] = useState(false);

  const { data: session, status } = useSession();
  const [propertyID, setPropertyID] = useState("");

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
    const recordID = localStorage.getItem("recordID");

    if (recordID && propertyID) {
      const fetchReservation = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/get_jsons/${recordID}`);
          setReservationData(response.data.response[0]);
        } catch (error) {
          setError("Erro ao carregar os dados.", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReservation();
    }
  }, [propertyID]);

  useEffect(() => {
    // Verifica se a imagem existe
    const checkImage = async () => {
      try {
        const res = await fetch(`/logos/${propertyID}.png`);
        if (res.ok) {
          setImageExists(true);
        } else {
          setImageExists(false);
        }
      } catch (error) {
        setImageExists(false);
        console.log(error);
      }
    };

    checkImage();
  }, [propertyID]);

  const handleOkClick = () => {
    setShowModal(true);
  };

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  return (
    <main className="overflow-y-auto pb-10 bodyContainer">
      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservationData ? (
        <>
          {imageExists && (
            <div className="mb-4 w-screen">
              <img
                src={`/logos/${propertyID}.png`}
                alt="Property Image"
                className="mx-auto"
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
                        <div key={index}>
                          <p className="font-bold text-3xl text-primary roomInfo">
                            Room:{" "}
                            <span className="font-bold">
                              {reservation.RoomNumber}
                            </span>
                          </p>
                          <p className="textInfo">
                            Reservation Number:{" "}
                            <span className="font-bold">
                              {reservation.ReservationNumber}
                            </span>
                          </p>
                          <p className="textInfo">
                            Check-In:{" "}
                            <span className="font-bold ml-6">
                              {new Date(reservation.DateCI).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="textInfo">
                            Check-Out:{" "}
                            <span className="font-bold ml-3">
                              {new Date(reservation.DateCO).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p>No reservation details available</p>
                  )
                ) : (
                  <p>Loading reservation data...</p>
                )}
              </div>

              {/* Detalhes do Hóspede */}
              <div className="text-left mt-4">
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.GuestInfo
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].GuestInfo.map(
                      (guest, index) => (
                        <div key={index}>
                          <p className="font-bold textInfo">
                            {guest.Salution} {guest.FirstName} {guest.LastName}
                          </p>
                          <p className="textInfo">{guest.Street}</p>
                          <p className="textInfo">
                            {guest.PostalCode}, {guest.City}, {guest.Country}
                          </p>
                          <p className="textInfo">NIF: {guest.VatNo}</p>
                        </div>
                      )
                    )
                  ) : (
                    <p>No guest information available</p>
                  )
                ) : (
                  <p>Loading guest information...</p>
                )}
              </div>
            </div>

            {/* Tabela de Itens */}
            <table className="w-[80%] border-collapse border border-gray-300 mb-4 mx-auto containerTable">
              <thead>
                <tr className="text-white bg-primary">
                  <th className="border border-gray-300 p-2 text-xl h-20 headerTable">
                    DATE
                  </th>
                  <th className="border border-gray-300 p-2 text-xl headerTable">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-300 p-2 text-xl headerTable">QTY</th>
                  <th className="border border-gray-300 p-2 text-xl headerTable">
                    UNIT PRICE
                  </th>
                  <th className="border border-gray-300 p-2 text-xl headerTable">TOTAL</th>
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
                            {item.Description2 && <span>{item.Description2}</span>}
                          </div>
                        </td>

                        <td className="border border-gray-300 p-2 text-right w-20 text-lg contentTable">
                          {item.Qty}
                        </td>
                        <td className="border border-gray-300 p-2 text-right w-32 text-lg contentTable">
                          {item.UnitPrice !== undefined && item.UnitPrice !== null
                            ? item.UnitPrice.toFixed(2)
                            : 'N/A'}€
                        </td>
                        <td className="border border-gray-300 p-2 text-right w-32 text-lg contentTable">
                          {item.Total !== undefined && item.Total !== null
                            ? item.Total.toFixed(2)
                            : 'N/A'}€
                        </td>
                      </tr>
                    ))
                  ) : (
                    <p>No items available</p>
                  )
                ) : (
                  <p>Loading item data...</p>
                )}
              </tbody>
            </table>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-md">
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
                      <p>Hotel information not available</p> // Exibe mensagem caso HotelInfo esteja ausente
                    );
                  })()
                ) : (
                  <p>No reservation data available</p> // Exibe mensagem caso reservationData ou requestBody estejam ausentes
                )}
              </div>
              {/* Botões de Ação */}
              <div className="flex gap-3">
                <CancelPIN
                  buttonName={"Cancel"}
                  buttonColor={"transparent"}
                  modalHeader={"Insert PIN"}
                  formTypeModal={11}
                  editor={"teste"}
                />
                <button
                  className="bg-primary text-white font-semibold rounded-lg mb-3"
                  onClick={handleOkClick}
                >
                  <OkPIN
                    buttonName={"Ok"}
                    buttonColor={"transparent"}
                    modalHeader={"Insert PIN"}
                    formTypeModal={11}
                    editor={"teste"}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </main>
  );
};

export default JsonViewPage;
