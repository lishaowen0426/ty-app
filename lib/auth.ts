import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

export const handlers = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("cred");
        console.log(credentials);
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const Cred = z.object({
          phone: z.string(),
          password: z.string(),
        });

        try {
          const u = Cred.parse(credentials);
          const user = await login(u.phone, u.password);
          return user;
        } catch (e) {
          console.log(e);
          return null;
        }
      },
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
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.password = user.password;
        token.phone = user.phone;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token, user }) {
      session.user.email = token.email ?? "";
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.password = token.password;
      session.user.phone = token.phone;
      session.user.role = token.role;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      console.log("url");
      console.log(url);
      console.log(baseUrl);
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
});

const prisma = new PrismaClient();

type LoginFn = (phone: string, password: string) => Promise<User>;

const login: LoginFn = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      phone: phone,
    },
  });

  if (user && password == user.password) {
    user.password = "";
    return {
      ...user,
      id: user.id.toString(),
    };
  } else throw new Error("User not found");
};
