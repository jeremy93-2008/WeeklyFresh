"use client";

import { useOptimistic, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleIngredientCheck } from "@/actions/shopping";
import { cn } from "@/lib/utils";

interface IngredientCheckProps {
  planId: number;
  ingredientId: number;
  checked: boolean;
  quantity: string | null;
  unit: string | null;
  name: string;
}

export function IngredientCheck({
  planId,
  ingredientId,
  checked,
  quantity,
  unit,
  name,
}: IngredientCheckProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(checked);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticChecked(!optimisticChecked);
      await toggleIngredientCheck(planId, ingredientId);
    });
  }

  const label = [quantity, unit].filter(Boolean).join(" ");

  return (
    <label className="flex items-center gap-3 py-1 cursor-pointer">
      <Checkbox
        checked={optimisticChecked}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <span
        className={cn(
          "text-sm",
          optimisticChecked && "line-through text-muted-foreground"
        )}
      >
        {label && (
          <span className="text-muted-foreground">{label} — </span>
        )}
        {name}
      </span>
    </label>
  );
}
