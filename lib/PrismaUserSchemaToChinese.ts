import { User } from "@prisma/client";

export const PrismaUserSchemaToChinese: {
  [P in keyof User]: string;
} = {
  id: "ID",
  createdAt: "创建于",
  email: "邮箱",
  phone: "手机",
};
