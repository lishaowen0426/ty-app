export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col justify-start">
      <div className="relative top-[240px]">{children}</div>
    </div>
  );
}
