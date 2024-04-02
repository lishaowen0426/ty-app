import TopicCardNoSSR from "@/components/ui/TopicCardNoSSR";
import TopicsProviders from "./providers";
import { SiteHeader } from "@/components/ui/site-header";

export default async function Topics() {
  return (
    <TopicsProviders>
      <SiteHeader />
      <div className="h-full flex flex-col justify-start">
        <TopicCardNoSSR className="" />
      </div>
    </TopicsProviders>
  );
}
