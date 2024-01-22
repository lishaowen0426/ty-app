"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SubmitHandler,
  SubmitErrorHandler,
  useForm,
  Controller,
} from "react-hook-form";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { EmailForm } from "@/components/ui/Email";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { register } from "module";

export default function Profile({
  className,
  user,
}: {
  className?: string;
  user: Session["user"] | undefined;
}) {
  const [avatar, setAvatar] = useState<Blob | null>(
    user?.avatar ? new Blob([user.avatar]) : null
  );
  const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);

  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle");
    console.log(e.target.files);
    if (e.target.files && e.target.files.length == 1) {
      const f: File = e.target.files[0];
      setAvatar(f);
      setAvatarURL(URL.createObjectURL(f));
    }
  };

  interface formInput {
    email: string;
    password: string;
    password_again: string;
    name: string;
    avatar: FileList;
  }

  const form = useForm<formInput>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { ref: avatarRef, ...rest } = form.register("avatar", {
    onChange: (e) => {
      handleAvatarUpload(e);
    },
  });

  const PF = ({ userinfo }: { userinfo: NonNullable<typeof user> }) => {
    const onSubmitValid: SubmitHandler<formInput> = async (data, e) => {
      e?.preventDefault();
      e?.stopPropagation();
      console.log("valid");
      console.log(data);
    };
    const onSubmitInValid: SubmitErrorHandler<formInput> = async (data, e) => {
      e?.preventDefault();
      //form.setError("name", { type: "custom", message: "custom message" });
    };
    //console.log(form.formState.errors);

    const PasswordField = ({ placeholder }: { placeholder: string }) => {
      //const passwordInput = useRef<HTMLInputElement | null>(null);
      return (
        <div className="my-2">
          <Label>密码</Label>
          <Input
            {...form.register("password", {
              validate: (v) => {
                const schema = z
                  .string()
                  .min(6, { message: "密码需大于6个字" })
                  .max(20, { message: "密码需少于20个字" });
                const result = schema.safeParse(v);
                return result.success || "密码长度需大于等于6并小于等于20";
              },
            })}
            type="password"
            placeholder={placeholder}
          />
          <Input
            className="mt-2"
            {...form.register("password_again", {
              validate: (v) => {
                const password = form.getValues("password");
                return v == password || "密码不一致";
              },
            })}
            type="password"
            placeholder="确认密码"
          />
        </div>
      );
    };

    return (
      <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
        <Input
          {...rest}
          ref={(e) => {
            avatarRef(e);
            hiddenFileInput.current = e;
          }}
          type="file"
          style={{ display: "none" }} // Make the file input element invisible
        />

        <div className="my-2">
          <Label>邮箱</Label>
          <Input
            {...form.register("email", {
              disabled: true,
            })}
            type="email"
            placeholder={userinfo.email}
          />
        </div>
        <div className="my-2">
          <Label>昵称</Label>
          <Input
            {...form.register("name", {
              validate: (v) => {
                const schema = z.string().max(6);
                return schema.safeParse(v).success || "昵称需小于6个字";
              },
            })}
            type="text"
            placeholder={userinfo.name || "设置昵称让更多人记住你！"}
          />
        </div>
        <PasswordField
          placeholder={userinfo.password ? "新密码" : "设置密码以启用密码登陆"}
        />
        <div className="my-5 flex justify-end">
          <Button type="submit">提交</Button>
        </div>
      </form>
    );
  };

  if (user) {
    return (
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>编辑个人资料</DialogTitle>
        </DialogHeader>
        <div>
          <Avatar
            className="my-2 h-12 w-12 left-1/2 -translate-x-1/2 hover:brightness-75 "
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              hiddenFileInput.current?.click();
            }}
          >
            <AvatarImage src={avatarURL} />
            <AvatarFallback className="w-full h-full flex items-center bg-slate-400 font-semibold text-[1.5rem]">
              {user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="h-7"
              onClick={(e) => {
                if (hiddenFileInput.current) {
                  hiddenFileInput.current.files = null;
                  form.resetField("avatar");
                  setAvatar(null);
                  setAvatarURL(undefined);
                }
              }}
            >
              重置头像
            </Button>
          </div>
        </div>
        <div>
          <PF userinfo={user} />
        </div>
      </DialogContent>
    );
  } else {
    return (
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>创建账号来保存你的个人资料吧</DialogTitle>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    );
  }
}