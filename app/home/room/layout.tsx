import { Suspense } from "react";
export default function ChatroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<p>wait....</p>}>{children}</Suspense>;
}
