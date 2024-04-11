import { ChatHeader, ChatFooter, ChatProps } from "@/components/ui/ChatRoom";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      {children}
      <ChatFooter />
    </div>
  );
}
