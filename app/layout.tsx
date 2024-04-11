import { Inter } from "next/font/google";
import RootHead from "@/components/RootHead";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteHeader from "@/components/ui/site-header";
import Providers from "./providers";
import SiteFooter from "@/components/ui/site-footer";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head />
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
