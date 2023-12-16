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
import DropdownMenuWithDialog from "@/components/ui/DropdownDialog";

const mockUser: Session["user"] = {
  id: "1",
  email: "l@gmail.com",
  createdAt: null,
  password: null,
  avatar: "https://github.com/shadcn.png",
  emailVerified: null,
  name: "ll",
};

const RegPopup = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>有想分享的吗？</DialogTitle>
          <DialogDescription>注册账号并创建你的话题！</DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    </Dialog>
  );
};

const UserInfo = ({
  user,
  className,
}: {
  user?: Session["user"];
  className?: string;
}) => {
  return (
    <div>
      <DropdownMenu>
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
            <DropdownMenuItem>
              账户
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              设置
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              signOut();
            }}
          >
            登出
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
    return <RegPopup className="w-[20rem]">{B}</RegPopup>;
  };
  return (
    <div className="h-full flex flex-col justify-between">
      <Header />
      <DropdownMenuWithDialog />
      <TopicCard className="h-[70%] mt-auto" />
      <Footer navi={navi} />
    </div>
  );
}
