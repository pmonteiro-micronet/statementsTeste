// src/app/page.js
import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona para a página desejada
  redirect("/homepage/statements");
}
