import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export default function HOmeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
