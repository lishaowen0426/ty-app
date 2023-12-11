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
  return <Card className={cn("overflow-y-auto", className)} {...props} />;
}
