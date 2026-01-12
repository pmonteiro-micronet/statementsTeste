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
        console.log("🔐 AUTHORIZE");
        console.log("credentials:", {
          email: credentials?.email,
          internal: credentials?.internal,
        });

        let user;
        let isInternalUser = false;

        if (credentials.internal === "true") {
          console.log("➡️ Login INTERNAL");

          user = await prisma.users.findFirst({
            where: { internalUser: credentials.email },
          });

          if (!user) {
            console.log("❌ Internal user não encontrado");
            return null;
          }

          const passwordOk = await bcrypt.compare(
            credentials.password,
            user.internalPassword
          );

          console.log("Password OK?", passwordOk);

          if (!passwordOk) return null;

          isInternalUser = true;
        } else {
          console.log("➡️ Login NORMAL");

          user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.log("❌ User não encontrado");
            return null;
          }

          const passwordOk = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password OK?", passwordOk);

          if (!passwordOk) return null;
        }

        console.log("✅ User autenticado:", {
          id: user.userID,
          email: user.email,
          isInternalUser,
        });

        const userProperties = await prisma.usersProperties.findMany({
          where: { userID: user.userID },
          select: { propertyID: true },
        });

        const userRole = await prisma.user_roles.findMany({
          where: { userID: user.userID },
          select: { roleID: true },
        });

        const propertyIDs = userProperties.map((p) => p.propertyID);
        const role = userRole.map((r) => r.roleID);

        return {
          id: user.userID,
          email: user.email,
          firstName: user.firstName,
          secondName: user.secondName,
          propertyIDs,
          role,
          pin: user.pin,
          permission: user.permissions,
          expirationDate: user.expirationDate,
          isInternalUser,
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
      console.log("🪙 JWT CALLBACK");
      console.log("Token ANTES:", token);
      console.log("User:", user);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.secondName = user.secondName;
        token.propertyIDs = user.propertyIDs;
        token.role = user.role;
        token.pin = user.pin;
        token.permission = user.permission;
        token.expirationDate = user.expirationDate;
        token.isInternalUser = user.isInternalUser ?? false;
      }

      console.log("Token DEPOIS:", token);

      return token;
    },
    async session({ session, token }) {
      console.log("🧠 SESSION CALLBACK");
      console.log("Token:", token);
      console.log("Session ANTES:", session);

      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.secondName = token.secondName;
      session.user.propertyIDs = token.propertyIDs;
      session.user.role = token.role;
      session.user.pin = token.pin;
      session.user.permission = token.permission;
      session.user.expirationDate = token.expirationDate;
      session.user.isInternalUser = token.isInternalUser ?? false;

      console.log("Session DEPOIS:", session);

      return session;
    },
  },
});

export { handler as GET, handler as POST };
