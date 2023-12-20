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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { EmailForm } from "@/components/ui/Email";
import DropdownMenuWithDialog, {
  DialogItem,
} from "@/components/ui/DropdownDialog";
import SignPopup from "@/components/ui/SignPopup";

const mockUser: Session["user"] = {
  id: "1",
  email: "l@gmail.com",
  createdAt: null,
  password: null,
  avatar: "https://github.com/shadcn.png",
  emailVerified: null,
  name: "ll",
};

const UserInfo = ({
  user,
  className,
}: {
  user?: Session["user"];
  className?: string;
}) => {
  const trigger = (
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-12 w-12">
          {user?.avatar && <AvatarImage src={user.avatar} />}
          <AvatarFallback className="w-full h-full flex items-center bg-slate-400 font-semibold text-[1.5rem]">
            Y
          </AvatarFallback>
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
            <DialogItem triggerChildren="账户">
              <DialogTitle>编辑个人账户</DialogTitle>
              <DialogDescription>Edit this record below.</DialogDescription>
            </DialogItem>
            <DialogItem triggerChildren="设置">
              <DialogTitle>设置</DialogTitle>
              <DialogDescription>Edit this record below.</DialogDescription>
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
};

const Header = ({ user }: { user?: Session["user"] }) => {
  return (
    <div className="flex justify-between m-[2rem]">
      <h2 className="text-4xl font-bold tracking-tight">聊天室</h2>
      <UserInfo user={user} />
    </div>
  );
};

export default function Dashboard() {
  const { data: session, status } = useSession();

  const navi: string | undefined =
    session?.user && status == "authenticated" ? undefined : "/auth/signin";

  const Footer = ({ navi }: { navi: string | undefined }) => {
    const B = (
      <Button className="bg-black text-white ml-auto mb-[1rem] mr-[1rem] mt-[1rem]">
        <ChevronRight className="h-4 w-4" /> 创建聊天室
      </Button>
    );
    return <SignPopup className="w-[20rem]">{B}</SignPopup>;
  };
  return (
    <div className="h-full flex flex-col justify-between">
      <Header user={session?.user} />
      <TopicCard className="h-[70%] mt-auto" />
      <Footer navi={navi} />
    </div>
  );
}
