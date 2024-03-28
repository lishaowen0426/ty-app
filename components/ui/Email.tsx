"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import * as ErrMsg from "@/lib/errmsg";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import AuthCard, { AuthCardProps } from "@/components/ui/AuthCard";
import { cn } from "@/lib/utils";
import { AlertOverlay } from "./DiaglogOverlay";
import { IconButton } from "@/components/ui/AuthButton";
import { Send, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  return (
    <IconButton
      id="signin"
      className="mt-5 w-2/3"
      variant="outline"
      type="submit"
    >
      <Send />
      登陆
    </IconButton>
  );
};
const RegButton = () => {
  return (
    <IconButton id="signup" className="mt-5 w-2/3" type="submit">
      <SendHorizontal />
      注册
    </IconButton>
  );
};

interface FormInput {
  email: string;
  password: string;
}

export function EmailForm() {
  const [userPassword, setUserPassword] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const router = useRouter();

  const form = useForm<FormInput>({
    defaultValues: {
      email: "",
      password: undefined,
    },
    mode: "onSubmit",
  });

  const onSubmitValid: SubmitHandler<FormInput> = async (data, e) => {
    if ((e?.nativeEvent as SubmitEvent).submitter!.id == "signup") {
      try {
        let resp = await signIn(
          "email",
          {
            email: data.email,
            redirect: false,
          },
          {
            status: "signup",
          }
        );
        setShowOverlay(true);
        if (!resp) {
          setAlertInfo({
            title: "服务器内部错误",
            message: "请联系管理员或稍后重试",
          });
        } else {
          if (resp.error === null) {
            setAlertInfo({
              title: "链接已发送",
              message: "请检查您的邮箱",
            });
          } else {
            if (resp.error == ErrMsg.USEREXISTS) {
              setAlertInfo({
                title: "邮箱注册失败",
                message: "已注册",
              });
            } else {
              setAlertInfo({
                title: "未知错误",
                message: "请联系管理员或稍后重试",
              });
            }
          }
        }
      } catch (e) {
        setAlertInfo({
          title: "未知错误",
          message: "请联系管理员或稍后重试",
        });
        console.log(e);
      }
    } else {
      if (userPassword) {
        try {
          let resp = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
          if (!resp) {
            setShowOverlay(true);
            setAlertInfo({
              title: "服务器内部错误",
              message: "请联系管理员或稍后重试",
            });
          } else {
            if (resp.ok) {
              router.push("/home/dashboard");
            }

            if (resp.error == ErrMsg.PASSWORDNOTSET) {
              setShowOverlay(true);
              setAlertInfo({ title: "密码登陆失败", message: "请先设置密码" });
            } else if (resp.error == ErrMsg.USERNOTFOUND) {
              setShowOverlay(true);
              setAlertInfo({
                title: "密码登陆失败",
                message: "用户不存在请先注册",
              });
            } else if (resp.error == ErrMsg.WRONGPASSWORD) {
              setShowOverlay(true);
              setAlertInfo({
                title: "密码登陆失败",
                message: "密码错误",
              });
            } else {
              setShowOverlay(true);
              setAlertInfo({
                title: "未知错误",
                message: "请联系管理员或稍后重试",
              });
            }
          }
        } catch (e) {
          setShowOverlay(true);
          setAlertInfo({
            title: "服务器内部错误",
            message: "请联系管理员或稍后重试",
          });
        }
      } else {
        //signin using email
        try {
          let resp = await signIn(
            "email",
            {
              email: data.email,
              redirect: false,
            },
            {
              status: "signin",
            }
          );
          console.log(resp);
          if (!resp) {
            setShowOverlay(true);
            setAlertInfo({
              title: "服务器内部错误",
              message: "请联系管理员或稍后重试",
            });
          } else {
            if (resp.error == null) {
              setShowOverlay(true);
              setAlertInfo({
                title: "链接已发送",
                message: "请检查您的邮箱",
              });
            } else if (resp.error == ErrMsg.USERNOTFOUND) {
              setShowOverlay(true);
              setAlertInfo({
                title: "邮箱登陆失败",
                message: "尚未注册",
              });
            } else {
              setShowOverlay(true);
              setAlertInfo({
                title: "未知错误",
                message: "请联系管理员或稍后重试",
              });
            }
          }
        } catch (e) {
          setShowOverlay(true);
        }
      }
    }
  };
  const onSubmitInValid: SubmitErrorHandler<FormInput> = async (data, e) => {};
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitValid)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("email", {
                      required: "请输入邮箱",
                      validate: (val) => {
                        const result = z.string().email().safeParse(val);
                        return result.success || "邮箱格式不正确";
                      },
                    })}
                    placeholder={userPassword ? "" : "发送链接到邮箱"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={userPassword ? "" : "hidden"}>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("password", {
                      required: { value: userPassword, message: "请输入密码" },
                      minLength: { value: 6, message: "密码长度大于等于6" },
                      maxLength: { value: 12, message: "密码长度小于等于12" },
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              variant="link"
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                setUserPassword((userPassword) => !userPassword);
                form.clearErrors();
              }}
            >
              使用密码登陆
            </Button>
          </div>

          <div className="flex justify-center">
            <LoginButton />
          </div>
          {!userPassword && (
            <div className="flex justify-center">
              <RegButton />
            </div>
          )}
        </form>
      </Form>
      <AlertOverlay
        open={showOverlay}
        setOpen={setShowOverlay}
        {...alertInfo}
      />
    </div>
  );
}

export default function EmailCard() {
  return (
    <AuthCard className="h-[300px] w-[20rem] relative left-1/2 -translate-x-1/2">
      <CardHeader className="border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
        <CardTitle>登陆</CardTitle>
      </CardHeader>
      <CardContent>
        <EmailForm />
      </CardContent>
    </AuthCard>
  );
}
