import { cn, getRandomInt } from "@/lib/utils";
import { LoremIpsum } from "lorem-ipsum";
import { Input } from "./input";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 30,
    min: 4,
  },
});

function Bubble({
  message,
  className,
  key,
  self,
}: {
  message: string;
  className?: string;
  key: React.Key;
  self: boolean;
}) {
  return (
    <div
      key={key}
      className={cn(
        className,
        self ? "ml-auto mr-0" : "",
        "w-max max-w-[75%] bg-background py-2 px-3 rounded-xl"
      )}
    >
      {message}
    </div>
  );
}

const messages = new Array(100).fill("").map(() => {
  return lorem.generateSentences(getRandomInt(1, 10));
});

export default function ChatRoom({
  className,
  id,
}: {
  className?: string;
  id: string;
}) {
  return (
    <div
      className={cn(
        className,
        "flex flex-col justify-between container   max-h-[1000px] py-[10px]"
      )}
    >
      <div className="h-[40px]">ll</div>
      <div
        className={cn(
          "scrollbar-hide",
          className,
          "flex-1 flex flex-col gap-[10px]  overflow-auto"
        )}
      >
        {messages.map((msg, index) => (
          <Bubble message={msg} key={index} self={getRandomInt(0, 1) == 0} />
        ))}
      </div>
      <div className="mt-[10px] h-[40px] flex justify-end items-center">
        <Input className="flex-1" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-circle-plus ml-[10px]"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      </div>
    </div>
  );
}
