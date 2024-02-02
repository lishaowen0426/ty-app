"use client";
import TopicCard from "@/components/ui/TopicCard";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EmailForm } from "@/components/ui/Email";
import { ChatForm } from "@/components/ui/ChatForm";
import Profile from "@/components/ui/ProfileCard";
import DropdownMenuWithDialog, {
  DialogItem,
} from "@/components/ui/DropdownDialog";
import { SigninPopup, ChatPopup } from "@/components/ui/Popup";
import { Suspense } from "react";
import { useRef, forwardRef, useState } from "react";

interface UserInfoProps {
  user?: Session["user"];
  className?: string;
}

const UserInfo = forwardRef<HTMLImageElement, UserInfoProps>(
  ({ user, className }, ref) => {
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

export const Header = ({
  user,
  title,
}: {
  user?: Session["user"];
  title: string;
}) => {
  return (
    <div className="flex justify-between m-[2rem]">
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <UserInfo user={user} />
    </div>
  );
};

export default function Dashboard() {
  console.log("enter Dashboard");
  const { data: session, status } = useSession();

  const navi: string | undefined =
    session?.user && status == "authenticated" ? undefined : "/auth/signin";

  const Footer = () => {
    const B = (
      <Button className="bg-black text-white ml-auto mb-[1rem] mr-[1rem] mt-[1rem]">
        <ChevronRight className="h-4 w-4" /> 创建聊天室
      </Button>
    );

    return session?.user && status == "authenticated" ? (
      <ChatPopup className="w-[20rem]">{B}</ChatPopup>
    ) : (
      <SigninPopup className="w-[20rem]">{B}</SigninPopup>
    );
  };
  return (
    <div className="h-full flex flex-col justify-between">
      <Header user={session?.user} title="聊天室" />
      <Suspense fallback={<p>载入话题中</p>}>
        <TopicCard className="h-[70%] " />
      </Suspense>
      <Footer />
    </div>
  );
}
