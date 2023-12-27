import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmailForm } from "@/components/ui/Email";
import { ChatForm } from "./ChatForm";
export default function Popup({
  children,
  className,
  form,
  title,
  desc,
}: {
  children: React.ReactNode;
  className?: string;
  form: React.ReactNode;
  title: String;
  desc: String;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
}
export function SigninPopup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>有想分享的吗？</DialogTitle>
          <DialogDescription>登陆并创建你的话题！</DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    </Dialog>
  );
}

export function ChatPopup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>有想分享的吗？</DialogTitle>
          <DialogDescription>创建你的话题！</DialogDescription>
        </DialogHeader>
        <ChatForm />
      </DialogContent>
    </Dialog>
  );
}
