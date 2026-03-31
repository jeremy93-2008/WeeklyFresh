"use client";

import { UserButton } from "@clerk/nextjs";
import { UtensilsCrossed } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="h-5 w-5 text-primary" />
        <span className="font-semibold">WeeklyFresh</span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
