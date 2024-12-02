// src/app/auth/signin.js
"use client"; // Importante para usar hooks no Next.js

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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
      // Redireciona após o login bem-sucedido
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Metade esquerda (Conteúdo de login) */}
      <div className="p-8 flex items-center justify-center login-container">
        <div className="flex flex-col items-start w-full md:w-80">
          <p className="mb-[5%]">
            <span className="text-2xl font-semibold text-[#BF6415]">
              Extensions
            </span>{" "}
            myPMS | <span className="font-semibold">Login</span>
          </p>
          <p className="text-sm">
            Para entrar no Extensions myPMS, introduza o<br /> seu E-mail de
            utilizador e código de acesso.
          </p>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 mt-10 mb-5">
              <div>
                <input
                  placeholder="Email de Utilizador"
                  className="h-10 w-full border border-gray-300 border-b-2 border-b-[#13678A] rounded-sm outline-none p-2 text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  placeholder="Código de Acesso"
                  className="h-10 w-full border border-gray-300 border-b-2 border-b-[#13678A] rounded-sm outline-none p-2 text-sm"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full border border-gray-300 rounded-2xl h-10 text-sm text-gray-500"
            >
              Entrar
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="mt-10 flex flex-col gap-4 text-sm text-gray-400">
              <p>
                Esqueceu-se do E-mail de utilizador ou do código de
                <br /> acesso?
              </p>
              <p>
                Já sou cliente mas não tenho acesso.
                <br /> Como aderir ao Extensions myPMS?
              </p>
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
      <div className="bg-gray-100 h-40 footer flex flex-row gap-5 items-center z-10">
        <div>
          <img src="login/logo_Hits.png" width={180} className="ml-6" />
        </div>
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <p>
            Helpdesk Extensions myPMS
            <br />
            <span className="font-semibold text-black">+351 253 60 30 32</span>
            <br />
            (Custo de chamada para a rede fixa nacional)
          </p>
          <p>
            Atendimento personalizado
            <br />
            Dias úteis, das 9h30 às 18h30.
            <br />
            suporte@hitsnorte.pt
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
