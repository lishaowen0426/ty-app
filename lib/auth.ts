import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

type LoginFn = (phone: string, password: string) => Promise<User>;

export const login: LoginFn = async (phone: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      phone: phone,
    },
  });

  if (user && (await compare(password, user.password))) {
    user.password = "";
    return user;
  } else throw new Error("User not found");
};
