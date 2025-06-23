"use client"; // Importante para usar hooks no Next.js

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Html5QrcodeScanner } from "html5-qrcode"; // Biblioteca de leitura de QR Code
import "./styles.css";
import en from "../../../public/locales/english/common.json";
import pt from "../../../public/locales/portuguesPortugal/common.json";
import es from "../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

import CryptoJS from "crypto-js";

import { FaRegEye, FaEyeSlash } from "react-icons/fa";


// Função para descriptografar os dados
const decryptData = (encryptedText) => {
  try {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

    // Descriptografando os dados
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);

    // Verificando se a descriptografia retornou um resultado válido
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      throw new Error("Falha na descriptografia, dados inválidos.");
    }

    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Erro ao tentar descriptografar:", error.message);
    return null; // ou você pode retornar um valor padrão ou tratar o erro de outra forma
  }
};


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false); // Estado para controlar o scanner
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedHotelID, setSelectedHotelID] = useState("");

  const [isQrLogin, setIsQrLogin] = useState(false);

  const locale = "en"; // Substitua pelo valor dinâmico do idioma (e.g., router.locale)
  const t = translations[locale];
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);

  useEffect(() => {
    const savedHotelID = localStorage.getItem("selectedHotelID");

    if (savedHotelID) {
      setSelectedHotelID(savedHotelID);
    } else if (session?.user?.propertyIDs && session.user.propertyIDs.length > 0) {
      setSelectedHotelID(session.user.propertyIDs[0]);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      internal: isQrLogin,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      if (isQrLogin) {
        const qrLoginUrl = document.getElementById("loginButton").getAttribute("data-url");
        router.push(qrLoginUrl);
      } else if (selectedHotelID) {
        router.push(`/homepage/frontOfficeView/${selectedHotelID}`);
      } else {
        router.push("/homepage/statements");
      }
    }
  };

  // Função para ativar a leitura do QR Code
  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

      scanner.render(async (decodedText) => {
        try {
          // Descriptografando os dados do QR Code
          const decryptedData = decryptData(decodedText);

          if (
            decryptedData?.email &&
            decryptedData?.password &&
            decryptedData?.propertyID &&
            decryptedData?.requestID &&
            decryptedData?.resNo &&
            decryptedData?.profileID
          ) {
            // Atualiza o estado com os dados extraídos do QR Code
            setEmail(decryptedData.email);
            setPassword(decryptedData.password);
            setIsQrLogin(true);  // Marca que estamos fazendo login via QR Code

            // Realiza o login automaticamente
            const result = await signIn("credentials", {
              redirect: false,
              email: decryptedData.email,
              password: decryptedData.password,
              internal: true,  // Marca o login como interno
            });

            if (result?.error) {
              setError(result.error);
            } else {
              // Armazena os dados no sessionStorage
              sessionStorage.setItem("qrUserData", JSON.stringify({
                email: decryptedData.email,
                resNo: decryptedData.resNo,
                propertyID: decryptedData.propertyID,
                requestID: decryptedData.requestID,
                profileID: decryptedData.profileID,
              }));

              setScanning(false);
              scanner.clear();

              // Redireciona sem parâmetros
              router.push("/qrcode_user");
            }
          }
        } catch (error) {
          console.error("Erro ao processar QR Code", error);
        }
      });

      return () => scanner.clear();
    }
  }, [scanning]);  // Dependência do estado `scanning`  

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-500 via-black to-black flex justify-center items-center">
      <div className="w-[23rem] bg-white rounded-3xl p-4">
        <div className="flex flex-col mt-4 gap-4">
          <div className="font-bold text-2xl flex justify-center">
            extensions
          </div>
          <div className="flex justify-center">
            <img src="/icon/extensions_logo.png" alt="logo" width={40}/>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-700 flex flex-col gap-2 justify-center items-center">
          <div>{t.auth.instruction0}</div>
          <div>{t.auth.instruction1}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input
              type="email"
              placeholder={t.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black w-full rounded-lg p-2 outline-none"
            />
          </div>

          {!showPassword && (
            <div
              className="w-full rounded-lg bg-primary text-white flex justify-center mt-4 p-2 cursor-pointer"
              onClick={() => {
                if (email.trim()) {
                  setShowPassword(true);
                }
              }}
            >
              {t.auth.continue}
            </div>
          )}

          {showPassword && (
            <>
              <div className="mt-4 relative">
                <input
                  type={showPasswordText ? "text" : "password"}
                  placeholder={t.auth.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-black w-full rounded-lg p-2 outline-none pr-10"
                />
                <div
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                >
                  {showPasswordText ? <FaEyeSlash /> : <FaRegEye />}
                </div>
              </div>
              <div className="mt-4 flex justify-center text-xs text-gray-500">
                <p>{t.auth.instruction2}</p>
              </div>
              <button
                id="loginButton"
                type="submit"
                className="w-full rounded-lg bg-primary text-white flex justify-center mt-4 p-2"
              >
                {t.auth.login}
              </button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </>
          )}
        </form>
      </div>
      {/* Metade esquerda (Conteúdo de login)
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
              id="loginButton"
              type="submit"
              className="w-full border border-gray-300 rounded-2xl h-10 text-sm text-gray-500 hover:bg-primary-50"
            >
              {t.auth.login}
            </button> */}

      {/* <button
              type="button"
              className="w-full mt-2 border border-gray-300 rounded-2xl h-10 text-sm text-gray-500 hover:bg-primary-50"
              onClick={() => setScanning(true)}
            >
              Entrar com QR Code
            </button>

            {scanning && <div id="reader" className="mt-4"></div>} */}

      {/* {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="mt-10 flex flex-col gap-4 text-sm text-gray-400">
              <p>{t.auth.instruction2}</p>
              <p>{t.auth.instruction3}</p>
            </div>
          </form>
        </div>
      </div> */}

      {/* Metade direita (Imagem) */}
      {/* <div className="p-0 relative right-image hide-on-mobile">
        <img
          src="login/cover.jpg"
          alt="Imagem na metade direita"
          className="w-full h-full object-cover"
        />
      </div> */}

      {/* Footer */}
      {/* <div className="bg-gray-100 h-40 footer flex flex-row gap-5 items-center z-10 hide-on-mobile">
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
      </div> */}
    </div>
  );
};

export default SignIn;
