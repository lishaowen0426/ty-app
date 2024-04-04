import { Icons } from "./icons";
import Link from "next/link";

const FooterLinks: {
  category: string;
  links: { name: string; dest: string }[];
}[] = [
  { category: "产品", links: [{ name: "下载", dest: "#" }] },
  { category: "公司", links: [{ name: "介绍", dest: "#" }] },
  { category: "政策", links: [{ name: "法律责任", dest: "#" }] },
  { category: "其他", links: [{ name: "帮助", dest: "#" }] },
];

export default function SiteFooter() {
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
