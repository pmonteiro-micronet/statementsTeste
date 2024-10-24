"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const JsonViewPage = () => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  const [propertyID, setPropertyID] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      if (status === "loading") return; // Aguarde até que o status da sessão esteja definido

      if (!session) {
        router.push("/login"); // Redireciona para login se o usuário não estiver autenticado
      } else {
        // Pega o propertyID da sessão
        const userPropertyID = session?.user?.propertyID;
        setPropertyID(userPropertyID);
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
    setShowModal(true); // Exibe o modal de senha quando o botão "Ok" é clicado
  };

  const handleCancelClick = () => {
    setShowCancelModal(true); // Exibe o modal de confirmação de cancelamento
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password === "1234") {
      // Verifica a senha
      const recordID = localStorage.getItem("recordID");
      try {
        await axios.patch(`/api/get_jsons/${recordID}`); // Atualiza o status
        router.push("/"); // Redireciona após a atualização
      } catch (error) {
        console.error("Erro ao marcar como visto:", error);
      }
    } else {
      setIsPasswordError(true); // Exibe mensagem de erro se a senha estiver incorreta
    }
  };

  const handleCancelPasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "1234") {
      // Verifica a senha para cancelamento
      router.push("/"); // Redireciona após o cancelamento
    } else {
      setIsPasswordError(true); // Exibe mensagem de erro se a senha estiver incorreta
    }
  };

  if (status === "loading") {
    return <p>Carregando sessão...</p>;
  }

  return (
    <div className="p-4 font-sans bg-white">
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
                {JSON.parse(reservationData.requestBody).Reservation.map(
                  (reservation, index) => (
                    <div key={index}>
                      <p className="font-bold text-3xl text-[#2E615C]">
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
                )}
              </div>

              {/* Detalhes do Hóspede */}
              <div className="flex-1 text-right mr-[10%] mt-4">
                {JSON.parse(reservationData.requestBody).GuestInfo.map(
                  (guest, index) => (
                    <div key={index}>
                      <p className="font-bold">
                        {guest.Salutation}. {guest.FirstName} {guest.LastName}
                      </p>
                      <p>{guest.Street}</p>
                      <p>
                        {guest.PostalCode}, {guest.City}, {guest.Country}
                      </p>
                      <p>NIF: {guest.VatNo}</p>
                    </div>
                  )
                )}
              </div>
            </div>
            {/* <div className="mb-4 flex flex-col justify-center"> */}
            <table className="w-[80%] border-collapse border border-gray-300 mb-4 mx-auto">
              <thead>
                <tr
                  className="text-white"
                  style={{ backgroundColor: "#2E615C" }}
                >
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
                {JSON.parse(reservationData.requestBody).Items.map(
                  (item, index) => (
                    <tr
                      key={item.ID}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#D4F1EE",
                      }}
                    >
                      <td className="border border-gray-300 p-2 w-32 text-center text-lg">
                        {item.Date}
                      </td>

                      <td className="border border-gray-300 p-2 h-20 flex flex-col gap-2 text-lg ">
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
                )}
              </tbody>
            </table>

            <div className="flex justify-end w-[80%] mx-auto">
              {JSON.parse(reservationData.requestBody).DocumentTotals.map(
                (total) => (
                  <div key={total.ID} className="w-full">
                    <p className="mt-4 text-5xl flex font-bold gap-20 justify-end">
                      <span>TOTAL</span>
                      <span>{total.Balance}€</span>
                    </p>
                  </div>
                )
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
                {JSON.parse(reservationData.requestBody).Taxes.map((tax) => (
                  <tr key={tax.ID}>
                    <td className="p-2">{tax.Taxes}%</td>
                    <td className="p-2 text-right">
                      {tax.TotalWithTaxes.toFixed(2)}€
                    </td>
                    <td className="p-2 text-right">
                      {tax.TotalWithOutTaxes.toFixed(2)}€
                    </td>
                    <td className="p-2 text-right">
                      {tax.TotalTaxes.toFixed(2)}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-center text-center">
            <p>nome do hotel</p>
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
              className="bg-[#2E615C] text-white font-semibold p-2 rounded-lg"
              onClick={handleOkClick}
            >
              Ok
            </button>
          </div>

          {/* Modal de Senha */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded shadow-lg">
                <h2 className="text-xl mb-4">Insira a Senha</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsPasswordError(false); // Reseta a mensagem de erro ao digitar
                    }}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Digite a senha"
                  />
                  {isPasswordError && (
                    <p className="text-red-500">
                      Senha incorreta. Tente novamente.
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
                  favor, insira a senha para continuar.
                </p>
                <form onSubmit={handleCancelPasswordSubmit}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsPasswordError(false); // Reseta a mensagem de erro ao digitar
                    }}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Digite a senha"
                  />
                  {isPasswordError && (
                    <p className="text-red-500">
                      Senha incorreta. Tente novamente.
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
    </div>
  );
};

export default JsonViewPage;
