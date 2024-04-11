import SiteFooter from "@/components/ui/site-footer";
import SiteHeader from "@/components/ui/site-header";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
