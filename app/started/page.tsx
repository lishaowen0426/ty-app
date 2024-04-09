"use client";
import { Login, SignUp, DisplayState } from "@/components/ui/LoginForm";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GetStarted() {
  const [display, setDisplay] = useState<DisplayState>({
    login: true,
    signup: false,
  });

  return (
    <div>
      <h1 className="text-home-heading font-bold text-3xl w-fit leading-6 mx-auto mt-[140px]">
        欢迎来到距离!
      </h1>
      <Login
        setDisplay={setDisplay}
        className={cn(
          "mt-[100px] w-[330px] max-w-[90vw] mx-auto",
          display.login ? "" : "hidden"
        )}
      />
      <SignUp
        setDisplay={setDisplay}
        className={cn(
          "mt-[100px] w-[330px] max-w-[90vw] mx-auto",
          display.signup ? "" : "hidden"
        )}
      />
    </div>
  );
}
