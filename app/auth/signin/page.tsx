"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";

export default function Sign() {
  return (
    <Button
      onClick={async () => {
        await signIn("credentials", {
          phone: "133",
          password: "133",
          redirect: true,
          callbackUrl: "/home",
        });
      }}
    >
      hello
    </Button>
  );
}
