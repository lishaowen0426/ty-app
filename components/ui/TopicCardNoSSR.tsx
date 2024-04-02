import dynamic from "next/dynamic";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

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

const ClientTopicCard = dynamic(() => import("./TopicCard"), {
  ssr: false,
});

const TopicCardNoSSR = async ({ className }: { className?: string }) => {
  const topicCount = (await refreshTopics()) as { count: string }[];
  return (
    <ClientTopicCard
      className={className}
      topicCount={parseInt(topicCount[0].count)}
    />
  );
};

export default TopicCardNoSSR;
