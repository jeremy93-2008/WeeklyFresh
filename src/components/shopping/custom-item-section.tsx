"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addCustomItem,
  removeCustomItem,
  toggleCustomItemCheck,
} from "@/actions/shopping";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CustomItem {
  id: number;
  name: string;
  checked: boolean;
}

interface CustomItemSectionProps {
  planId: number;
  items: CustomItem[];
}

export function CustomItemSection({ planId, items }: CustomItemSectionProps) {
  const [newItemName, setNewItemName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    const name = newItemName.trim();
    if (!name) return;

    startTransition(async () => {
      try {
        await addCustomItem(planId, name);
        setNewItemName("");
      } catch (e) {
        toast.error("Error al agregar");
      }
    });
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">
        Otros ingredientes
      </h3>

      {items.map((item) => (
        <CustomItemRow key={item.id} item={item} />
      ))}

      <div className="flex gap-2">
        <Input
          placeholder="Agregar ingrediente..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleAdd}
          disabled={isPending || !newItemName.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CustomItemRow({ item }: { item: CustomItem }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(item.checked);

  function handleToggle() {
    startTransition(async () => {
      setOptimisticChecked(!optimisticChecked);
      await toggleCustomItemCheck(item.id);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCustomItem(item.id);
    });
  }

  return (
    <div className="flex items-center gap-3 py-1">
      <Checkbox
        checked={optimisticChecked}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <span
        className={cn(
          "flex-1 text-sm",
          optimisticChecked && "line-through text-muted-foreground"
        )}
      >
        {item.name}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={handleRemove}
        disabled={isPending}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
