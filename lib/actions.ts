"use server";
import type { SignUpValues, LoginValues } from "@/components/ui/LoginForm";
import { reverificationMsg } from "@/components/ui/LoginForm";
import { JWTPayload } from "./auth";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma, redis } from "./db";
import SHA256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { createTransport } from "nodemailer";
import { randomBytes } from "crypto";

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

const host = (process.env.VERCEL_URL ?? process.env.NEXTAUTH_URL)!;

const nodeMailerOpt = {
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PASSWORD,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

const transporter = createTransport(nodeMailerOpt);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  }
});
const sendEmailVerification = (user: JWTPayload, token: string) => {
  transporter.sendMail({
    to: user.email,
    from: process.env.EMAIL_FROM,
    subject: "登陆到Distance",
    text: `${host}/api/register/verify?email=${user.email}&&token=${token}`,
  });
};

const createJWSAndCookie = async (payload: JWTPayload, expireAt: Date) => {
  const jws = await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt() //now
    .setExpirationTime(expireAt)
    .sign(encodedKey);

  cookies().set("session", jws, {
    sameSite: true,
    expires: expireAt,
    path: "/",
  });
};

const verifyJWS = async (jws: string | Uint8Array | undefined = "") => {
  const { payload } = await jwtVerify(jws, encodedKey, {
    algorithms: ["HS256"],
  });
  return payload;
};

//return the dest to direct the user to
// or throw an error
export async function login(data: LoginValues) {
  let user: (JWTPayload & { emailVerified: boolean }) | null = null;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: data.email,
        password: SHA256(data.password).toString(Hex),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        emailVerified: true,
      },
    });
  } catch (e) {
    throw new Error("服务器内部错误");
  }

  if (!user) {
    throw new Error("用户不存在");
  } else if (!user.emailVerified) {
    throw new Error("请先对邮箱进行验证");
  }

  const { emailVerified, ...userPayload } = user;

  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 days
  await createJWSAndCookie(userPayload, expiresAt);
  redirect("/topics");

  //generate JWS
}
export async function signup(data: SignUpValues) {
  let user: (JWTPayload & { emailVerified: boolean }) | null = null;
  try {
    user = await prisma.user.create({
      data: {
        email: data.email,
        password: SHA256(data.password).toString(Hex),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        emailVerified: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new Error("用户已存在");
      }
    }
    throw new Error("服务器内部错误");
  }

  const { emailVerified, ...userPayload } = user;

  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 days
  await createJWSAndCookie(userPayload, expiresAt);
  sendEmailVerification(userPayload, randomBytes(48).toString("hex"));

  redirect("/started/email/sent");
}
