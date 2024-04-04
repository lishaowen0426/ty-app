import { Inter } from "next/font/google";
import RootHead from "@/components/RootHead";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteFooter from "@/components/ui/site-footer";
import Providers from "./providers";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-secondary min-h-screen m-0 flex flex-col">
        <Providers>
          <TooltipProvider>
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
