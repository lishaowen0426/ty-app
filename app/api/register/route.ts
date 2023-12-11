import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

export const registerSchema = {
  email: z
    .string({ required_error: "请输入邮箱" })
    .email({ message: "邮箱格式错误" }),
  firstname: z.string({ required_error: "请填入名" }).min(1),
  lastname: z.string({ required_error: "请填入姓" }).min(1),
  password: z
    .string({ required_error: "请输入密码", description: "密码为6到20位" })
    .min(6, { message: "密码长度须大于等于6" })
    .max(20, { message: "密码长度须小于等于20" }),
};

const schema = z.object(registerSchema);

const registerFn = async (user: z.infer<typeof schema>) => {
  const prisma = new PrismaClient();
  const created = await prisma.user.create({
    data: {
      email: user.email,
      name: user.lastname + user.firstname,
      password: user.password,
    },
  });
  await prisma.$disconnect();
  return created;
};
const HOST = (process.env.NEXTAUTH_URL ?? "").replace(/\/+$/, "");
const CSRF_URL = HOST + "/api/auth/csrf";

export async function POST(request: NextRequest) {
  try {
    const user = schema.parse(await request.json());
    const created = await registerFn(user);

    return NextResponse.json({ created: created }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 200 });
  }
}
