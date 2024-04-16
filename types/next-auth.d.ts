import { DefaultSession, User as AuthUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

export type UserKept = "id" | "email" | "name" | "avatar";
type PP = {
  [Property in keyof Pick<PrismaUser, UserKept>]: PrismaUser[Property];
};

declare module "next-auth" {
  export interface User extends PP {}
  export interface Session {
    user: PP;
  }
}

declare module "next-auth/jwt" {
  export interface JWT extends PP {}
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends PP {}
}
