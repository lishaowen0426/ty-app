"use client";
import classes from "@/components/style/Bubble.module.css";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BubbleProp {
  content: string;
}

const mockContent = [
  "こんにちは👋",
  "Hello😊",
  "你好😊",
  "Hola💖",
  "Bonjour🥳",
  "Ciao🎅🏿",
  "مرحبا🎊",
];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

enum Justify {
  end = "justify-end",
  start = "justify-start",
}

const MAX_ALLOWED = 2;

const REVERSE = {
  "justify-end": Justify.start,
  "justify-start": Justify.end,
};
const counter: { [k in Justify]: number } = {
  "justify-end": 0,
  "justify-start": 0,
};

export default function BubbleList({ className }: { className?: string }) {
  const randomJustify = (): Justify => {
    return getRandomInt(2) % 2 ? Justify.end : Justify.start;
  };
  const item = {
    hidden: { opacity: 0 },
    show: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.5 },
    }),
  };

  return (
    <div className={className}>
      {mockContent.map((c, i) => {
        let justify = randomJustify();
        if (counter[justify] >= MAX_ALLOWED) {
          counter[justify] = 0;
          justify = REVERSE[justify];
          counter[justify] = 1;
        } else {
          counter[justify] += 1;
        }

        return (
          <motion.div
            className={cn(classes["message"], justify, "mb-2")}
            custom={i}
            initial="hidden"
            animate="show"
            variants={item}
            key={c}
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={classes["content"]}
            >
              {c}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
