"use client";
import { EmailForm } from "@/components/ui/Email";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function TopicsAroundMe({ className }: { className?: string }) {
  return (
    <Button asChild variant="outline" className={cn(className)}>
      <Link href="/topics">寻找身边的话题</Link>
    </Button>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  } else if (status === "authenticated") {
    return (
      <div className="text-center">
        <TopicsAroundMe className="mt-[250px]" />
      </div>
    );
  } else {
    return (
      <div className="mt-[80px] w-fit  mx-[auto] flex-1 flex flex-col  items-center sm:flex-row sm:justify-start sm:mt-[200px]">
        <TopicsAroundMe className="hidden sm:block w-fit" />
        <div className="hidden sm:block w-[20%] max-w-[450px] min-w-[200px]"></div>
        <div className="w-[350px] max-w-[90%] min-w-[200px] dark:bg-background">
          <Card className="w-full">
            <CardContent className="mt-[30px]">
              <EmailForm callbackUrl="/topics" />
            </CardContent>
          </Card>
          <Separator className="sm:hidden bg-black/30 mt-[30px] w-full" />
        </div>
        <TopicsAroundMe className="sm:hidden mt-[50px]" />
      </div>
    );
  }
}
