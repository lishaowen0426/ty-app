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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";

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
  user: Session["user"];
  className?: string;
}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-12 w-12">
              {user.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">欢迎</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
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

const Header = () => {
  return (
    <div className="flex justify-between m-[2rem]">
      <h2 className="text-4xl font-bold tracking-tight">聊天室</h2>
      <UserInfo user={mockUser} />
    </div>
  );
};

const Footer = () => {
  return (
    <Button
      variant="outline"
      className="bg-black text-white ml-auto mb-[1rem] mr-[1rem] mt-[1rem]"
    >
      创建聊天
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  return (
    <div className="h-full flex flex-col justify-between">
      <Header />

      <TopicCard className="h-[70%] mt-auto" />
      <Footer />
    </div>
  );
}
