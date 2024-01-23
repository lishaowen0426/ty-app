"use client";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { AvatarContext } from "@/components/ui/AvatarProvider";
import { useState } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const value = { avatar, setAvatar };
  return (
    <SessionProvider>
      <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
    </SessionProvider>
  );
}
