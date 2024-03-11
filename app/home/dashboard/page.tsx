import TopicCardNoSSR from "@/components/ui/TopicCardNoSSR";
import { UserInfo, UserButton } from "@/components/ui/UserInfo";
import prisma from "@/lib/prisma";

export const Header = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between m-[2rem]">
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <UserInfo />
    </div>
  );
};

async function getTopics() {
  const topicCount = await prisma.topic.count();
  return topicCount;
}

export default async function Dashboard() {
  const topicCount = await getTopics();
  return (
    <div className="h-full flex flex-col justify-start">
      <Header title="聊天室" />
      <TopicCardNoSSR className="" topicCount={topicCount} />
    </div>
  );
}
