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

const fetchTopicCategories = unstable_cache(
  async () => {
    return prisma.topicCategory.findMany({ select: { category: true } });
  },
  ["topic-category"],
  { tags: ["topic-category"], revalidate: false }
);

const ClientTopicCard = dynamic(() => import("./TopicCard"), {
  ssr: false,
});

const TopicCardNoSSR = async ({ className }: { className?: string }) => {
  const topicCount = (await refreshTopics()) as { count: string }[];
  const topicCategory = await fetchTopicCategories();
  return (
    <ClientTopicCard
      className={className}
      topicCount={parseInt(topicCount[0].count)}
      topicCategory={topicCategory.map((r) => r.category)}
    />
  );
};

export default TopicCardNoSSR;
