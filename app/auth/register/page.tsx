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

export default function Signin() {
  const formSchema = z.object(registerSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
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
        console.log(resp.error);
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof formSchema>
  > = async (data, e) => {
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>角色</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择你的角色" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Student">学生</SelectItem>
                  <SelectItem value="Teacher">老师</SelectItem>
                  <SelectItem value="Admin">管理员</SelectItem>
                </SelectContent>
              </Select>
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
    <AuthCard className="h-[550px]">
      <CardHeader className="border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
        <CardTitle>注册</CardTitle>
      </CardHeader>
      <CardContent>{f}</CardContent>
    </AuthCard>
  );
}
