"use client";
import { ComponentPropsWithoutRef, forwardRef, useEffect } from "react";
import { LoremIpsum } from "lorem-ipsum";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import styled from "styled-components";
import { Heart, Send, Clock, LandPlot } from "lucide-react";
import { Icons } from "./icons";
import { Progress } from "@/components/ui/progress";
import { fromMeterToBest } from "@/lib/utils";
import { formatDistanceToNow, setDefaultOptions } from "date-fns";
import { zhCN, ja } from "date-fns/locale";
import { IconButton } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

setDefaultOptions({ locale: zhCN });

export const ChatLorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 3,
    min: 1,
  },
  wordsPerSentence: {
    max: 10,
    min: 3,
  },
});

type AvatarGroupProps = {
  url?: string[];
  count: number;
};

const GroupAvatar = styled(Avatar)`
  margin-right: -1.2em;
  z-index: 1;
`;

const AvatarGroup = ({ url, count }: AvatarGroupProps) => {
  return (
    <div className="flex flex-row-reverse justify-end h-full">
      {url?.map((r) => (
        <GroupAvatar>
          <AvatarImage src={r} />
        </GroupAvatar>
      ))}
      <GroupAvatar>
        <AvatarFallback className="bg-avatar-count text-white">{`+${count}`}</AvatarFallback>
      </GroupAvatar>
    </div>
  );
};

const FunctionGroup = () => {
  const More = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton>
            <Icons.EllipsisVertical />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>更多</DropdownMenuLabel>
          <DropdownMenuItem>屏蔽</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-[120px] flex justify-between">
      <IconButton>
        <Heart />
      </IconButton>
      <IconButton>
        <Send />
      </IconButton>
      <More />
    </div>
  );
};

const TopicFooter = () => {
  const Distance = ({ distance }: { distance: string }) => {
    return (
      <div className="h-[26px] space-x-1">
        <LandPlot size="24" strokeWidth="1px" className="inline" />
        <span className="inline-block align-bottom">{distance}</span>
      </div>
    );
  };
  const Posted = ({ date }: { date: Date }) => {
    return (
      <div className="h-[26px] space-x-1">
        <Clock size="24" strokeWidth="1px" className="inline" />
        <span className="inline-block align-bottom">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
      </div>
    );
  };
  return (
    <div className="flex justify-between w-full space-x-5">
      <Progress id="topic-popularity" className="flex-1 my-auto" value={40} />
      <div className="flex flex-row space-x-2">
        <Posted date={new Date(2024, 2, 18, 16, 36)} />
        <Distance distance={fromMeterToBest(18346)} />
      </div>
    </div>
  );
};

const TopicCard = () => {
  return (
    <div className="h-[250px] w-full max-w-[400px] p-[1rem] bg-topic-card rounded-2xl flex flex-col justify-between ">
      <div className="h-[40px] flex justify-between">
        <AvatarGroup
          url={["/Avatars-1.png", "/Avatars-2.png", "/Avatars-3.png"]}
          count={100}
        />
        <FunctionGroup />
      </div>
      <div>
        <div
          suppressHydrationWarning
          className="text-start text-xl font-bold mb-[10px]"
        >
          {ChatLorem.generateSentences(1)}
        </div>
        <p
          suppressHydrationWarning
          className={"topic-description " + "hover:bg-gray-100"}
        >
          {ChatLorem.generateParagraphs(2)}
        </p>
      </div>
      <TopicFooter />
    </div>
  );
};

const cards = new Array(100).fill(<TopicCard />);

const TopicScroll = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  (props, ref) => {
    useEffect(() => {
      const scrollHeight = () => {
        document.documentElement.style.setProperty(
          "--topic-scroll-height",
          `${window.innerHeight}px`
        );
      };
      scrollHeight();
      window.addEventListener("resize", scrollHeight);
      return () => {
        window.removeEventListener("resize", scrollHeight);
      };
    }, []);

    return (
      <div ref={ref} {...props}>
        <div className="h-full overflow-y-auto container mt-[20px]">
          {cards.map((r) => {
            return <div className="my-[5px]">{r}</div>;
          })}
        </div>
      </div>
    );
  }
);

export default TopicScroll;
