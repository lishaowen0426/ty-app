"use client";
import Image, { StaticImageData } from "next/image";
import sent from "@/public/email-sent.png";
import verified from "@/public/email-verified.png";
import invalid from "@/public/email-invalid.png";
import { IconButton } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateAspectRatioFit } from "@/lib/utils";

type InfoContent = {
  image: {
    data: StaticImageData;
    alt: string;
  };
  h1?: string;
  h2?: string;
  dest: string;
};

type Categoty = "sent" | "verified" | "invalid";

const ImageMaxDimension = {
  width: 380,
  height: 380,
};

const Content: { [category in Categoty]: InfoContent } = {
  sent: {
    image: {
      data: sent,
      alt: "email sent",
    },
    h1: "欢迎加入距离!",
    h2: "链接已经发送到邮箱，请进行验证",
    dest: "/",
  },
  verified: {
    image: {
      data: verified,
      alt: "email verified",
    },
    h1: "邮箱已完成验证",
    dest: "/topics",
  },
  invalid: {
    image: {
      data: invalid,
      alt: "link invalid",
    },
    h1: "链接失效或过期",
    h2: "请重新注册",
    dest: "/",
  },
};

const invalidInfo: { [index: string]: { h1?: string; h2?: string } } = {
  link: {
    h1: "链接失效或过期",
    h2: "请重新注册",
  },
  exist: {
    h1: "用户已完成注册",
  },
  nonexist: {
    h1: "用户尚未注册",
  },
  internal: {
    h1: "服务器内部错误",
  },
};

export default function InfoPage({
  params,
}: {
  params: { category: Categoty };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const item = Content[params.category];

  const h = searchParams.get("h");
  const hh = h ? invalidInfo[h] : undefined;

  return (
    <>
      <Image
        src={item.image.data.src}
        alt={item.image.alt}
        priority={true}
        className="mt-[15px] mx-auto"
        {...calculateAspectRatioFit(
          item.image.data.width,
          item.image.data.height,
          ImageMaxDimension.width,
          ImageMaxDimension.height
        )}
      />
      <div className="relative top-[90px] space-y-[10px]">
        <h1 className="ml-[20px] text-home-heading font-bold text-4xl">
          {hh?.h1 ?? item.h1}
        </h1>
        <h1 className="ml-[20px]">{hh?.h2 ?? item.h2}</h1>
        <IconButton
          className="bg-home-button rounded-full relative top-[40px] ml-auto mr-[30px]"
          onClick={() => {
            router.push(item.dest);
          }}
        >
          <ChevronRight size={50} />
        </IconButton>
      </div>
    </>
  );
}
