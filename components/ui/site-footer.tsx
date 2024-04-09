"use client";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import Link from "next/link";
import { MessageCircle, Home, AlignJustify, ChevronRight } from "lucide-react";
import { Button } from "./button";

const FooterLinks: {
  category: string;
  links: { name: string; dest: string }[];
}[] = [
  { category: "产品", links: [{ name: "下载", dest: "#" }] },
  { category: "公司", links: [{ name: "介绍", dest: "#" }] },
  { category: "政策", links: [{ name: "法律责任", dest: "#" }] },
  { category: "其他", links: [{ name: "帮助", dest: "#" }] },
];

const BottomNavi: {
  icon?: React.FunctionComponent<{ className?: string }>;
  dest: string;
  name: string;
}[] = [
  {
    icon: ({ className }: { className?: string }) => (
      <Home className={className} />
    ),
    dest: "#",
    name: "主页",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <AlignJustify className={className} />
    ),
    dest: "/topics",
    name: "话题",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <MessageCircle className={className} />
    ),
    dest: "#",
    name: "聊天",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <ChevronRight className={className} />
    ),
    dest: "#",
    name: "更多",
  },
];

export default function SiteFooter() {
  const path = usePathname();

  if (path !== "/") {
    return (
      <footer
        id="bottom-navi"
        className="w-full    container flex flex-row justify-between"
      >
        {BottomNavi.map((item, index) => (
          <div key={`bottom-navi-${index}`} className="flex flex-col gap-1">
            {item.icon && <item.icon />}
            {item.name}
          </div>
        ))}
      </footer>
    );
  } else {
    return (
      <footer className="w-full bg-foreground text-background/70   min-h-[180px] flex flex-col sm:flex-row">
        <div
          id="footer-logo"
          className="flex items-center  space-x-[10px] w-full sm:w-[180px] mt-[30px] sm:mt-0"
        >
          <Icons.logo className="h-[60px] w-[80px]" />
          <span className="font-bold inline-block text-2xl w-[60px]">距离</span>
        </div>
        <div
          id="footer-link"
          className="flex  flex-wrap ml-[19px] mt-[20px] gap-y-[20px]  sm:flex-nowrap sm:grow sm:mt-0 sm:ml-0 max-w-[1080px] mb-[30px]"
        >
          {FooterLinks.map((item, index) => {
            return (
              <div
                key={index}
                className="flex-none basis-2/4 sm:grow sm:basis-0  flex flex-col sm:mt-[50px] sm:ml-[50px]"
              >
                <h3 className="font-semibold text-sm">{item.category}</h3>
                {item.links.map((link, index) => {
                  return (
                    <Link
                      key={index}
                      href={link.dest}
                      className="text-xs opacity-80"
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </footer>
    );
  }
}
