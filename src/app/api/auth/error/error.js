// src/app/auth/error.js
"use client"; // Importante para usar hooks no Next.js

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redireciona após alguns segundos ou faz outra lógica
    const timeout = setTimeout(() => {
      router.push("/auth"); // Redireciona para a página de login
    }, 3000); // Redireciona após 3 segundos

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Erro de Autenticação</h1>
      <p>Por favor, tente fazer login novamente.</p>
    </div>
  );
};

export default ErrorPage;
