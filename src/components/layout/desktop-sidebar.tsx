"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { AuthButton } from "./auth-button";

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 inset-y-0 z-50 hidden w-60 flex-col border-r bg-card md:flex">
      <Link href="/" className="flex h-14 items-center gap-2 border-b px-4 hover:opacity-80">
        <UtensilsCrossed className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold">WeeklyFresh</span>
      </Link>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t p-3">
        <AuthButton />
        <ThemeToggle />
      </div>
    </aside>
  );
}
