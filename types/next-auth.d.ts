import { DefaultSession, User as AuthUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

type P = PrismaUser;
declare module "next-auth" {
  export interface User extends P {}
  export interface Session {
    user: {
      [Property in keyof P as Exclude<
        Property,
        "password" | "createdAt"
      >]: P[Property];
    };
  }

  export interface AdapterUser extends P {}
}
declare module "next-auth/core" {
  export interface JWT extends Omit<P, "password"> {}
}

declare module "next-auth/jwt" {
  export interface JWT extends Omit<P, "password"> {}
}
declare module "@auth/core/jwt" {
  export interface JWT extends Omit<P, "password"> {}
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends P {}
}
