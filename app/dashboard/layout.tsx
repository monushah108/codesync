import { DataProvider } from "@/context/dataProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </DataProvider>
  );
}
