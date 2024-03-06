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

import { z } from "zod";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import classes from "@/components/style/TopicCard.module.css";
import { Fragment, Suspense, use } from "react";
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
import { InfiniteData } from "@tanstack/query-core";
import { VirtualItem } from "@tanstack/virtual-core";
import styled from "styled-components";
import { cn } from "@/lib/utils";

const TOPIC_PER_PAGE = 12;

export interface UserAvatarInfo {
  id: string;
  avatar: string | null;
}

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
  hasMore: boolean;
}

const fetchTopic = async (
  ctx: QueryFunctionContext<string[], TopicCursor>
): Promise<TopicResponse> => {
  const { last_id, limit } = ctx.pageParam;

  const response = await fetch(`/api/chat?lastid=${last_id}&limit=${limit}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
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
  topicCount,
  className,
}: {
  topicCount: number;
  className?: string;
}) => {
  const totalPage = Math.ceil(topicCount / TOPIC_PER_PAGE);

  const [currentPage, setPage] = useState(1);
  const [enterBefore, setEnterBefore] = useState(false);
  const [beforePage, setBeforePage] = useState("");
  const [enterAfter, setEnterAfter] = useState(false);
  const [afterPage, setAfterPage] = useState("");

  const PageItem = ({ p, isActive }: { p: number; isActive?: boolean }) => {
    return (
      <PaginationItem>
        <PaginationLink isActive={isActive}>{p}</PaginationLink>
      </PaginationItem>
    );
  };

  const fetchTopicPage = (page: number) =>
    fetch(`/api/chat?page=${page}&&count=${TOPIC_PER_PAGE}`, {
      method: "GET",
    }).then((res) => res.json());

  const topicPageQueryOptions = (page: number) => {
    return queryOptions({
      queryKey: ["topics", page],
      queryFn: () => fetchTopicPage(page),
      placeholderData: keepPreviousData,
      staleTime: 2 * 60 * 1000, //2 min
      gcTime: 5 * 60 * 1000,
    });
  };
  const { status, error, data, isPlaceholderData, isSuccess } = useQuery(
    topicPageQueryOptions(currentPage)
  );

  const topics: TopicProp[] = [];

  const displayTopic = (data: {
    topics: TopicProp[];
    avatar: UserAvatarInfo[];
  }) => {
    return data.topics.map((t: TopicProp, i: number) => {
      const ava = data.avatar.find((info) => info.id == t.creatorId);
      return (
        <div className={`relative mx-1 my-1 ${classes.topic}`}>
          <div className={`w-[400px] h-[100px] grow-0  flex gap-2`} key={i}>
            {ava?.avatar && (
              <img
                src={`data:image/png;base64, ${ava.avatar}`}
                className="h-[60px] max-w-[60px]  self-center"
              />
            )}
            <div className="">
              <h3 className="my-2">{t.topic}</h3>
              <span className="text-gray-400 w-[300px] text-ellipsis inline-block overflow-hidden">
                hahahahahahahahahahahahahahahahahahahahahahahahhahaha
              </span>
            </div>
          </div>
          <div
            className={`w-[400px] h-[100px] grow-0 ${classes.overlay}`}
          ></div>
        </div>
      );
    });
  };

  return (
    <>
      <Card
        className={cn(
          "relative left-1/2 -translate-x-1/2 w-[1300px] h-[450px] mb-3 flex flex-wrap justify-center",
          status == "pending" || isPlaceholderData ? "opacity-30" : ""
        )}
      >
        {isSuccess ? displayTopic(data) : <div>loading..</div>}
      </Card>
      {
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <Fragment>
                <PaginationItem>
                  <PaginationPrevious
                    text="上一页"
                    onClick={() => {
                      setPage((currentPage) => currentPage - 1);
                    }}
                  />
                </PaginationItem>
              </Fragment>
            )}
            {<PageItem p={1} isActive={currentPage == 1} />}
            {currentPage > 1 && (
              <Fragment>
                {currentPage > 2 && !enterBefore && (
                  <PaginationEllipsis
                    onClick={() => {
                      setEnterBefore(true);
                    }}
                  />
                )}
                {enterBefore && (
                  <Input
                    type="text"
                    value={beforePage}
                    onChange={(e) => setBeforePage(e.target.value)}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon",
                      }),
                      className
                    )}
                    onKeyUp={(ev) => {
                      if (ev.key == "Enter") {
                        const pageSchema = z
                          .number()
                          .int()
                          .gte(1)
                          .lte(totalPage);
                        try {
                          const toPage = pageSchema.parse(parseInt(beforePage));
                          setPage(() => toPage);
                        } catch (e) {}
                        setEnterBefore(false);
                      }
                    }}
                  />
                )}
                <PageItem p={currentPage} isActive />
              </Fragment>
            )}
            {}
            {totalPage > currentPage && (
              <Fragment>
                {totalPage - currentPage > 1 && !enterAfter && (
                  <PaginationEllipsis
                    onClick={() => {
                      setEnterAfter(true);
                    }}
                  />
                )}
                {enterAfter && (
                  <Input
                    type="text"
                    value={afterPage}
                    onChange={(e) => setAfterPage(e.target.value)}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon",
                      }),
                      className
                    )}
                    onKeyUp={(ev) => {
                      if (ev.key == "Enter") {
                        const pageSchema = z
                          .number()
                          .int()
                          .gte(1)
                          .lte(totalPage);
                        try {
                          const toPage = pageSchema.parse(parseInt(afterPage));
                          setPage(() => toPage);
                        } catch (e) {}
                        setEnterAfter(false);
                      }
                    }}
                  />
                )}

                <PageItem p={totalPage} />
                <PaginationItem>
                  <PaginationNext
                    text="下一页"
                    onClick={() => {
                      setPage((currentPage) => currentPage + 1);
                      return false;
                    }}
                  />
                </PaginationItem>
              </Fragment>
            )}
          </PaginationContent>
        </Pagination>
      }
    </>
  );
};

const TopicContainer = ({
  className,
  topicCount,
}: {
  className?: string;
  topicCount: number;
}) => {
  const query = useInfiniteQuery({
    queryKey: ["topics"],
    queryFn: fetchTopic,
    initialPageParam: { last_id: 0, limit: TOPIC_PER_PAGE },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage.hasMore) {
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
      <Media greaterThanOrEqual="lg" className="h-full">
        <TopicPage topicCount={topicCount} />
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
