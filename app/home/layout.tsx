"use client";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
