"use client";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Send, SendHorizontal } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const IconButton = ({ className, ...props }: ButtonProps) => {
  return <Button className={cn("gap-4", className)} {...props} />;
};

interface LinkButtonProps {
  link: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const IconButtonLink = ({
  link,
  icon,
  label,
  className,
}: LinkButtonProps) => {
  return (
    <Link
      className={cn(buttonVariants({ variant: "outline" }), "gap-4", className)}
      href={link}
    >
      {icon}
      {label}
    </Link>
  );
};

export type RegisterButtonProps = ButtonProps;

export const RegisterButton = ({ className, ...props }: ButtonProps) => {
  if (props.type) {
    return (
      <IconButton {...props} className={className}>
        <Send />
        注册
      </IconButton>
    );
  } else {
    return (
      <IconButtonLink
        icon={<Send />}
        link="/auth/register"
        label="注册"
        className={cn("bg-black text-white", className)}
      />
    );
  }
};

export const SigninButton = ({ variant, ...props }: ButtonProps) => {
  return (
    <IconButton variant={variant ?? "outline"} {...props}>
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
        <SignoutButton onClick={() => signOut()} />
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
