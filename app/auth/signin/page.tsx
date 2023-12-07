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
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import classes from "./Signin.module.css";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertProps {
  open: boolean;
}

const SigninFailedAlert = ({ className }: { className?: string }) => {
  return (
    <Alert variant="destructive" className={cn("w-[80%]", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>错误</AlertTitle>
      <AlertDescription>登陆信息错误</AlertDescription>
    </Alert>
  );
};

export default function Signin() {
  const searchParams = useSearchParams();
  const isSigninFailed = !!searchParams.get("error");
  const [opaque, setOpage] = useState(isSigninFailed);
  console.log(opaque);

  const formSchema = z.object({
    phone: z
      .string({ required_error: "请输入手机" })
      .length(11, { message: "手机号码格式错误" }),
    password: z
      .string({ required_error: "请输入密码", description: "密码为6到20位" })
      .min(6, { message: "密码长度须大于等于6" })
      .max(20, { message: "密码长度须小于等于20" }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
    e?.preventDefault();

    try {
      await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: true,
        callbackUrl: "/home",
      });
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof formSchema>
  > = async (data, e) => {};
  const f = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <SigninButton type="submit" className="mt-5 w-2/3" />
        </div>
      </form>
    </Form>
  );
  const Opaque = () => {
    return (
      <div
        className={cn(classes["alpha"], "absolute w-full h-full top-0 left-0")}
      />
    );
  };

  const removeOpaque = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.type == "submit") {
      return;
    }

    if (opaque) {
      setOpage(!opaque);
    }
  };
  return (
    <div>
      <AuthCard className="h-[350px] relative" onClick={removeOpaque}>
        <CardHeader className="border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
          <CardTitle>登陆</CardTitle>
        </CardHeader>
        <CardContent>{f}</CardContent>
        {opaque && <Opaque />}
        {opaque && (
          <SigninFailedAlert className="absolute top-[40%] left-[10%]" />
        )}
      </AuthCard>
    </div>
  );
}
