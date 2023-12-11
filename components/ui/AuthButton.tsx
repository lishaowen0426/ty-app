"use client";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Send, SendHorizontal } from "lucide-react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
export const IconButton = ({ className, ...props }: ButtonProps) => {
  return <Button className={cn("gap-4", className)} {...props} />;
};

interface LinkButtonProps {
  link: string;
  variant?:
    | "outline"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "default";
  label: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  scroll?: boolean;
}

export const IconButtonLink = ({
  link,
  icon,
  label,
  variant,
  className,
  scroll,
}: LinkButtonProps) => {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: variant ?? "outline" }),
        "gap-4",
        className
      )}
      href={link}
      scroll={scroll}
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
        scroll={false}
        className={cn("bg-black text-white", className)}
      />
    );
  }
};

export const SigninButton = ({ variant, className, ...props }: ButtonProps) => {
  if (props.type) {
    return (
      <IconButton
        variant={variant ?? "outline"}
        {...props}
        className={className}
      >
        <Send />
        登录
      </IconButton>
    );
  } else {
    return (
      <IconButtonLink
        variant={variant ?? "outline"}
        icon={<SendHorizontal />}
        link="/auth/signin"
        scroll={false}
        label="登录"
      />
    );
  }
};

export const SignoutButton = (props: ButtonProps) => {
  return <IconButton {...props}>登出</IconButton>;
};

const UserInfo = (props: ButtonProps) => {
  return <Button></Button>;
};

export function AuthButton() {
  const { data: session, status } = useSession();
  const container = cn("flex", "justify-between", "w-fit", "gap-5");
  if (session && status == "authenticated") {
    return (
      <div className={container}>
        <Button variant="link">{session.user.name}</Button>
        <SignoutButton onClick={() => signOut()} />
      </div>
    );
  } else {
    return (
      <div className={container}>
        <SigninButton />
        <RegisterButton />
      </div>
    );
  }
}
