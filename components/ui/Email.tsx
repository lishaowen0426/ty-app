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

export function EmailForm() {
  const [userPassword, setUserPassword] = useState<boolean>(false);
  const [signinErr, setSigninErr] = useState<boolean>(false);

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

    try {
      console.log("send email");
      let resp = await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: "/home",
      });
      console.log(resp);
    } catch (e) {
      setSigninErr(true);
      console.log(e);
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
                  <Input {...field} />
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
              }}
            >
              使用密码登陆
            </Button>
          </div>

          <div className="flex justify-center">
            <SigninButton type="submit" className="mt-5 w-2/3" />
          </div>
        </form>
      </Form>
      <AlertOverlay
        open={signinErr}
        setOpen={setSigninErr}
        title="注册失败"
        message="用户名或密码错误"
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
