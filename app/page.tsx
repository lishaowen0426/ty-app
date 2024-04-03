import { EmailForm } from "@/components/ui/Email";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ui/site-header";

export function TopicsAroundMe({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={cn(className)}>
      寻找身边的话题
    </Button>
  );
}

export default function Home() {
  return (
    <>
      <div className="sticky w-fit top-0 ml-auto mr-[10px]">
        <ModeToggle />
      </div>
      <div className="relative top-[80px] w-fit  mx-[auto] flex flex-col  items-center sm:flex-row sm:justify-start   sm:top-[200px] sm:mx-auto ">
        <TopicsAroundMe className="hidden sm:block w-[150px]" />
        <div className="hidden sm:block w-[20%] max-w-[450px] min-w-[200px]"></div>
        <Card className="w-[350px] max-w-[90%] min-w-[200px] dark:bg-background">
          <CardHeader className="hidden border-solid border-zinc-300 border-b-2 mb-4 ml-3 mr-3 pb-4">
            <CardTitle>登陆</CardTitle>
          </CardHeader>
          <CardContent className="mt-[30px]">
            <EmailForm />
          </CardContent>
        </Card>
        <Separator className="sm:hidden bg-black/30 my-[30px] w-[350px] max-w-[90%] min-w-[200px]" />

        <TopicsAroundMe className="sm:hidden relative top-[20px]" />
      </div>
    </>
  );
}
