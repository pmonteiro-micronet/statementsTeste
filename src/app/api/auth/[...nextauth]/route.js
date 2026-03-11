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
        if (!credentials?.email || !credentials?.password) return null;

        let user;
        let isInternalUser = false;

        if (credentials.internal === "true") {
          user = await prisma.users.findFirst({
            where: { internalUser: credentials.email },
          });

          if (!user) return null;

          const passwordOk = await bcrypt.compare(
            credentials.password,
            user.internalPassword
          );

          if (!passwordOk) return null;

          isInternalUser = true;
        } else {
          user = await prisma.users.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          const passwordOk = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordOk) return null;
        }

        const userProperties = await prisma.usersProperties.findMany({
          where: { userID: user.userID },
          select: { propertyID: true },
        });

        const userRole = await prisma.user_roles.findMany({
          where: { userID: user.userID },
          select: { roleID: true },
        });

        return {
          id: user.userID,
          email: user.email,
          firstName: user.firstName,
          secondName: user.secondName,
          propertyIDs: userProperties.map((p) => p.propertyID),
          role: userRole.map((r) => r.roleID),
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
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
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

      return token;
    },

    async session({ session, token }) {
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

      return session;
    },
  },
});

export { handler as GET, handler as POST };