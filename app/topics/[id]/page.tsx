import { ChatRoom, ChatHeader, ChatProps } from "@/components/ui/ChatRoom";
import { get } from "http";
import { LoremIpsum } from "lorem-ipsum";

const ChatLorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 3,
    min: 1,
  },
  wordsPerSentence: {
    max: 10,
    min: 3,
  },
});

async function getChat(id: string): Promise<ChatProps> {
  return {
    id: id,
    name: ChatLorem.generateSentences(1),
    members: 128,
    online: 65,
  };
}
export default async function TopicRoom({
  params,
}: {
  params: { id: string };
}) {
  const chat = await getChat(params.id);
  return (
    <>
      <ChatHeader {...chat} />
      <ChatRoom {...chat} />
    </>
  );
}
