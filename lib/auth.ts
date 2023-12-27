import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { z } from "zod";
import { use } from "react";
import { createTransport } from "nodemailer";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export const handlers = async function auth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await NextAuth(req, res, {
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
            throw e;
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
        sendVerificationRequest(params) {
          const { identifier, url, provider, theme } = params;

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
    pages: {
      signIn: "/auth/signin",
      error: "/error/auth",
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (credentials) {
          return true;
        }
        if (email?.verificationRequest) {
          //before sending the link to the user
          const searchUrl = new URL(req.url ?? "");
          const status = searchUrl.searchParams.get("status");
          if (status == "signin" && !(await checkUser(user.email!))) {
            return false;
          } else if (status == "signup" && (await checkUser(user.email!))) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      async jwt({ token, user, account }) {
        console.log(user);
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
        session.user.emailVerified = token.emailVerified;
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
};

type LoginFn = (email: string, password: string) => Promise<User>;
type CheckFn = (email: string) => Promise<boolean>;

const login: LoginFn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("found");
  }

  if (!user.password) {
    throw new Error("set");
  }

  console.log(user.password == password);

  if (password == user.password) {
    user.password = "";
    return user;
  } else throw new Error("wrong");
};

const checkUser: CheckFn = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return true;
  } else {
    return false;
  }
};
