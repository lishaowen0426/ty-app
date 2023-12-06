import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
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
  secret: "gdFpU+5p2zZB0EXdlbNGs6zTD29CRj7JUM00ZzK350U=",
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
      console.log("jwt");
      console.log(user);
      console.log(token);
      console.log(account);
      console.log(profile);
      if (user) {
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log("session");
      console.log(session);
      console.log(token);
      console.log(user);

      return session;
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
