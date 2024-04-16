import ProfileCard from "@/components/ui/Profile";
export default function Profile({
  params,
}: {
  params: { mode: "create" | "edit" };
}) {
  return <ProfileCard mode={params.mode} />;
}
