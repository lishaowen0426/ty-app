"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
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
import { SigninButton } from "@/components/ui/AuthButton";
import AuthCard, { AuthCardProps } from "@/components/ui/AuthCard";
import { redirect, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlertOverlay } from "./DiaglogOverlay";
import { useEffect } from "react";
import { IconButton } from "@/components/ui/AuthButton";
import { Send, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  return (
    <IconButton
      id="signin"
      type="submit"
      className="mt-5 w-2/3"
      variant="outline"
    >
      <Send />
      登陆
    </IconButton>
  );
};
const RegButton = () => {
  return (
    <IconButton id="signup" type="submit" className="mt-5 w-2/3">
      <SendHorizontal />
      注册
    </IconButton>
  );
};

export function EmailForm() {
  const [userPassword, setUserPassword] = useState<boolean>(false);
  const [signinErr, setSigninErr] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });
  const router = useRouter();

  const formSchema = z.object({
    email: z
      .string({ required_error: "请输入邮箱" })
      .email({ message: "邮箱格式错误" }),
    password: z
      .string({ required_error: "请输入密码" })
      .min(6, { message: "密码长度大于6" })
      .max(12, { message: "密码长度小于12" })
      .optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
    //console.log(e?.nativeEvent.submitter.id);
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
        if (resp?.error) {
          setSigninErr(true);
          setAlertInfo({
            title: "邮箱登陆失败",
            message: "已注册",
          });
        } else {
          setSigninErr(true);
          setAlertInfo({
            title: "链接已发送",
            message: "请检查您的邮箱",
          });
        }
      } catch (e) {
        setSigninErr(true);
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
          console.log(resp);
          if (resp?.error == "set") {
            setSigninErr(true);
            setAlertInfo({ title: "密码登陆失败", message: "请先设置密码" });
          } else if (resp?.error == "found") {
            setSigninErr(true);
            setAlertInfo({
              title: "密码登陆失败",
              message: "用户不存在请先注册",
            });
          } else if (resp?.error == "wrong") {
            setSigninErr(true);
            setAlertInfo({
              title: "密码登陆失败",
              message: "密码错误",
            });
          } else if (resp?.ok) {
            router.push("/home/dashboard");
          } else {
            throw new Error("unrecognized");
          }
        } catch (e) {
          setSigninErr(true);
          setAlertInfo({
            title: "密码登陆失败",
            message: "",
          });
        }
      } else {
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
          if (resp?.error) {
            setSigninErr(true);
            setAlertInfo({
              title: "邮箱登陆失败",
              message: "尚未注册",
            });
          } else {
            setSigninErr(true);
            setAlertInfo({
              title: "链接已发送",
              message: "请检查您的邮箱",
            });
          }
        } catch (e) {
          setSigninErr(true);
        }
      }
    }
  };
  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof formSchema>
  > = async (data, e) => {
    e?.preventDefault();
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={userPassword ? "" : "发送链接到邮箱"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {userPassword && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
      <AlertOverlay open={signinErr} setOpen={setSigninErr} {...alertInfo} />
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
