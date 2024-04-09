"use client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Separator } from "./separator";
import { SigninPopup } from "@/components/ui/Popup";

import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import Link from "next/link";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "./dropdown-menu";
import {
  DropdownMenuWithDialog,
  DialogItem,
} from "@/components/ui/DropdownDialog";
import { Switch } from "./switch";
import { Settings, Mail } from "lucide-react";
import { Label } from "./label";
import { pinyin } from "pinyin-pro";

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const [darkChecked, setDarkChecked] = useState(theme == "dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="ghost" className="px-0">
          <Settings className="h-[1.5rem] w-[1.5rem] scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {}}>中文</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>日本語</DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Label className="pr-3" htmlFor="dark-mode">
            深色模式
          </Label>
          <Switch
            id="dark-mode"
            checked={darkChecked}
            onCheckedChange={(checked: boolean) => {
              setDarkChecked(checked);
              setTheme(checked ? "dark" : "light");
            }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserInfo() {
  const { data: session, status } = useSession();
  const user = session?.user;
  if (!user) {
    return (
      <SigninPopup className="">
        <Button variant="outline" className="h-8 text-sm">
          <Mail className="mr-2" />
          <span className="hidden md:inline-flex">使用邮箱登陆</span>
          <span className="inline-flex md:hidden">登陆</span>
        </Button>
      </SigninPopup>
    );
  } else {
    const initial = (
      user.name
        ? pinyin(user.name, { toneType: "none", type: "array" })[0]
        : user.email
    ).charAt(0);
    const trigger = (
      <DropdownMenuTrigger asChild>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="flex items-center bg-slate-200 dark:bg-background font-semibold text-base">
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
    );

    return (
      <DropdownMenuWithDialog trigger={trigger}>
        <DropdownMenuContent className="w-[4rem]" align="center">
          <DropdownMenuItem asChild>
            <Link href="/dashboard">我的</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              signOut();
            }}
          >
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuWithDialog>
    );
  }
}

function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-8 justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none w-[80px] md:w-[180px]"
        )}
      >
        <span className="hidden md:inline-flex">搜索你关心的内容...</span>
        <span className="inline-flex md:hidden">搜索...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索..." />
      </CommandDialog>
    </>
  );
}

function HeaderNav({ user, search }: { user?: boolean; search?: boolean }) {
  return (
    <div className="flex container px-0 justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="font-bold inline-block">距离</span>
      </Link>
      <nav></nav>
      <div className="flex  items-center justify-between space-x-2 md:justify-end">
        {search && <SearchButton />}
        {user && <UserInfo />}
        <ModeToggle />
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const { status } = useSession();
  return (
    <header
      id="site-header"
      className=" z-50 w-full border-b border-border/40 bg-background/95"
    >
      <div className="container px-0 flex   items-center">
        <HeaderNav
          user={status === "authenticated"}
          search={status === "authenticated"}
        />
      </div>
    </header>
  );
}
