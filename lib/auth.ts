import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import { use } from "react";
import { createTransport } from "nodemailer";

const prisma = new PrismaClient();

interface netInterface {
  address: string;
  family: string;
  cidr: string;
}
const getLAN = () => {
  const { exit } = require("node:process");
  let os = require("os");
  console.log(os.networkInterfaces());
  const en0s = os.networkInterfaces()["en0"] as netInterface[];

  let e: netInterface;
  let addr: string = "";
  for (e of en0s) {
    if (e.family == "IPv4") {
      addr = e.address;
      break;
    }
  }

  if (addr == "") {
    exit(1);
  } else {
    return addr;
  }
};

const LOCALHOST = getLAN();

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
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest(params) {
        const { identifier, url, provider, theme } = params;

        let url_obj = new URL(url);
        url_obj.hostname = LOCALHOST as string;

        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport({
          ...provider.server,
          secure: false,
        });
        transport.verify((error, success) => {
          if (error) {
            console.log("SMTP connection failed with " + error);
          }
        });
        const result = transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `登陆到Distance`,
          text: url_obj.toString(),
        });
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
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      if (email?.verificationRequest) {
        //before we send an email to the user
        // you can check whether the user is allowed to signin/registration
        //now, we do nothing
        return true;
      } else {
        //user clicked the link
        return "/home/profile";
      }
    },
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
