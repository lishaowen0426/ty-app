import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "distance",
};

import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body
        className="bg-background h-full  m-0 flex flex-col justify-start"
        suppressHydrationWarning
      >
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
