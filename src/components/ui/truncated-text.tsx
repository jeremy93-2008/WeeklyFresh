"use client";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  text: string;
  className?: string;
  maxLines?: 1 | 2;
}

export function TruncatedText(props: TruncatedTextProps) {
  const { text, className, maxLines = 2 } = props;
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          maxLines === 1 ? "truncate" : "line-clamp-2",
          "text-left",
          className
        )}
      >
        {text}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
