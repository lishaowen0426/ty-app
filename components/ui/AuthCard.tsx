import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export type AuthCardProps = ComponentPropsWithRef<"div">;

export default function AuthCard({ className, ...props }: AuthCardProps) {
  return (
    <Card
      className={cn("w-[20rem] h-[450px] overflow-y-scroll", className)}
      {...props}
    />
  );
}
