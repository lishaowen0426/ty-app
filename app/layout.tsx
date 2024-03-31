import { Inter } from "next/font/google";
import RootHead from "@/components/RootHead";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-screen" lang="en">
      <RootHead />
      <TooltipProvider>
        <body className={cn("h-full m-0", inter.className)}>{children}</body>
      </TooltipProvider>
    </html>
  );
}
