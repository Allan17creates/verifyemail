import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-dashboard items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-bold text-text">
            ismyemailworking<span className="text-accent">.app</span>
          </Link>
          <Link href="/dashboard/account" className="text-sm text-subtext hover:text-text">
            Account
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-dashboard flex-col gap-8 px-6 py-10 md:flex-row">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
