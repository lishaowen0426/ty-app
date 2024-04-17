"use client";
import Image from "next/image";
import avatar from "@/public/email-verified.png";
import { IconButton } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
export default function EmailSent() {
  const router = useRouter();
  return (
    <>
      <Image
        src={avatar.src}
        alt="email verified"
        width={380}
        height={380}
        priority={true}
        className="mt-[15px] mx-auto "
      />
      <div className="relative top-[90px] space-y-[10px]">
        <h1 className="ml-[20px] text-home-heading font-bold text-4xl">
          邮箱已完成验证！
        </h1>
        <IconButton
          className="bg-home-button  relative top-[40px] ml-auto mr-[30px] flex items-center pr-[10px]"
          onClick={() => {
            router.push("/topics");
          }}
        >
          <ChevronRight size={50} />
          <span className="font-bold text-xl inline-block ">进入</span>
        </IconButton>
      </div>
    </>
  );
}
