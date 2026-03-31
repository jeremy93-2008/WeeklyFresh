"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DAY_NAMES } from "@/lib/constants";
import { getImageUrl } from "@/lib/image-utils";
import { confirmPlan } from "@/actions/plans";
import { toast } from "sonner";

interface SelectedRecipe {
  recipeId: number;
  title: string;
  image: string | null;
  dayOfWeek: number | null;
}

interface AvailableRecipe {
  id: number;
  title: string;
  image: string | null;
  isHellofresh: boolean;
}

interface PlanBuilderProps {
  weekStart: string;
  availableRecipes: AvailableRecipe[];
}

export function PlanBuilder({ weekStart, availableRecipes }: PlanBuilderProps) {
  const [selected, setSelected] = useState<SelectedRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedIds = new Set(selected.map((r) => r.recipeId));

  const filtered = availableRecipes.filter(
    (r) =>
      !selectedIds.has(r.id) &&
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function addRecipe(recipe: AvailableRecipe) {
    setSelected((prev) => [
      ...prev,
      {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        dayOfWeek: null,
      },
    ]);
  }

  function removeRecipe(recipeId: number) {
    setSelected((prev) => prev.filter((r) => r.recipeId !== recipeId));
  }

  function setDay(recipeId: number, day: number | null) {
    setSelected((prev) =>
      prev.map((r) => (r.recipeId === recipeId ? { ...r, dayOfWeek: day } : r))
    );
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        await confirmPlan(
          weekStart,
          selected.map((r) => ({
            recipeId: r.recipeId,
            dayOfWeek: r.dayOfWeek,
          }))
        );
        toast.success("Plan confirmado");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al confirmar");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Selected recipes */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">
            Recetas seleccionadas ({selected.length})
          </h2>
          <div className="space-y-2">
            {selected.map((recipe) => (
              <div
                key={recipe.recipeId}
                className="flex items-center gap-3 rounded-lg border bg-card p-2"
              >
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <span className="flex-1 text-sm line-clamp-1">
                  {recipe.title}
                </span>
                <Select
                  value={recipe.dayOfWeek?.toString() ?? "none"}
                  onValueChange={(v) =>
                    setDay(recipe.recipeId, v === "none" ? null : parseInt(v!))
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin asignar</SelectItem>
                    {DAY_NAMES.map((name, idx) => (
                      <SelectItem key={idx} value={idx.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeRecipe(recipe.recipeId)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available recipes */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium">Agregar recetas</h2>
        <Input
          placeholder="Buscar recetas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filtered.slice(0, 12).map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => addRecipe(recipe)}
              className="flex items-center gap-2 rounded-lg border bg-card p-2 text-left transition-colors hover:bg-muted/50"
            >
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                <Image
                  src={getImageUrl(recipe.image)}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="flex-1 text-xs line-clamp-2">
                {recipe.title}
              </span>
              <Plus className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
        {filtered.length > 12 && (
          <p className="text-xs text-muted-foreground text-center">
            {filtered.length - 12} recetas más. Usa la búsqueda para filtrar.
          </p>
        )}
      </div>

      {/* Confirm */}
      {selected.length > 0 && (
        <div className="sticky bottom-16 md:bottom-0 bg-background/95 backdrop-blur border-t p-3 -mx-4">
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? "Confirmando..."
              : `Confirmar Plan (${selected.length} receta${selected.length !== 1 ? "s" : ""})`}
          </Button>
        </div>
      )}
    </div>
  );
}
