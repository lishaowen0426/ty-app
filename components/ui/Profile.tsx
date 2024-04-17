"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
export default function ProfileCard({ mode }: { mode: "create" | "edit" }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return <div>{email}</div>;
}
