"use client";
import { useRouter } from "next/navigation";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  console.log("error");
  router.push("/home/dashboard");
}
