import { Button } from "@/components/ui/button";
import { lorem } from "@/lib/utils";
import Link from "next/link";
import avatar from "@/asset/home-avatar.png";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="">
        <img
          src={avatar.src}
          alt="home avatar"
          className="h-[380px] w-[380px] mt-[15px] mx-auto"
        />
        <h1 className="w-[11.25rem] ml-[24px] text-home-heading font-bold text-4xl mb-[20px]">
          探索你身边发生的事
        </h1>
        <p className="ml-[24px] mr-[24px] ">{lorem.generateSentences(2)}</p>
      </div>
      <Button
        variant="pink"
        className="w-[150px] h-[2.5rem] mx-auto mb-[80px]"
        asChild
      >
        <Link href="/started">开始</Link>
      </Button>
    </div>
  );
}
