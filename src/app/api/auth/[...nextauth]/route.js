import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db"; // ajuste o caminho conforme necessário
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          // Aqui retornamos o user com o propertyID
          return {
            id: user.userID,
            email: user.email,
            firstName: user.firstName,
            secondName: user.secondName,
            propertyID: user.propertyID, // Adicione o propertyID ao objeto retornado
            pin: user.pin,
          };
        } else {
          return null; // Retorne null se as credenciais não forem válidas
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth", // Página personalizada de login
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adicione o ID ao token
        token.email = user.email; // Adicione o email ao token
        token.firstName = user.firstName;
        token.secondName = user.secondName;
        token.propertyID = user.propertyID; // Adicione o propertyID ao token
        token.pin = user.pin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Adicione o ID do usuário à sessão
      session.user.email = token.email; // Adicione o email à sessão
      session.user.firstName = token.firstName;
      session.user.secondName = token.secondName;
      session.user.propertyID = token.propertyID; // Adicione o propertyID à sessão
      session.user.pin = token.pin; // Adicione o propertyID à sessão
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
