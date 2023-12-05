import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-screen" lang="en">
      <body
        className={cn(
          "h-full m-0 grid",
          inter.className,
          "grid-cols-12",
          "grid-rows-10"
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
