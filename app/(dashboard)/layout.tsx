import { VoyageNavbar } from "@/components/navigation/voyage-navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-dvh">
      <main className="pb-24 md:pb-0">
        {children}
      </main>

      <VoyageNavbar />
    </div>
  );
}
