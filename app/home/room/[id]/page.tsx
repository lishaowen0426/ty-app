"use client";
import Chat from "@/components/ui/Chat";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { use } from "react";

const SERVER =
  process.env.NEXT_PUBLIC_CHAT_SERVER ??
  (() => {
    throw new Error("chat server undefined");
  })();

export default function ChatRoom({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const socket = useRef<ReturnType<typeof io> | undefined>(undefined);

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
      res(skt);
    });
    skt.once("notfound", () => {
      rej("notfound");
      skt.disconnect();
    });

    let res: (v: unknown) => void;
    let rej: (res?: unknown) => void;
    const promise = new Promise((resolveFn, rejectFn) => {
      res = resolveFn;
      rej = rejectFn;
    });

    const resolved = use(promise);

    return <Chat />;
  }
}
