import dynamic from "next/dynamic";

const ClientTopicCard = dynamic(() => import("./TopicCard"), {
  ssr: false,
  loading: () => <p>加载中</p>,
});

const TopicCardNoSSR = ({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) => <ClientTopicCard className={className} topicCount={topicCount} />;

export default TopicCardNoSSR;
