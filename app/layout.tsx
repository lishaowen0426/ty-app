import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";

import "./globals.css";

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
