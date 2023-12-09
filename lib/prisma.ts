import type { User } from "@prisma/client";
export type { User } from "@prisma/client";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type PrismaErrorCode = "P2002";

const PrismaErrors: {
  [k in PrismaErrorCode]: (e: PrismaClientKnownRequestError) => string;
} = {
  P2002: (e: PrismaClientKnownRequestError) => {
    let targets = e.meta?.target as string[];
    if (targets) {
      let fields = targets.reduce((accumulator, currentValue) => {
        return accumulator + "," + currentValue;
      });
      return fields + " 已存在";
    } else {
      return "";
    }
  },
};

export const PrismaUserSchemaToChinese: { [P in keyof User]: string } = {
  id: "ID",
  createdAt: "创建于",
  email: "邮箱",
  phone: "手机",
  firstname: "名",
  lastname: "姓",
  password: "密码",
  role: "角色",
};

export function isPrismaError(e: any): e is PrismaClientKnownRequestError {
  let pe = e as PrismaClientKnownRequestError;
  return pe.code !== undefined && pe.clientVersion !== undefined;
}

export function PrismaErrorMsg(e: PrismaClientKnownRequestError): string {
  if (e.code in PrismaErrors) {
    return PrismaErrors[e.code as PrismaErrorCode](e);
  } else {
    return "";
  }
}
