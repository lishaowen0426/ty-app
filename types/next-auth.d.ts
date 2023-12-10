import { DefaultSession, User as AuthUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  type P = Omit<PrismaUser, "id">;
  export interface User extends P {}
  export interface Session {
    user: { [Property in keyof P]: P[Property] };
  }
}

declare module "next-auth/jwt" {
  type P = Omit<PrismaUser, "id">;
  export interface JWT extends P {}
}
declare module "@auth/core/jwt" {
  type P = Omit<PrismaUser, "id">;
  export interface JWT extends P {}
}
