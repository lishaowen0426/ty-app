"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, SubmitErrorHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { IconButton } from "@/components/ui/AuthButton";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Session } from "inspector";
import type { ChatCreateReq } from "@/app/api/chat/route";

const SERVER =
  process.env.NEXT_PUBLIC_SERVER ??
  (() => {
    throw new Error("chat server undefined");
  })();

const SubmitButton = () => {
  return (
    <IconButton
      id="chat"
      type="submit"
      className="mt-5 w-2/3"
      variant="outline"
    >
      <MessageCircle />
      发起
    </IconButton>
  );
};

export function ChatForm() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return;
  }

  const user = session!.user;

  const [alertInfo, setAlertInfo] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });

  const formSchema = z.object({
    topic: z
      .string({ required_error: "请输入话题" })
      .min(1, { message: "话题长度大于1" })
      .max(10, { message: "话题长度小于10" }),
    tags: z
      .string()
      .min(1, { message: "tag长度大于1" })
      .max(6, { message: "tag长度小于6" })
      .array()
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const onSubmitValid: SubmitHandler<z.infer<typeof formSchema>> = async (
    data,
    e
  ) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId: user.id,
          topic: data.topic,
          tags: data.tags,
        } satisfies ChatCreateReq),
      });
      if (resp.ok) {
      }
    } catch (e) {}
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
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>话题</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="一起吃饭吧🍙" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <SubmitButton />
          </div>
        </form>
      </Form>
    </div>
  );
}
