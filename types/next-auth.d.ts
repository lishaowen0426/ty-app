import { DefaultSession, User as AuthUser } from "next-auth/types";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth/types" {}
