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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterButton } from "@/components/ui/AuthButton";

export default function Signin() {
  const formSchema = z.object({
    phone: z.string({ required_error: "请输入手机" }),
    firstname: z.string({ required_error: "请填入名" }).min(1),
    lastname: z.string({ required_error: "请填入姓" }).min(1),
    password: z
      .string({ required_error: "请输入密码", description: "密码为6到20位" })
      .min(6)
      .max(20),
    email: z.string({ required_error: "请输入邮箱" }).email(),
    role: z.enum(["Student", "Teacher", "Admin"]),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const b = (
    <Button
      onClick={async () => {
        await signIn("credentials", {
          phone: "133",
          password: "133",
          redirect: true,
          callbackUrl: "/home",
        });
      }}
    >
      hello
    </Button>
  );

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) =>
    console.log(data);
  const f = (
    <Form {...form}>
      <form onSubmit={() => form.handleSubmit(onSubmit)}>
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
    <Card className="w-[500px] h-[500px]">
      <CardHeader className="border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
        <CardTitle>注册</CardTitle>
      </CardHeader>
      <CardContent>{f}</CardContent>
    </Card>
  );
}
