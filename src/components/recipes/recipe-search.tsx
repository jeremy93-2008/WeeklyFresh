"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { navigateWithProgress } from "@/lib/navigation";
import { useRef, useState } from "react";
import { Search, LayoutGrid, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecipeSearchProps {
  utensilOptions: string[];
}

export function RecipeSearch({ utensilOptions }: RecipeSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientTags, setIngredientTags] = useState<string[]>(() => {
    const param = searchParams.get("ingrediente");
    return param ? param.split(",").filter(Boolean) : [];
  });

  const currentView = searchParams.get("vista") ?? "grid";
  const currentUtensil = searchParams.get("utensilio") ?? "";

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function navigate(updates: Record<string, string>, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (resetPage) params.delete("pagina");
    navigateWithProgress(router, `${pathname}?${params.toString()}`, "replace");
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      navigate({ q: value });
    }, 300);
  }

  function addIngredientTag(value: string) {
    const tag = value.trim().toLowerCase();
    if (!tag || ingredientTags.includes(tag)) return;
    const newTags = [...ingredientTags, tag];
    setIngredientTags(newTags);
    setIngredientInput("");
    navigate({ ingrediente: newTags.join(",") });
  }

  function removeIngredientTag(tag: string) {
    const newTags = ingredientTags.filter((t) => t !== tag);
    setIngredientTags(newTags);
    navigate({ ingrediente: newTags.join(",") });
  }

  function handleIngredientKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredientTag(ingredientInput);
    }
    if (e.key === "Backspace" && !ingredientInput && ingredientTags.length > 0) {
      removeIngredientTag(ingredientTags[ingredientTags.length - 1]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar recetas..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ vista: "grid" }, false)}
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
            onClick={() => navigate({ vista: "list" }, false)}
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
        <div className="flex flex-1 flex-wrap items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring">
          {ingredientTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {tag}
              <button
                onClick={() => removeIngredientTag(tag)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            placeholder={
              ingredientTags.length === 0
                ? "Filtrar por ingredientes..."
                : "Otro ingrediente..."
            }
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={handleIngredientKeyDown}
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Select
          value={currentUtensil}
          onValueChange={(value) =>
            navigate({ utensilio: value === "all" ? "" : value ?? "" })
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
