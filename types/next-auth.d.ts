import { DefaultSession, User as AuthUser } from "next-auth";
import { User as PrismaUser } from "@prisma/client";

type P = PrismaUser;
declare module "next-auth" {
  export interface User extends P {}
  export interface Session {
    user: { [Property in keyof P]: P[Property] };
  }

  export interface AdapterUser extends P {}
}

declare module "next-auth/jwt" {
  export interface JWT extends P {}
}
declare module "@auth/core/jwt" {
  export interface JWT extends P {}
}

declare module "@auth/core/adapters" {
  export interface AdapterUser extends P {}
}
