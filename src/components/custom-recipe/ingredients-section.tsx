"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { IngredientRow } from "@/hooks/use-recipe-form";

interface IngredientsSectionProps {
  rows: IngredientRow[];
  onUpdate: (idx: number, field: keyof IngredientRow, value: string | boolean) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

export function IngredientsSection({ rows, onUpdate, onAdd, onRemove }: IngredientsSectionProps) {
  return (
    <div className="space-y-3">
      {rows.map((row, idx) => (
        <div key={idx} className="flex gap-1.5 items-start">
          <Input
            placeholder="Cant."
            value={row.quantity}
            onChange={(e) => onUpdate(idx, "quantity", e.target.value)}
            className="w-16"
          />
          <Input
            placeholder="Unidad"
            value={row.unit}
            onChange={(e) => onUpdate(idx, "unit", e.target.value)}
            className="w-24"
          />
          <Input
            placeholder="Ingrediente"
            value={row.name}
            onChange={(e) => onUpdate(idx, "name", e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-1 pt-2">
            <Checkbox
              checked={row.shipped}
              onCheckedChange={(v) => onUpdate(idx, "shipped", !!v)}
            />
            <span className="text-xs text-muted-foreground">Env.</span>
          </div>
          {rows.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onRemove(idx)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-1 h-3.5 w-3.5" /> Agregar ingrediente
      </Button>
    </div>
  );
}
