"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Send, SendHorizontal } from "lucide-react";

const RegisterButton = (props: ButtonProps) => {
  return (
    <Button {...props}>
      <Send />
      注册
    </Button>
  );
};
const SigninButton = (props: ButtonProps) => {
  return (
    <Button variant="outline" {...props}>
      <SendHorizontal />
      登陆
    </Button>
  );
};

const SignoutButton = (props: ButtonProps) => {
  return <Button {...props}>登出</Button>;
};

export function AuthButton() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div>
      <Button onClick={() => signIn()}>登陆</Button>;
      <Button onClick={() => signOut()}>登出</Button>;
    </div>
  );
}
