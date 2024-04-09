"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMediaQuery } from "@uidotdev/usehooks";
import { UserButton } from "./UserInfo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Pagination } from "@nextui-org/pagination";
import { useRouter } from "next/navigation";

import { useForm, useFieldArray } from "react-hook-form";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { VirtualItem } from "@tanstack/virtual-core";
import styled from "styled-components";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const TOPIC_PER_PAGE = 12;
const DOUBLE_WIDTH = "w-[800px]";
const TRIPLE_WIDTH = "w-[1200px]";

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
  router,
  style,
}: {
  content: TopicWithAvatar | string;
  className?: string;
  style?: React.CSSProperties;
  router: ReturnType<typeof useRouter>;
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
        className={cn(
          `flex ${classes.topic} ${className}`,
          "bg-white rounded-xl shadow-secondary outline-4 outline-secondary outline"
        )}
        key={content.id}
        style={style}
        onClick={(ev: React.MouseEvent<HTMLDivElement>) => {
          ev.preventDefault();
          console.log(content);
          router.push(`/topics/${content.id}`);
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
        <div
          className={cn(
            `w-full h-full grow-0 ${classes.overlay}`,
            "rounded-xl"
          )}
        ></div>
      </div>
    );
  }
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
    endpoint = `/api/topic?from=${ctx.from}&&to=${ctx.to}`;
  } else {
    endpoint = `/api/topic?from=${ctx.pageParam.from}&&to=${ctx.pageParam.to}`;
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
`;

const TopicScroll = ({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) => {
  const parent = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
    if (text) {
      return <VirtualItem content={text} $item={item} router={router} />;
    }

    if (topic) {
      return <VirtualItem content={topic} $item={item} router={router} />;
    }
  };

  if (isError) {
    return <div>Fetch topic error...</div>;
  }

  return (
    <div
      id="scroll-topic-container"
      className={classes.scroller + " " + cn("overflow-auto", className)}
      ref={parent}
    >
      <div
        style={{
          height: `${topicVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
        className="bg-secondary"
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
    </div>
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
  const router = useRouter();
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
          router={router}
          $width={className?.includes(DOUBLE_WIDTH) ? "50%" : "33.3333333%"}
          $height={className?.includes(DOUBLE_WIDTH) ? "16.66667%" : "25%"}
        />
      );
    });
  };

  return (
    <>
      <Card
        className={cn(
          "relative  flex flex-wrap justify-start items-start gap-x-0 w-full",
          status == "pending" || isPlaceholderData ? "opacity-30" : "",
          className,
          `h-[700px]`
        )}
      >
        {isSuccess && displayTopic(data)}
        {isError && <div>error</div>}
      </Card>

      <div className={cn("flex flex-row justify-between mt-2")}>
        <Pagination
          showControls
          total={totalPage}
          className={cn(className, "w-fit relative left-1/2 -translate-x-1/2")}
          page={currentPage}
          onChange={setPage}
        />
        <UserButton className={cn(className)} />
      </div>
    </>
  );
};

const TopicFilter = ({
  className,
  topicCategory,
}: {
  className?: string;
  topicCategory: string[];
}) => {
  type FilterValues = {
    category: { category: string }[];
    until: Date;
    distance: number;
  };
  const { control, handleSubmit } = useForm<FilterValues>({
    defaultValues: {
      category: [],
    },
  });
  const { fields } = useFieldArray({
    name: "category",
    control: control,
  });

  const filterSubmit = (data: FilterValues) => {
    console.log(data);
  };
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className={cn(className, "mb-2 text-sm")}>
          <Search className="mr-2" size="20px" />
          过滤话题
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className={cn(className, "h-[150px] mb-2")}>
          <CardContent>
            <form onSubmit={handleSubmit(filterSubmit)}></form>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

const TopicContainer = ({
  className,
  topicCount,
  topicCategory,
}: {
  className?: string;
  topicCount: number;
  topicCategory: string[];
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 800px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 801px) and (max-width : 1200px)"
  );

  if (isSmallDevice) {
    return <TopicScroll className={className} topicCount={topicCount} />;
  } else if (isMediumDevice) {
    return (
      <div
        id="page-topic-container"
        className={cn(DOUBLE_WIDTH, "flex flex-col container")}
      >
        <TopicFilter topicCategory={topicCategory} />
        <TopicPage topicCount={topicCount} className={cn(className)} />
      </div>
    );
  } else {
    return (
      <div
        id="page-topic-container"
        className={cn(TRIPLE_WIDTH, "flex flex-col container")}
      >
        <TopicFilter topicCategory={topicCategory} />
        <TopicPage topicCount={topicCount} className={cn(className)} />
      </div>
    );
  }
};

export default function TopicCard({
  className,
  topicCount,
  topicCategory,
}: {
  className?: string;
  topicCount: number;
  topicCategory: string[];
}) {
  return (
    <TopicContainer
      className={className}
      topicCount={topicCount}
      topicCategory={topicCategory}
    />
  );
}
