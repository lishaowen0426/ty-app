import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import { use } from "react";

const prisma = new PrismaClient();

export const handlers = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const Cred = z.object({
          email: z.string(),
          password: z.string(),
        });

        try {
          const u = Cred.parse(credentials);
          const user = await login(u.email, u.password);
          return user;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
    }),
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url, expires }) {},
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user.email = token.email ?? "";
      session.user.id = token.id;
      session.user.emailVerified = token.emailVerified;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs

      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
});

type LoginFn = (email: string, password: string) => Promise<User>;

const login: LoginFn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user && password == user.password) {
    user.password = "";
    return user;
  } else throw new Error("User not found");
};
