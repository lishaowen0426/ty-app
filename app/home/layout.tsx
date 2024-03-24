"use client";
import { SessionProvider } from "next-auth/react";
import { AvatarContext } from "@/components/ui/AvatarProvider";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/system";

const queryClient = new QueryClient();

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const value = { avatar, setAvatar };
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AvatarContext.Provider value={value}>
          <NextUIProvider>{children}</NextUIProvider>
        </AvatarContext.Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
