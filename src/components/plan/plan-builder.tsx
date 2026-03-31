"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X, Plus, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
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
import { RecipeActions } from "./recipe-actions";
import { TruncatedText } from "@/components/ui/truncated-text";
import { cn } from "@/lib/utils";
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
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const perPage = 16;

  const selectedIds = new Set(selected.map((r) => r.recipeId));

  const filtered = availableRecipes.filter(
    (r) =>
      !selectedIds.has(r.id) &&
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

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
                <TruncatedText text={recipe.title} maxLines={1} className="flex-1 text-sm" />
                <Select
                  value={recipe.dayOfWeek !== null ? DAY_NAMES[recipe.dayOfWeek] : "Sin asignar"}
                  onValueChange={(v) => {
                    if (!v) return;
                    const idx = DAY_NAMES.indexOf(v as typeof DAY_NAMES[number]);
                    setDay(recipe.recipeId, idx >= 0 ? idx : null);
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                    {DAY_NAMES.map((name) => (
                      <SelectItem key={name} value={name}>
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
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium flex-1">Agregar recetas</h2>
          <div className="flex rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("grid")}
              className={cn("rounded-r-none h-8 w-8", view === "grid" && "bg-muted")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("list")}
              className={cn("rounded-l-none h-8 w-8", view === "list" && "bg-muted")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Input
          placeholder="Buscar recetas..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        />

        {view === "grid" ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {paginated.map((recipe) => (
              <div
                key={recipe.id}
                className="group cursor-pointer overflow-hidden rounded-lg border bg-card text-left transition-shadow hover:shadow-md"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden"
                  onClick={() => addRecipe(recipe)}
                >
                  <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors group-hover:bg-primary/60">
                    <Plus className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
                <div className="flex items-center gap-1 p-2">
                  <TruncatedText text={recipe.title} className="flex-1 text-sm font-medium" />
                  <RecipeActions recipe={recipe} onAdd={() => addRecipe(recipe)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {paginated.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => addRecipe(recipe)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-card p-2 text-left transition-colors hover:bg-muted/50"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <TruncatedText text={recipe.title} maxLines={1} className="flex-1 text-sm" />
                <RecipeActions recipe={recipe} onAdd={() => addRecipe(recipe)} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
