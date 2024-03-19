import TopicCardNoSSR from "@/components/ui/TopicCardNoSSR";
import { UserInfo } from "@/components/ui/UserInfo";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const Header = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between m-[2rem]">
      <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
      <UserInfo />
    </div>
  );
};

const refreshTopics = unstable_cache(
  async () => {
    console.log("refresh topics view");
    await prisma.$executeRaw`REFRESH MATERIALIZED VIEW "TopicByCreationDate"`;
    return prisma.$queryRaw`SELECT count(*)::text FROM "TopicByCreationDate"`;
  },
  ["refresh-topic"],
  {
    revalidate: 10, //seconds
  }
);

export default async function Dashboard() {
  const topicCount = (await refreshTopics()) as { count: string }[];
  return (
    <div className="h-full flex flex-col justify-start">
      <Header title="聊天室" />
      <TopicCardNoSSR className="" topicCount={parseInt(topicCount[0].count)} />
    </div>
  );
}
