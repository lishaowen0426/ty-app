"use client";

import * as React from "react";
import { useEffect } from "react";
import { Check, Plus, ArrowBigLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MessageProp {
  msg: string;
  source: "me" | "them";
}

const mockMsg: MessageProp[] = [
  { msg: "你好", source: "me" },
  { msg: "一起吃饭吗", source: "them" },
  { msg: "好的", source: "me" },
  { msg: "在哪里", source: "them" },
  { msg: "我家", source: "me" },
];

const MessageList = (msg: MessageProp[]) => {
  return msg.map((m, i) => (
    <div
      key={i}
      className={cn(
        "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words",
        m.source === "me"
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      {m.msg}
    </div>
  ));
};

export default function Chat() {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<MessageProp[]>(mockMsg);
  const inputLength = input.trim().length;

  return (
    <Card className={cn("m-1 h-full flex flex-col justify-between")}>
      <CardHeader className={cn("p-3 flex-row space-y-0")}>
        <Button
          size="icon"
          variant="outline"
          className="mr-auto rounded-full"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBigLeft className="h-4 w-4" />
          <span className="sr-only">返回</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="ml-auto rounded-full"
              onClick={() => {
                router.back();
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">返回</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-3">
            <DropdownMenuItem>话题信息</DropdownMenuItem>
            <DropdownMenuItem>收藏</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <Separator />
      <CardContent className={cn("grow mt-4")}>
        <div className="space-y-4">{MessageList(messages)}</div>
      </CardContent>
      <CardFooter className={cn("px-2 pb-3")}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputLength === 0) return;
            setMessages([
              ...messages,
              {
                source: "me",
                msg: input,
              },
            ]);
            setInput("");
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="输入信息..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
