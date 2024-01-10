"use client";
import Chat from "@/components/ui/Chat";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { boolean } from "zod";
import { useRef } from "react";
import { debug } from "console";
import { use } from "react";

const SERVER =
  process.env.NEXT_PUBLIC_CHAT_SERVER ??
  (() => {
    throw new Error("chat server undefined");
  })();

export default function ChatRoom({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const socket = useRef<ReturnType<typeof io> | undefined>(undefined);
  const connected = useRef<boolean | undefined>(undefined);

  if (socket.current) {
    return <Chat />;
  } else {
    const skt = io(SERVER, {
      withCredentials: true,
      auth: {
        user: session?.user,
      },
      extraHeaders: {
        topic: params.id,
      },
    });

    skt.once("OK", () => {
      socket.current = skt;
      connected.current = true;
    });
    skt.once("notfound", () => {
      connected.current = false;
      skt.disconnect();
    });

    const promise = new Promise((resolveFn, rejectFn) => {
      const intervalID = setInterval(() => {
        if (connected.current === true) {
          clearInterval(intervalID);
          resolveFn(true);
        } else if (connected.current === false) {
          clearInterval(intervalID);
          rejectFn(new Error("notconnected"));
        }
      }, 1000);
    });

    const resolved = use(promise);
  }
}
