import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Buscar o usuário pelo email
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          // Buscar todos os propertyIDs associados ao usuário
          const userProperties = await prisma.usersProperties.findMany({
            where: { userID: user.userID },
            select: { propertyID: true },
          });

          // Extrair apenas os propertyIDs como um array
          const propertyIDs = userProperties.map((p) => p.propertyID);

          // Retornar os dados do usuário com os propertyIDs e permissions
          return {
            id: user.userID,
            email: user.email,
            firstName: user.firstName,
            secondName: user.secondName,
            propertyIDs, // Adicionar os propertyIDs associados
            pin: user.pin,
            permission: user.permissions, // Adicionar o campo `permissions`
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.secondName = user.secondName;
        token.propertyIDs = user.propertyIDs; // Adicionar os propertyIDs ao token
        token.pin = user.pin;
        token.permission = user.permission; // Adicionar o campo permissions ao token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.secondName = token.secondName;
      session.user.propertyIDs = token.propertyIDs; // Adicionar os propertyIDs à sessão
      session.user.pin = token.pin;
      session.user.permission = token.permission; // Adicionar o campo permissions à sessão
      return session;
    },
  },
});

export { handler as GET, handler as POST };
