"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Send, SendHorizontal } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { sign } from "crypto";

export const IconButton = ({ className, ...props }: ButtonProps) => {
  return <Button className={cn("gap-4", className)} {...props} />;
};

export const RegisterButton = (props: ButtonProps) => {
  return (
    <IconButton {...props}>
      <Send />
      注册
    </IconButton>
  );
};
export const SigninButton = (props: ButtonProps) => {
  return (
    <IconButton variant="outline" {...props}>
      <SendHorizontal />
      登陆
    </IconButton>
  );
};

export const SignoutButton = (props: ButtonProps) => {
  return <IconButton {...props}>登出</IconButton>;
};

const UserInfo = (props: ButtonProps) => {
  return <Button></Button>;
};

export function AuthButton() {
  const { data: session, status } = useSession();
  console.log(session);
  const container = cn("flex", "justify-between", "gap-5");
  if (session && status == "authenticated") {
    return (
      <div className={container}>
        <Button variant="link">
          {session.user.lastname + " " + session.user.firstname}
        </Button>
        <SignoutButton />
      </div>
    );
  } else {
    return (
      <div className={container}>
        <SigninButton onClick={() => signIn()} />
        <RegisterButton />
      </div>
    );
  }
}
