
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db/prisma";
import authConfig from "@/auth/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (!token.sub) return token;
      if (token.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (existingUser) {
          token.id = existingUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        // @ts-expect-error - Adding custom property to session user
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
});