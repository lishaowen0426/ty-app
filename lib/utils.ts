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

export const fromMeterToBest = (meter: number) => {
  if (meter < 1000) {
    return `${meter}m`;
  } else {
    return `${(meter / 1000).toFixed(1)}km`;
  }
};

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}
