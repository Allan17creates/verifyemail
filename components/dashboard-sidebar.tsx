"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Single Check" },
  { href: "/dashboard/bulk", label: "Bulk Upload" },
  { href: "/dashboard/reports", label: "My Reports" },
  { href: "/dashboard/billing", label: "Credits & Billing" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border py-2 md:w-56 md:flex-col md:border-b-0 md:border-r md:py-0 md:pr-4">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-input px-3 py-2 text-sm",
              active ? "bg-surface text-text" : "text-subtext hover:text-text"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
