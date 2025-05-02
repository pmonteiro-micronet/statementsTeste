import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Token no middleware:", token); // 👈 Debug

  const isInternalUser = token?.isInternalUser === true;
  const lockedPath = "/homepage/frontOfficeView/registrationForm";
  const currentPath = req.nextUrl.pathname;
  console.log("isInternalUser"  , isInternalUser);
  // Redireciona usuários internos que tentarem sair da rota permitida
  if (isInternalUser && !currentPath.startsWith(lockedPath)) {
    console.log("Redirecionando usuário interno"); 
    const redirectUrl = new URL(lockedPath, req.url);
    redirectUrl.searchParams.set("alert", "Você é um usuário interno e não pode sair desta página.");
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Aplica o middleware em todas as rotas (exceto rotas internas e públicas)
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|static|images).*)"],
};
