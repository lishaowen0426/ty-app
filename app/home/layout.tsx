"use client";
import { SessionProvider } from "next-auth/react";
import { AvatarContext } from "@/components/ui/AvatarProvider";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MediaContextProvider } from "@/components/Media";

const queryClient = new QueryClient();

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const value = { avatar, setAvatar };
  return (
    <MediaContextProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AvatarContext.Provider value={value}>
            {children}
          </AvatarContext.Provider>
        </SessionProvider>
      </QueryClientProvider>
    </MediaContextProvider>
  );
}
