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
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { EmailForm } from "@/components/ui/Email";
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

const ProfileForm = () => {
  return <div></div>;
};

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

  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length == 1) {
      const f: File = e.target.files[0];
      setAvatar(f);
    }
  };

  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "密码长度大于6" })
      .max(12, { message: "密码长度小于12" }),
    name: z.string().max(6, { message: "昵称长度小于6" }),
  });
  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
    e?.preventDefault();
    e?.stopPropagation();
  };
  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof formSchema>
  > = async (data, e) => {
    e?.preventDefault();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const profileForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
        <FormField control={form.control} name="email" />
      </form>
    </Form>
  );

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
            {avatar && <AvatarImage src={URL.createObjectURL(avatar)} />}
            <AvatarFallback className="w-full h-full flex items-center bg-slate-400 font-semibold text-[1.5rem]">
              {user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Input
            type="file"
            ref={hiddenFileInput}
            style={{ display: "none" }} // Make the file input element invisible
            onChange={handleAvatarUpload}
          />
        </div>
        <ProfileForm />
      </DialogContent>
    );
  } else {
    return (
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>创建账号来保存你的个人资料吧</DialogTitle>
          <DialogDescription>Edit this record below.</DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    );
  }
}
