import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }
        try {
          const user = await login(credentials?.phone, credentials.password);
          return user;
        } catch (e) {
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
});

const prisma = new PrismaClient();

type LoginFn = (phone: string, password: string) => Promise<User>;

const login: LoginFn = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      phone: phone,
    },
  });

  if (user && (await compare(password, user.password))) {
    user.password = "";
    return user;
  } else throw new Error("User not found");
};
