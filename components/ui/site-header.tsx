"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify, Settings } from "lucide-react";
import { forwardRef } from "react";

const HeaderButton = forwardRef(
  (props: { children: React.ReactNode }, _: any) => {
    return (
      <div className="header-button flex w-[50px] h-[50px] border-[1.5px] border-solid  rounded-full">
        {props.children}
      </div>
    );
  }
);

export default function SiteHeader() {
  return (
    <header
      id="site-header"
      className="container px-[1rem] pt-[20px] w-full flex justify-between"
    >
      <Sheet>
        <SheetTrigger asChild>
          <HeaderButton>
            <AlignJustify size={28} className="block m-auto" stroke="#636265" />
          </HeaderButton>
        </SheetTrigger>
      </Sheet>
      <div className="mx-auto text-header-title mt-[10px] font-semibold text-2xl">
        距离
      </div>
      <HeaderButton>
        <Settings
          size={28}
          className="block m-auto"
          fill="none"
          stroke="#636265"
        />
      </HeaderButton>
    </header>
  );
}
