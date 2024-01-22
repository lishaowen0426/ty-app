import { DefaultSession, User as AuthUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

type P = PrismaUser;
type PP = {
  [Property in keyof P as Exclude<Property, "createdAt">]: Property extends PW
    ? boolean
    : P[Property];
};

type PW = "password";
declare module "next-auth" {
  export interface User extends P {}
  export interface Session {
    user: PP;
  }

  export interface AdapterUser extends P {}
}

declare module "next-auth/jwt" {
  export interface JWT extends PP {}
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends P {}
}
