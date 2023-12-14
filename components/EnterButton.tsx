"use client";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const copy = "bg-black text-white absolute top-2/3 left-1/2 -translate-x-1/2";

export default function EnterButton({ className }: { className?: string }) {
  const { data: session, status, update } = useSession();

  console.log(session);
  console.log(status);

  const router = useRouter();
  const variants = {
    init: {
      x: "0",
    },
    show: {
      x: "calc(50vw - 4rem)",
    },
  };
  return (
    <motion.button
      className={cn(
        buttonVariants({ variant: "outline" }),
        "gap-4",
        "w-[8rem]",
        "bg-black text-white",
        className
      )}
      onClick={() => {
        router.push("/auth/signin");
      }}
      variants={variants}
      initial="init"
      animate="show"
      transition={{ duration: 1 }}
    >
      <Send />
      开始使用
    </motion.button>
  );
}
