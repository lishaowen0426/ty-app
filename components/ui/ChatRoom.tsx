"use client";
import { cn, getRandomInt } from "@/lib/utils";
import { lorem } from "@/lib/utils";
import { Input } from "./input";
import { useEffect } from "react";
import { IconButton } from "./button";
import { ArrowLeft, Smile } from "lucide-react";
import { Icons } from "./icons";

function Bubble({
  message,
  className,
  self,
}: {
  message: string;
  className?: string;
  self: boolean;
}) {
  return (
    <div
      className={cn(
        className,
        self ? "ml-auto mr-0" : "",
        self ? "chat-bubble-self" : "chat-bubble-they",
        "w-max max-w-[75%] py-2 px-3 rounded-xl my-[10px]"
      )}
      suppressHydrationWarning
    >
      {message}
    </div>
  );
}

const messages = new Array(100).fill("").map(() => {
  return lorem.generateSentences(getRandomInt(1, 10));
});

export type ChatProps = {
  id: string;
  name: string;
  members: number;
  online: number;
} & React.ComponentPropsWithoutRef<"div">;

export const ChatHeader = (props: ChatProps) => {
  const { name, members, online, ...rest } = props;
  const Info = () => {
    return (
      <div id="chat-header-info" className="flex flex-col justify-center">
        <div className="truncate text-xl">{name}</div>
        <div className="text-light-text/50 text-xs">{`${members}成员, ${online}在线`}</div>
      </div>
    );
  };
  return (
    <div id="chat-header" className="flex justify-start container px-[1rem]">
      <IconButton className="w-[24px]">
        <ArrowLeft />
      </IconButton>
      <Info />
      <IconButton className="ml-auto">
        <Icons.EllipsisVertical />
      </IconButton>
    </div>
  );
};

export const ChatFooter = (props: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      id="chat-footer"
      className="bg-chat-background px-[1rem] flex justify-between"
    >
      <input className="rounded-2xl h-[1.5lh] my-auto flex-1 min-w-[3ch] mr-[1ch]" />
      <div className="flex flex-row w-[3.5lh] justify-between">
        <IconButton>
          <Smile size="1.5lh" strokeWidth="1.2" />
        </IconButton>
        <IconButton>
          <Icons.CirclePlus width="1.5lh" height="1.5lh" strokeWidth="1.2" />
        </IconButton>
      </div>
    </div>
  );
};

export function ChatRoom(props: ChatProps) {
  const { id: topic_id } = props;
  useEffect(() => {
    const chatHeight = () => {
      document.documentElement.style.setProperty(
        "--chat-scroll-height",
        `${window.innerHeight}px`
      );
    };
    chatHeight();
    window.addEventListener("resize", chatHeight);
    return () => {
      window.removeEventListener("resize", chatHeight);
    };
  }, []);
  return (
    <div
      id="chat-scroll"
      className="h-full overflow-y-auto bg-chat-background px-[10px]"
    >
      {messages.map((m, index) => {
        return (
          <Bubble message={m} key={index} self={getRandomInt(0, 1) == 0} />
        );
      })}
    </div>
  );
}
