"use client";
import Image from "next/image";
import avatar from "@/public/email-sent.png";
import { IconButton } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
export default function EmailSent() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-start">
      <div className="relative top-[240px]">
        <Image
          src={avatar.src}
          alt="sent avatar"
          width={380}
          height={360}
          priority={true}
          className="mt-[15px] mx-auto "
        />
        <div className="relative top-[90px] space-y-[10px]">
          <h1 className="ml-[20px] text-home-heading font-bold text-4xl">
            欢迎加入距离!
          </h1>
          <h1 className="ml-[20px]">请检查邮箱</h1>
          <IconButton
            className="bg-home-button rounded-full relative top-[40px] ml-auto mr-[30px]"
            onClick={() => {
              router.push("/");
            }}
          >
            <ChevronRight size={50} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
