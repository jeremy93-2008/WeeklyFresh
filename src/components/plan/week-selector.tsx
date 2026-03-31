"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navigateWithProgress } from "@/lib/navigation";
import {
  startOfWeek,
  addWeeks,
  subWeeks,
  format,
  endOfWeek,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  basePath: string;
  selectedWeek?: string;
}

function getMonday(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function formatWeekRange(monday: Date) {
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  const from = format(monday, "d MMM", { locale: es });
  const to = format(sunday, "d MMM", { locale: es });
  return `${from} - ${to}`;
}

function toDateString(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function WeekSelector({ basePath, selectedWeek }: WeekSelectorProps) {
  const router = useRouter();
  const currentMonday = getMonday(new Date());
  const selected = selectedWeek ? getMonday(new Date(selectedWeek)) : currentMonday;

  const [windowStart, setWindowStart] = useState(() => {
    // Center the window so selected week is visible
    return subWeeks(selected, 1);
  });

  const weeks = Array.from({ length: 4 }, (_, i) => addWeeks(windowStart, i));

  function selectWeek(monday: Date) {
    navigateWithProgress(router, `${basePath}?week=${toDateString(monday)}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setWindowStart((s) => subWeeks(s, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-1 gap-1.5 overflow-x-auto">
        {weeks.map((monday) => (
          <button
            key={toDateString(monday)}
            onClick={() => selectWeek(monday)}
            className={cn(
              "flex-1 min-w-[100px] rounded-md border px-2 py-1.5 text-xs text-center transition-colors",
              isSameDay(monday, selected)
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border hover:bg-muted",
              isSameDay(monday, currentMonday) &&
                !isSameDay(monday, selected) &&
                "border-primary/30"
            )}
          >
            {formatWeekRange(monday)}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setWindowStart((s) => addWeeks(s, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
