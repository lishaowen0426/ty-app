import { Inter } from "next/font/google";
import RootHead from "@/components/RootHead";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import SiteFooter from "@/components/ui/site-footer";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="h-screen" lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-secondary overflow-y-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <SiteFooter />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
