import { User } from "next-auth";
import { UserKept } from "@/types/next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import { createTransport } from "nodemailer";
import prisma from "@/lib/prisma";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import * as ErrMsg from "@/lib/errmsg";
import { NextRequest } from "next/server";

export const handlers = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (credentials == undefined) {
          throw new Error(ErrMsg.INVALIDREQUEST);
        } else {
          return await login(credentials.email, credentials.password);
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
      normalizeIdentifier(identifier: string): string {
        // Get the first two elements only,
        // separated by `@` from user input.
        let [local, domain] = identifier.toLowerCase().trim().split("@");
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        domain = domain.split(",")[0];
        return `${local}@${domain}`;

        // You can also throw an error, which will redirect the user
        // to the error page with error=EmailSignin in the URL
        // if (identifier.split("@").length > 2) {
        //   throw new Error("Only one email allowed")
        // }
      },
      async sendVerificationRequest(params) {
        const { identifier, url, provider, theme } = params;
        console.log(url);
        const exist = await prisma.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            email: true,
            id: true,
          },
        });
        if (exist) {
          throw new Error(ErrMsg.USEREXISTS);
        }

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
        transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `登陆到Distance`,
          text: url,
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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
        token.avatar = user.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email ?? "";
      session.user.id = token.id;
      session.user.avatar = token.avatar;
      session.user.name = token.name ?? "";

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs

      if (url.startsWith("/")) url = `${baseUrl}${url}`;

      let url_obj = new URL(url);
      let base_obj = new URL(baseUrl);

      if (url_obj.origin == base_obj.origin) {
        return url_obj.toString();
      }

      return base_obj.toString();
    },
  },
});

type LoginFn = (email: string, password: string) => Promise<User | null>;

const login: LoginFn = async (email: string, password: string) => {
  const toSeletct = {
    id: true,
    email: true,
    name: true,
    avatar: true,
  } satisfies Record<UserKept, boolean>;
  let user: User | null = null;
  try {
    user = await prisma.user.findUnique({
      where: {
        email,
        password: SHA256(password).toString(Hex),
      },
      select: toSeletct,
    });
  } catch (e) {
    throw new Error(ErrMsg.INTERNALERROR);
  }
  if (!user) {
    throw new Error("用户不存在或密码错误");
  } else {
    return user;
  }
};
