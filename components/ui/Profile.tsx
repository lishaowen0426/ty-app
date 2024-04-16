"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
export default function ProfileCard({ mode }: { mode: "create" | "edit" }) {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  console.log(searchParams.entries);
  return <div>{email}</div>;
}
