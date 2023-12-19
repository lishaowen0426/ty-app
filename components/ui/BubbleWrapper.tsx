import dynamic from "next/dynamic";
const BubbleComponent = dynamic(() => import("./Bubble"), {
  ssr: false,
});
export const BubbleComponentNoSSR = ({ className }: { className: string }) => (
  <BubbleComponent className={className} />
);
