"use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";

const QrCodeUser = () => {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  // const email = searchParams.get("email");
  // const resNo = searchParams.get("resNo");
  // const propertyID = searchParams.get("propertyID");
  // const requestID = searchParams.get("requestID");
  // const profileID = searchParams.get("profileID");

  // const handleAdvance = () => {
  //   const queryParams = new URLSearchParams({
  //     propertyID,
  //     requestID,
  //     resNo,
  //     profileID,
  //   }).toString();

  //   router.push(`/homepage/frontOfficeView/registrationForm?${queryParams}`);
  // };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //   <h1 className="text-2xl font-bold mb-4">Confirmação de Usuário</h1>
    //   <p>Email: <span className="font-semibold">{email}</span></p>
    //   <p>Reserva Nº: <span className="font-semibold">{resNo}</span></p>

    //   <div className="flex gap-4 mt-6">
    //     <button
    //       onClick={handleAdvance}
    //       className="px-4 py-2 bg-blue-200 text-white rounded hover:bg-green-600"
    //     >
    //       Avançar
    //     </button>
    //     <button
    //       onClick={() => signOut({ callbackUrl: "/" })}
    //       className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    //     >
    //       Sair
    //     </button>
    //   </div>
    // </div>
    <div>
      Ola
    </div>
  );
};

export default QrCodeUser;