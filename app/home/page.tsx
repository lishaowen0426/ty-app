import { IconButtonLink } from "@/components/ui/AuthButton";
import { Send, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import BubbleList from "@/components/ui/Bubble";
import { BubbleComponentNoSSR } from "@/components/ui/BubbleWrapper";
import { motion } from "framer-motion";
import EnterButton from "@/components/EnterButton";

export default function Home() {
  return (
    <div className="h-full w-full  relative">
      <BubbleComponentNoSSR className="ml-[1rem] mr-[1rem] mt-5" />
      <EnterButton />
    </div>
  );
}
