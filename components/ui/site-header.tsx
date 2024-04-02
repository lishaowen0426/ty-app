"use client";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import Link from "next/link";

function HeaderNav() {
  const pathname = usePathname();

  return (
    <div className="flex">
      <Link href="/" className="flex items-center space-x-2 mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="font-bold inline-block">距离</span>
      </Link>
      <nav></nav>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 ">
      <div className="w-full flex h-14 items-center md:mx-10">
        <HeaderNav />
      </div>
    </header>
  );
}
