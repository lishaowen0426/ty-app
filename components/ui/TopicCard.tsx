"use client";
import { Card } from "@/components/ui/card";
import { UserButton } from "./UserInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pagination } from "@nextui-org/pagination";

import { z } from "zod";

import { useState, useRef, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import classes from "@/components/style/TopicCard.module.css";
import {
  useInfiniteQuery,
  QueryFunctionContext,
  useQuery,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Topic as TopicProp } from "@prisma/client";
import { Media } from "@/components/Media";
import { VirtualItem } from "@tanstack/virtual-core";
import styled from "styled-components";
import { cn } from "@/lib/utils";

const TOPIC_PER_PAGE = 12;
const DOUBLE_WIDTH = "w-[800px]";
const TRIPLE_WIDTH = "w-[1200px]";
const TOPIC_PAGE_HEIGHT = "800"; // in pixel

export interface UserAvatarInfo {
  id: string;
  avatar: string | null;
}

export interface TopicWithAvatar extends TopicProp {
  avatar: string | null;
}

export const ContentCard = ({
  content,
  className,
  style,
}: {
  content: TopicWithAvatar | string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  if (typeof content == "string") {
    return (
      <div className={className} key={"0"}>
        {content}
      </div>
    );
  } else {
    return (
      <div
        className={`relative flex ${classes.topic} ${className} `}
        key={content.id}
        style={style}
        onClick={(ev: React.MouseEvent<HTMLDivElement>) => {
          ev.preventDefault();
          console.log(content);
        }}
      >
        {content.avatar && (
          <img
            src={`data:image/png;base64, ${content.avatar}`}
            className="h-[60px] max-w-[60px]  self-center"
          />
        )}
        <div className="grow-1 min-w-0 block">
          <h3 className="my-2">{content.topic}</h3>
          <span className="w-full text-gray-400  text-ellipsis inline-block overflow-hidden">
            {content.description}
          </span>
        </div>
        <div className={`w-full h-full grow-0 ${classes.overlay}`}></div>
      </div>
    );
  }
};

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
  from: number; //inclusive
  to: number; //exclusive
}

export interface TopicResponse {
  topics: TopicWithAvatar[];
}

const fetchTopic = async (
  ctx:
    | QueryFunctionContext<string[], TopicCursor>
    | { from: number; to: number }
): Promise<TopicResponse> => {
  let endpoint = "";
  if ("from" in ctx) {
    endpoint = `/api/chat?from=${ctx.from}&&to=${ctx.to}`;
  } else {
    endpoint = `/api/chat?from=${ctx.pageParam.from}&&to=${ctx.pageParam.to}`;
  }

  return fetch(endpoint, {
    method: "GET",
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(`fetch topic error ${resp.status}`);
    } else {
      return resp.json();
    }
  });
};

const VirtualItem = styled(ContentCard)<{ $item: VirtualItem }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.$item.size}px;
  transform: translateY(${(props) => props.$item.start}px);
  padding: 10px;
`;

const TopicScroll = ({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) => {
  const parent = useRef<HTMLDivElement>(null);
  const {
    status,
    data,
    error,
    isError,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: fetchTopic,
    initialPageParam: { from: 1, to: 1 + TOPIC_PER_PAGE },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (lastPageParam.to > topicCount) {
        return null;
      } else {
        return {
          from: lastPageParam.to,
          to: lastPageParam.to + TOPIC_PER_PAGE,
        };
      }
    },
  });

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
    topic?: TopicWithAvatar;
    text?: string;
  }) => {
    console.log(item);
    if (text) {
      return <VirtualItem content={text} $item={item} />;
    }

    if (topic) {
      return <VirtualItem content={topic} $item={item} />;
    }
  };

  if (isError) {
    console.log("hrtr");
    return <div>Fetch topic error...</div>;
  }

  return (
    <Card
      className={cn(
        "relative left-1/2 -translate-x-1/2 w-[350px] h-[700px] overflow-auto",
        className
      )}
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
            return <TopicRow item={item} text={text} key="0" />;
          } else {
            return (
              <TopicRow
                item={item}
                topic={allTopics[item.index]}
                key={allTopics[item.index].id}
              />
            );
          }
        })}
      </div>
    </Card>
  );
};

const PageContentCard = styled(ContentCard)<{
  $width: string;
  $height: string;
}>`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
`;
const TopicPage = ({
  topicCount,
  className,
}: {
  topicCount: number;
  className?: string;
}) => {
  const totalPage = Math.ceil(topicCount / TOPIC_PER_PAGE);

  const [currentPage, setPage] = useState(1);

  const topicPageQueryOptions = (page: number) => {
    return queryOptions({
      queryKey: ["topics", page],
      queryFn: () =>
        fetchTopic({
          from: 1 + (page - 1) * TOPIC_PER_PAGE,
          to: 1 + page * TOPIC_PER_PAGE,
        }),
      placeholderData: keepPreviousData,
      staleTime: 2 * 60 * 1000, //2 min
      gcTime: 5 * 60 * 1000,
    });
  };
  const {
    status,
    error,
    data,
    isPlaceholderData,
    isSuccess,
    isError,
    isFetching,
  } = useQuery(topicPageQueryOptions(currentPage));

  const displayTopic = (data: TopicResponse) => {
    return data.topics.map((t: TopicWithAvatar, i: number) => {
      return (
        <PageContentCard
          key={t.id}
          content={t}
          $width={className?.includes(DOUBLE_WIDTH) ? "50%" : "33.3333333%"}
          $height={className?.includes(DOUBLE_WIDTH) ? "16.66667%" : "25%"}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        className,
        "relative left-1/2 -translate-x-1/2 flex flex-col gap-4"
      )}
    >
      <Card
        className={cn(
          `relative  flex flex-wrap justify-start items-start gap-x-0`,
          status == "pending" || isPlaceholderData ? "opacity-30" : "",
          className,
          `left-1/2 -translate-x-1/2 h-[700px]`
        )}
      >
        {isSuccess && displayTopic(data)}
        {isError && <div>error</div>}
      </Card>

      <div className={cn("flex flex-row justify-between")}>
        <Pagination
          showControls
          total={totalPage}
          className={cn(className, "w-fit relative left-1/2 -translate-x-1/2")}
          page={currentPage}
          onChange={setPage}
        />
        <UserButton className={cn(className)} />
      </div>
    </div>
  );
};

const TopicContainer = ({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) => {
  return (
    <div className={className}>
      <Media at="sm">
        {(className) => {
          return <TopicScroll className={className} topicCount={topicCount} />;
        }}
      </Media>
      <Media at="md">
        {(className) => {
          return (
            <TopicPage
              topicCount={topicCount}
              className={cn(className, DOUBLE_WIDTH)}
            />
          );
        }}
      </Media>
      <Media greaterThanOrEqual="lg">
        {(className) => {
          return (
            <TopicPage
              topicCount={topicCount}
              className={cn(className, TRIPLE_WIDTH)}
            />
          );
        }}
      </Media>
    </div>
  );
};

export default function TopicCard({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) {
  return <TopicContainer className={className} topicCount={topicCount} />;
}
