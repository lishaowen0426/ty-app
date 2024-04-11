"use client";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import Link from "next/link";
import { MessageCircle, Home, AlignJustify, ChevronRight } from "lucide-react";
import { Button } from "./button";
import footer from "@/asset/footer.png";

const FooterLinks: {
  category: string;
  links: { name: string; dest: string }[];
}[] = [
  { category: "产品", links: [{ name: "下载", dest: "#" }] },
  { category: "公司", links: [{ name: "介绍", dest: "#" }] },
  { category: "政策", links: [{ name: "法律责任", dest: "#" }] },
  { category: "其他", links: [{ name: "帮助", dest: "#" }] },
];

type svgprops = React.ComponentPropsWithoutRef<"svg">;

const BottomNavi: {
  icon: React.FunctionComponent<
    React.ComponentPropsWithoutRef<"svg"> & { size?: string | number }
  >;
  dest: string;
  name: string;
}[] = [
  {
    icon: (props) => <Home {...props} />,
    dest: "#",
    name: "主页",
  },
  {
    icon: (props) => <AlignJustify {...props} />,
    dest: "/topics",
    name: "话题",
  },
  {
    icon: (props) => <MessageCircle {...props} />,
    dest: "#",
    name: "聊天",
  },
  {
    icon: (props) => <ChevronRight {...props} />,
    dest: "#",
    name: "更多",
  },
];

export default function SiteFooter() {
  return (
    <footer id="site-footer" className="flex w-full px-[20px] justify-between">
      {BottomNavi.map((item, index) => (
        <item.icon className="block m-auto" size={26} key={index} />
      ))}
    </footer>
  );
}
