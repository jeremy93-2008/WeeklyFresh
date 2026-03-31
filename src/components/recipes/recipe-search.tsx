"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeSearchProps {
  utensilOptions: string[];
}

export function RecipeSearch({ utensilOptions }: RecipeSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [ingredientFilter, setIngredientFilter] = useState(
    searchParams.get("ingrediente") ?? ""
  );

  const currentView = searchParams.get("vista") ?? "grid";
  const currentUtensil = searchParams.get("utensilio") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      params.delete("pagina");
      router.replace(`/recetas?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ q: search });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, updateParams]);

  // Debounced ingredient filter
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ ingrediente: ingredientFilter });
    }, 300);
    return () => clearTimeout(timer);
  }, [ingredientFilter, updateParams]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar recetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams({ vista: "grid" })}
            className={cn(
              "rounded-r-none",
              currentView === "grid" && "bg-muted"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams({ vista: "list" })}
            className={cn(
              "rounded-l-none",
              currentView === "list" && "bg-muted"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Filtrar por ingrediente..."
          value={ingredientFilter}
          onChange={(e) => setIngredientFilter(e.target.value)}
          className="flex-1"
        />
        <Select
          value={currentUtensil}
          onValueChange={(value) =>
            updateParams({ utensilio: value === "all" ? "" : value ?? "" })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Utensilio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {utensilOptions.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
