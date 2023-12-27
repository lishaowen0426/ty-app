"use client";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SigninPopup } from "@/components/ui/Popup";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailForm } from "@/components/ui/Email";

type authError =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "Default"
  | null;

const ErrorCard = ({ error }: { error?: authError }) => {
  const VerificationContent = ({ className }: { className?: string }) => {
    const B = (
      <Button className={cn("bg-black text-white w-[80%]", className)}>
        重新登陆
      </Button>
    );
    return <SigninPopup className="w-[20rem]">{B}</SigninPopup>;
  };
  return (
    <Card className="absolute w-[80%] h-[30%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <CardHeader className="space-y-3">
        <CardTitle>验证失败</CardTitle>
        <CardDescription className="">
          链接已过期或已被使用，请重新请求链接
        </CardDescription>
      </CardHeader>
      <div className="flex justify-center">
        <Separator className="w-[95%]" />
      </div>
      <CardContent className="flex justify-center mt-[10%]">
        <VerificationContent className="" />
      </CardContent>
    </Card>
  );
};
export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as authError;
  return <ErrorCard />;
}
