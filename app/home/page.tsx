import { IconButtonLink } from "@/components/ui/AuthButton";
import { Send, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import BubbleList from "@/components/ui/Bubble";
import { motion } from "framer-motion";
import EnterButton from "@/components/EnterButton";

const EnterButto = ({ className }: { className?: string }) => {
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
      <BubbleList className="ml-[1rem] mr-[1rem] mt-5" />
      <EnterButton />
    </div>
  );
}
