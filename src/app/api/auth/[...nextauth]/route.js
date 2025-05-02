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
        internal: { label: "Internal", type: "hidden" },
      },
      async authorize(credentials) {
        let user;
        let isInternalUser = false;

        if (credentials.internal === "true") {
          // Login via QR Code (usa internalUser e internalPassword)
          user = await prisma.users.findFirst({
            where: { internalUser: credentials.email },
          });

          if (!user || !(await bcrypt.compare(credentials.password, user.internalPassword))) {
            return null;
          }

          isInternalUser = true;
        } else {
          // Login normal (usa email e password)
          user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            return null;
          }
        }

        // Buscar todos os propertyIDs associados ao usuário
        const userProperties = await prisma.usersProperties.findMany({
          where: { userID: user.userID },
          select: { propertyID: true },
        });

        const propertyIDs = userProperties.map((p) => p.propertyID);

        return {
          id: user.userID,
          email: user.email,
          firstName: user.firstName,
          secondName: user.secondName,
          propertyIDs,
          pin: user.pin,
          permission: user.permissions,
          expirationDate: user.expirationDate,
          isInternalUser, // <- Adicionado aqui
        };
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
        token.propertyIDs = user.propertyIDs;
        token.pin = user.pin;
        token.permission = user.permission;
        token.expirationDate = user.expirationDate;
        token.isInternalUser = user.isInternalUser ?? false; // <- Aqui
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.secondName = token.secondName;
      session.user.propertyIDs = token.propertyIDs;
      session.user.pin = token.pin;
      session.user.permission = token.permission;
      session.user.expirationDate = token.expirationDate;
      session.user.isInternalUser = token.isInternalUser ?? false; // <- Aqui
      return session;
    },
  },
});

export { handler as GET, handler as POST };
