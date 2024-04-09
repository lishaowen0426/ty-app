import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LoremIpsum } from "lorem-ipsum";
import { Dispatch, SetStateAction } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* min and max are inclusive */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 30,
    min: 4,
  },
});

export type StateDispatch<T> = Dispatch<SetStateAction<T>>;
