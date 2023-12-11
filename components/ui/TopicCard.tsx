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

import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect } from "react";
import { useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TopicProps {
  id: string;
  topic: string;
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
  created: new Date(2023, 12, 11, 19, 40, 35),
  participants: 1762,
};

const Topic = (props: TopicProps) => {
  return (
    <Card className="flex h-20 justify-between">
      <Avatar className="h-10 translate-y-5 flex-none">
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
      <div className="ml-4 mt-[1.2rem] space-y-1 flex-grow">
        <p className="text-lg font-bold leading-none">{props.topic}</p>
        <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
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

const TopicList = () => {
  const [topicList, setTopicList] = useState<TopicList>({
    items: [],
    hasMore: true,
  });

  const [progress, setProgress] = useState(0);

  const fetchTopics = () => {
    //fetch from api, a fake call with 500ms delay
    setTimeout(() => {
      setTopicList((l) => {
        //fetch topics from api
        const updated: TopicList = {
          items: l.items.concat(Array(50).fill(Topic(mockTopic))),
          hasMore: true,
        };
        return updated;
      });
    }, 1000);

    setTimeout(() => {
      setProgress(30);
    }, 300);
    setTimeout(() => {
      setProgress(60);
    }, 600);
    setTimeout(() => {
      setProgress(100);
    }, 900);
  };

  useEffect(() => {
    setTimeout(() => {
      setTopicList((t) => {
        const updated: TopicList = {
          items: Array(50).fill(Topic(mockTopic)),
          hasMore: true,
        };
        return updated;
      });
    }, 500);
  }, []);

  return (
    <div id="scrollDiv" className="w-full h-[85%] overflow-y-auto">
      <InfiniteScroll
        dataLength={topicList.items.length}
        next={fetchTopics}
        hasMore={topicList.hasMore}
        loader={<Progress value={progress} className="h-[0.5rem] w-[80%]" />}
        scrollableTarget="scrollDiv"
      >
        <div className="space-y-1">{topicList.items}</div>
      </InfiniteScroll>
    </div>
  );
};

export default function TopicCard() {
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
    <Card className="h-[60%] p-[0.5rem] pb-0 m-1">
      <div className="w-full flex justify-between mb-1 mt-1 h-[10%] ">
        <div className="flex space-x-2  ">
          <Input type="text" placeholder="话题" className="w-[6rem] h-[80%]" />
          <Button variant="outline" className=" h-[80%]">
            <Search size="16" />
          </Button>
        </div>
        <SelectDistance className="w-[8rem]" />
      </div>
      <TopicList />
    </Card>
  );
}
