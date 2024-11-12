"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs"; // Importa bcryptjs

const JsonViewPage = () => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pin, setPin] = useState(""); // Estado para o pin
  const [isPinError, setIsPinError] = useState(false);
  const [userPinHash, setUserPinHash] = useState(""); // Estado para o hash do pin do usuário logado
  const router = useRouter();

  const { data: session, status } = useSession();
  const [propertyID, setPropertyID] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      if (status === "loading") return;

      if (!session) {
        router.push("/login");
      } else {
        // Pega o propertyID e o pin do usuário da sessão
        const userPropertyID = session?.user?.propertyID;
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

  const handleOkClick = () => {
    setShowModal(true);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    const recordID = localStorage.getItem("recordID");

    try {
      // Verifica o pin do usuário logado com bcrypt
      const isPinCorrect = await bcrypt.compare(pin, userPinHash); // Verifica o pin inserido com o hash armazenado

      if (isPinCorrect) {
        await axios.patch(`/api/get_jsons/${recordID}`); // Atualiza o status
        router.push("/");
      } else {
        setIsPinError(true);
      }
    } catch (error) {
      console.error("Erro ao marcar como visto:", error);
    }
  };

  // const handleCancelPasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   const recordID = localStorage.getItem("recordID");

  //   try {
  //     // Verifica o pin para cancelamento
  //     const isPinCorrect = await bcrypt.compare(pin, userPinHash);

  //     if (isPinCorrect) {
  //       // Adicione aqui a lógica para cancelar
  //       router.push("/"); // Redireciona após o cancelamento
  //     } else {
  //       setIsPinError(true);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao cancelar:", error);
  //   }
  // };

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  return (
    <main className="flex flex-col flex-grow h-full p-0 m-0 overflow-x-hidden">
      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reservationData ? (
        <>
          <div className="mb-4 w-screen">
            <img
              src={`/logos/${propertyID}.png`}
              alt="Property Image"
              className="mx-auto"
            />
          </div>

          <div className="flex flex-col justify-center items-center w-[80%] mx-auto mt-4">
            <div className="flex justify-between w-full mb-10">
              {/* Detalhes da Reserva */}
              <div className="flex-1 text-left ml-[10%]">
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.Reservation
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].Reservation.map(
                      (reservation, index) => (
                        <div key={index}>
                          <p className="font-bold text-3xl text-primary">
                            Room:{" "}
                            <span className="font-bold">
                              {reservation.RoomNumber}
                            </span>
                          </p>
                          <p>
                            Reservation Number:{" "}
                            <span className="font-bold">
                              {reservation.ReservationNumber}
                            </span>
                          </p>
                          <p>
                            Check-In:{" "}
                            <span className="font-bold ml-6">
                              {new Date(reservation.DateCI).toLocaleDateString()}
                            </span>
                          </p>
                          <p>
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
              <div className="flex-1 text-right mr-[10%] mt-4">
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.GuestInfo
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].GuestInfo.map(
                      (guest, index) => (
                        <div key={index}>
                          <p className="font-bold">
                            {guest.Salution} {guest.FirstName} {guest.LastName}
                          </p>
                          <p>{guest.Street}</p>
                          <p>
                            {guest.PostalCode}, {guest.City}, {guest.Country}
                          </p>
                          <p>NIF: {guest.VatNo}</p>
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
            <table className="w-[80%] border-collapse border border-gray-300 mb-4 mx-auto">
              <thead>
                <tr className="text-white bg-primary">
                  <th className="border border-gray-300 p-2 text-xl h-20">
                    DATE
                  </th>
                  <th className="border border-gray-300 p-2  text-xl">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-300 p-2 text-xl">QTY</th>
                  <th className="border border-gray-300 p-2 text-xl">
                    UNIT PRICE
                  </th>
                  <th className="border border-gray-300 p-2 text-xl">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {reservationData && reservationData.requestBody ? (
                  Array.isArray(
                    JSON.parse(reservationData.requestBody)[0]?.Items
                  ) ? (
                    JSON.parse(reservationData.requestBody)[0].Items.map(
                      (item, index) => (
                        <tr
                          key={item.ID}
                          className={index % 2 === 0 ? "bg-white" : "bg-primary-100"}
                        >
                          <td className="border border-gray-300 p-2 w-32 text-center text-lg">
                            {item.Date}
                          </td>
                          <td className="border border-gray-300 p-2 h-20 flex flex-col gap-2 text-lg">
                            <span>{item.Description}</span>
                            <span>{item.Description2}</span>
                          </td>
                          <td className="border border-gray-300 p-2 text-right w-20 text-lg">
                            {item.Qty}
                          </td>
                          <td className="border border-gray-300 p-2 text-right w-32 text-lg">
                            €{item.UnitPrice.toFixed(2)}
                          </td>
                          <td className="border border-gray-300 p-2 text-right w-32 text-lg">
                            €{item.Total.toFixed(2)}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-2">
                        No items found.
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-2">
                      Loading reservation data...
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
                    return documentTotals.map((total) => (
                      <div key={total.ID} className="w-full">
                        <p className="mt-4 text-5xl flex font-bold gap-20 justify-end">
                          <span>TOTAL</span>
                          <span>{total.Balance}€</span>
                        </p>
                      </div>
                    ));
                  } else {
                    return (
                      <div className="w-full">
                        <p className="mt-4 text-5xl flex font-bold gap-20 justify-end text-gray-500">
                          Nenhum total disponível.
                        </p>
                      </div>
                    );
                  }
                })()
              ) : (
                <div className="w-full">
                  <p className="mt-4 text-5xl flex font-bold gap-20 justify-end text-gray-500">
                    Nenhum total disponível.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* </div> */}

          <div className="mb-4 mt-20">
            {/* <h4 className='mb-2 font-semibold'>Fiscal Tax</h4> */}
            <div className="flex justify-center w-[65%] mx-auto">
              <div className="bg-gray-300 h-0.5 w-full"></div>
            </div>
            <table className="w-auto border-collapse mb-4 text-xs ml-[17%]">
              {" "}
              {/* Mantém a margem alinhada à esquerda */}
              <thead>
                <tr>
                  <th className="p-2 text-left">VAT</th>
                  <th className="p-2 text-right">Gross</th>
                  <th className="p-2 text-right">Net</th>
                  <th className="p-2 text-right">Tax</th>
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
                          <td className="p-2 text-right">{tax.TotalWithTaxes.toFixed(2)}€</td>
                          <td className="p-2 text-right">{tax.TotalWithOutTaxes.toFixed(2)}€</td>
                          <td className="p-2 text-right">{tax.TotalTaxes.toFixed(2)}€</td>
                        </tr>
                      ));
                    } else {
                      return (
                        <tr>
                          <td colSpan={4} className="p-2 text-center text-gray-500">
                            Nenhum imposto disponível.
                          </td>
                        </tr>
                      );
                    }
                  })()
                ) : (
                  <tr>
                    <td colSpan={4} className="p-2 text-center text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-center text-center">
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
          <div className="flex gap-4 justify-end mt-4 mr-[17%]">
            <button
              className="bg-gray-300 font-semibold p-2 rounded-lg"
              onClick={handleCancelClick}
            >
              {" "}
              {/* Modificado para chamar o novo método */}
              Cancel
            </button>
            <button
              className="bg-primary text-white font-semibold p-2 rounded-lg"
              onClick={handleOkClick}
            >
              Ok
            </button>
          </div>

          {/* Modal de PIN */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-lg">
                <h2 className="text-xl mb-4">Insira o PIN</h2>
                <form onSubmit={handlePinSubmit}>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setIsPinError(false); // Reseta a mensagem de erro ao digitar
                    }}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Digite o PIN"
                  />
                  {isPinError && (
                    <p className="text-red-500">
                      PIN incorreto. Tente novamente.
                    </p>
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mr-2 bg-gray-300 p-2 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2E615C] text-white p-2 rounded"
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Cancelamento */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-lg">
                <h2 className="text-xl mb-4">Cancelamento</h2>
                <p className="mb-4">
                  Esta ação não irá guardar nenhuma informação.<br></br>Por
                  favor, insira o PIN para continuar.
                </p>
                <form onSubmit={handleCancelPinSubmit}>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setIsPinError(false); // Reseta a mensagem de erro ao digitar
                    }}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Digite o PIN"
                  />
                  {isPinError && (
                    <p className="text-red-500">
                      PIN incorreto. Tente novamente.
                    </p>
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="mr-2 bg-gray-300 p-2 rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#2E615C] text-white p-2 rounded"
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </main>
  );
};

export default JsonViewPage;
