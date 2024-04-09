import ChatRoom from "@/components/ui/ChatRoom";
export default function TopicRoom({ params }: { params: { id: string } }) {
  return <ChatRoom className="flex-1" id={params.id} />;
}
