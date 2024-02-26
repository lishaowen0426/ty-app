"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useRef, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { use } from "react";
import classes from "@/components/style/TopicCard.module.css";
import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Topic as TopicProp } from "@prisma/client";
import { Media } from "@/components/Media";
import { InfiniteData } from "@tanstack/query-core";
import { VirtualItem } from "@tanstack/virtual-core";
import styled from "styled-components";

const FETCH_TOPIC_LIMIT = 12;

export interface TopicProps {
  id: string;
  topic: string;
  description?: string;
  distance: number;
  created: Date;
  participants: number;
}

interface TopicList {
  items: React.ReactNode[];
  hasMore: boolean;
}

const mockTopic: TopicProps = {
  id: "7263",
  topic: "一起吃饭吧",
  distance: 256,
  description:
    "仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐仅限西餐",
  created: new Date(2023, 12, 11, 19, 40, 35),
  participants: 1762,
};

/*
export const Topic = (
  props: TopicProp,
  router: ReturnType<typeof useRouter>
) => {
  return (
    <Card
      key={Math.floor(Math.random())}
      className="flex h-20 justify-between w-[360px]"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();

        router.push("/home/room/" + props.id);
      }}
    >
      <Avatar className="h-10 translate-y-5 flex-none ml-[0.25rem]">
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
      <div className="ml-4 mt-[1.2rem] space-y-2 flex-grow max-w-[10rem]">
        <p className="text-lg font-bold leading-none">{props.topic}</p>
        {props.description && (
          <p className="text-sm text-black/40 overflow-x-auto  whitespace-nowrap">
            {props.description}
          </p>
        )}
      </div>
      <div className="flex-none mt-[1.2rem] mr-2 text-xs text-black/40">
        <p className="">距离：{props.distance}米</p>
        <p className="">在线人数:{props.participants}</p>
        <p className="">
          创建于:
          {formatDistanceToNow(props.created, {})}
        </p>
      </div>
    </Card>
  );
};
*/

const TopicHeader = () => {
  const SelectDistance = ({ className }: { className?: string }) => {
    return (
      <Select>
        <SelectTrigger className={className}>
          <SelectValue placeholder="距离我" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="500">500米</SelectItem>
          <SelectItem value="1000">1000米</SelectItem>
          <SelectItem value="5000">5000米</SelectItem>
          <SelectItem value="0">任意</SelectItem>
        </SelectContent>
      </Select>
    );
  };
  return (
    <div className="w-full flex justify-between mb-1 mt-1 max-h-12">
      <div className="flex space-x-2  ">
        <Input type="text" placeholder="话题" className="w-[6rem] h-[80%]" />
        <Button variant="outline" className=" h-[80%]">
          <Search size="16" />
        </Button>
      </div>
      <SelectDistance className="w-[7rem] max-h-12" />
    </div>
  );
};

export interface TopicCursor {
  last_id: number;
  limit: number;
}

export interface TopicResponse {
  last_id: number;
  topics: TopicProp[];
}

const fetchTopic = async (
  ctx: QueryFunctionContext<string[], TopicCursor>
): Promise<TopicResponse> => {
  const { last_id, limit } = ctx.pageParam;

  /*
  const response = await fetch(`/api/chat?lastid=${last_id}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
  */
  await new Promise((r) => setTimeout(r, 500));
  const topics = new Array(limit).fill(mockTopic);
  return { last_id: last_id + limit, topics: topics };
};

const TopicScroll = ({
  query,
  className,
}: {
  query: ReturnType<
    typeof useInfiniteQuery<
      TopicResponse,
      Error,
      InfiniteData<TopicResponse, unknown>,
      string[],
      {
        last_id: number;
        limit: number;
      }
    >
  >;
  className?: string;
}) => {
  const parent = useRef<HTMLDivElement>(null);
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = query;

  const allTopics = data
    ? data.pages.flatMap((res: TopicResponse) => res.topics)
    : [];

  const topicVirtualizer = useVirtualizer({
    count: hasNextPage ? allTopics.length + 1 : allTopics.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...topicVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allTopics.length - 1 && //the loader row is currently rendered
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    allTopics.length,
    isFetchingNextPage,
    fetchNextPage,
    topicVirtualizer.getVirtualItems(),
  ]);

  const TopicRow = ({
    item,
    topic,
    text,
  }: {
    item: VirtualItem;
    topic?: TopicProp;
    text?: string;
  }) => {
    const VirtualItem = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${item.size}px;
      transform: translateY(${item.start}px);
      padding: 10px;
    `;

    if (text) {
      const TextItem = styled(VirtualItem)``;
      return <TextItem>{text}</TextItem>;
    }

    if (topic) {
      const TopicItem = styled(VirtualItem)`
        &:hover {
          background-color: rgb(243 244 246);
        }
        display: flex;
      `;
      return <TopicItem>{topic.topic}</TopicItem>;
    }
  };

  return (
    <Card
      className="relative left-1/2 -translate-x-1/2 w-[300px] h-[700px] overflow-auto"
      ref={parent}
    >
      <div
        style={{
          height: `${topicVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {topicVirtualizer.getVirtualItems().map((item) => {
          const isLoaderRow = item.index > allTopics.length - 1;

          const text = isLoaderRow
            ? hasNextPage
              ? "加载更多话题"
              : "没有更多话题"
            : undefined;
          if (text) {
            return <TopicRow item={item} text={text} />;
          } else {
            return <TopicRow item={item} topic={allTopics[item.index]} />;
          }
        })}
      </div>
    </Card>
  );
};

const TopicPage = ({
  query,
  className,
}: {
  query: ReturnType<
    typeof useInfiniteQuery<
      TopicResponse,
      Error,
      InfiniteData<TopicResponse, unknown>,
      string[],
      {
        last_id: number;
        limit: number;
      }
    >
  >;
  className?: string;
}) => {
  const [currentPage, setPage] = useState(1);

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = query;

  const allTopics = data ? data.pages : [];

  const PageItem = ({ p }: { p: number }) => {
    return (
      <PaginationItem>
        <PaginationLink>{p}</PaginationLink>
      </PaginationItem>
    );
  };
  return (
    <>
      <Card className="relative left-1/2 -translate-x-1/2 w-[1200px] h-[400px] mb-3 flex flex-wrap justify-evenly"></Card>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="上一页" />
          </PaginationItem>
          <PageItem p={1} />
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="下一页" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

const TopicContainer = ({ className }: { className?: string }) => {
  const query = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: fetchTopic,
    initialPageParam: { last_id: 0, limit: FETCH_TOPIC_LIMIT },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (lastPage.last_id == lastPageParam.last_id) {
        return null;
      } else {
        return { last_id: lastPage.last_id, limit: lastPageParam.limit };
      }
    },
  });
  return (
    <div className={className}>
      <Media at="sm" className="h-full">
        <TopicScroll query={query} />
      </Media>
      <Media at="lg" className="h-full">
        <TopicPage query={query} />
      </Media>
    </div>
  );
};

export default function TopicCard({ className }: { className?: string }) {
  return <TopicContainer className={className} />;
}
