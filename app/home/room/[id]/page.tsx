"use client";
import Chat from "@/components/ui/Chat";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

const SERVER =
  process.env.NEXT_PUBLIC_CHAT_SERVER ??
  (() => {
    throw new Error("chat server undefined");
  })();

export default function ChatRoom({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("before");
    const socket = io(SERVER, {
      withCredentials: true,
      auth: {
        user: session?.user,
      },
      extraHeaders: {
        topic: params.id,
      },
    });
  }, []);
  return <Chat />;
}
