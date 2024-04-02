"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/AvatarProvider";
import { ChevronRight } from "lucide-react";
import { SigninPopup, ChatPopup } from "@/components/ui/Popup";
import { useRef, forwardRef, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Session } from "next-auth";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenuWithDialog,
  DialogItem,
} from "@/components/ui/DropdownDialog";
import Profile from "@/components/ui/ProfileCard";

const UserInfo = forwardRef<HTMLImageElement, { className?: string }>(
  ({ className }, ref) => {
    const { data: session, status } = useSession();
    const user = session?.user;
    const trigger = (
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-12 w-12">
            <UserAvatar user={user}>
              <AvatarFallback className="w-full h-full flex items-center bg-slate-400 font-semibold text-[1.5rem]">
                Y
              </AvatarFallback>
            </UserAvatar>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
    );
    return (
      <div>
        <DropdownMenuWithDialog trigger={trigger}>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">欢迎</p>
                {user && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DialogItem
                triggerChildren="设置"
                onOpenChange={(open: boolean) => {}}
              >
                <Profile className="w-[90%]" user={user} />
              </DialogItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
              }}
            >
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuWithDialog>
      </div>
    );
  }
);

const UserButton = ({ className }: { className?: string }) => {
  const { data: session, status } = useSession();
  const isMediumDevice = useMediaQuery("only screen and  (max-width : 1200px)");
  const B = (
    <Button
      className={cn(
        "bg-black text-white",
        className,
        "w-[50px] md:w-[60px] lg:w-[100px]"
      )}
    >
      <ChevronRight className="h-4 w-4" />
      {isMediumDevice ? "创建" : "创建聊天室"}
    </Button>
  );

  return session?.user && status == "authenticated" ? (
    <ChatPopup className="w-[20rem]">{B}</ChatPopup>
  ) : (
    <SigninPopup className="w-[20rem]">{B}</SigninPopup>
  );
};

export { UserInfo, UserButton };
