import { IconButtonLink } from "@/components/ui/AuthButton";
import { Send, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const EnterButton = ({ className }: { className?: string }) => {
  return (
    <IconButtonLink
      icon={<Send />}
      link="/auth/signin"
      label="开始使用"
      scroll={false}
      className={className}
    />
  );
};
export default function Home() {
  return (
    <div className="h-full w-full  relative">
      <EnterButton className="bg-black text-white absolute top-2/3 left-1/2 -translate-x-1/2" />
    </div>
  );
}
