"use client"; // Importante para usar hooks no Next.js

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react"; // Adicionando useEffect
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "./styles.css";
import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession(); // Acessa a sessão do usuário
  const [selectedHotelID, setSelectedHotelID] = useState(""); // Estado do Hotel ID
  console.log(router);
  const locale = "en"; // Substitua pelo valor dinâmico do idioma (e.g., router.locale)
  const t = translations[locale];

  // Recupera o Hotel ID do localStorage ou usa o ID da primeira propriedade do usuário
  useEffect(() => {
    // Tenta obter o ID do hotel do localStorage
    const savedHotelID = localStorage.getItem("selectedHotelID");

    if (savedHotelID) {
      // Se o ID estiver no localStorage, define ele no estado
      setSelectedHotelID(savedHotelID);
    } else if (session?.user?.propertyIDs && session.user.propertyIDs.length > 0) {
      // Caso contrário, usa o primeiro propertyID da sessão do usuário
      setSelectedHotelID(session.user.propertyIDs[0]);
    }
  }, [session]); // Dependência para executar a lógica quando a sessão for carregada

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Após o login bem-sucedido, verifica o ID do hotel
      if (selectedHotelID) {
        // Se o Hotel ID estiver disponível, redireciona para a página do hotel
        router.push(`/homepage/frontOfficeView/${selectedHotelID}`);
      } else {
        // Caso contrário, redireciona para a página inicial
        router.push("/homepage/statements");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Metade esquerda (Conteúdo de login) */}
      <div className="p-8 flex items-center justify-center login-container">
        <div className="flex flex-col items-start w-full md:w-80">
          <div className="hide-on-computer show-on-phone">
            <img src="login/logo_Hits.png" width={180} className="ml-6" />
          </div>
          <p className="mb-[5%]">
            <span className="text-2xl font-semibold text-[#BF6415]">
              Extensions
            </span>{" "}
            myPMS | <span className="font-semibold">{t.auth.login}</span>
          </p>
          <p className="text-sm">{t.auth.instruction1}</p>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 mt-10 mb-5">
              <div>
                <input
                  placeholder={t.auth.email}
                  className="h-10 w-full border border-gray-300 border-b-2 border-b-primary rounded-sm outline-none p-2 text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  placeholder={t.auth.password}
                  className="h-10 w-full border border-gray-300 border-b-2 border-b-primary rounded-sm outline-none p-2 text-sm"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full border border-gray-300 rounded-2xl h-10 text-sm text-gray-500 hover:bg-primary-50"
            >
              {t.auth.login}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="mt-10 flex flex-col gap-4 text-sm text-gray-400">
              <p>{t.auth.instruction2}</p>
              <p>{t.auth.instruction3}</p>
            </div>
          </form>
        </div>
      </div>

      {/* Metade direita (Imagem) */}
      <div className="p-0 relative right-image hide-on-mobile">
        <img
          src="login/cover.jpg"
          alt="Imagem na metade direita"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-100 h-40 footer flex flex-row gap-5 items-center z-10 hide-on-mobile">
        <div>
          <img src="login/logo_Hits.png" width={180} className="ml-6" />
        </div>
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <p>
            Helpdesk Extensions myPMS
            <br />
            <span className="font-semibold text-black">+351 253 60 30 32</span>
            <br />
            {t.auth.footer.callCost}
          </p>
          <p>
            {t.auth.footer.personalizedService}
            <br />
            {t.auth.footer.activeDays}
            <br />
            suporte@hitsnorte.pt
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
