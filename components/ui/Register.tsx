"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterButton } from "@/components/ui/AuthButton";
import AuthCard, { AuthCardProps } from "@/components/ui/AuthCard";
import { registerSchema } from "@/app/api/register/route";
import { User, isPrismaError, PrismaErrorMsg } from "@/lib/prisma";
import { AlertOverlay } from "@/components/ui/DiaglogOverlay";
import { useState } from "react";

export default function RegisterCard() {
  const [registerErr, setRegisterErr] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const formSchema = z.object(registerSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      firstname: "",
      lastname: "",
      email: "",
    },
  });
  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
    e?.preventDefault();
    console.log(data);
    console.log(e);
    try {
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((resp) => resp.json());
      if (resp.error) {
        setRegisterErr(true);
        let e = resp.error;
        if (isPrismaError(e)) {
          setErrMsg(PrismaErrorMsg(e));
          console.log(errMsg);
        }
      } else {
        //signin and redirect
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: "/home",
        });
      }
    } catch (e) {
      setRegisterErr(true);
      console.log(e);
    }
  };
  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof formSchema>
  > = async (data, e) => {
    e?.preventDefault();
    console.log(data);
    console.log(e);
  };
  const f = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
        <div className="flex flex-nowrap w-full justify-between gap-5">
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>姓</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>名</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
          <RegisterButton type="submit" className="mt-5 w-2/3" />
        </div>
      </form>
    </Form>
  );
  return (
    <AuthCard className="h-[550px] w-[25rem] relative left-1/2 -translate-x-1/2">
      <CardHeader className="border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
        <CardTitle>注册</CardTitle>
      </CardHeader>
      <CardContent>{f}</CardContent>
      <AlertOverlay
        title="注册失败"
        message={errMsg}
        open={registerErr}
        setOpen={setRegisterErr}
      />
    </AuthCard>
  );
}
