"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { TruncatedText } from "@/components/ui/truncated-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DAY_NAMES } from "@/lib/constants";
import { getImageUrl } from "@/lib/image-utils";
import { resetPlan } from "@/actions/plans";
import { toast } from "sonner";

interface PlanRecipe {
  recipeId: number;
  dayOfWeek: number | null;
  title: string;
  image: string | null;
}

interface PlanConfirmedProps {
  planId: number;
  recipes: PlanRecipe[];
}

export function PlanConfirmed({ planId, recipes }: PlanConfirmedProps) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const byDay = new Map<number | null, PlanRecipe[]>();
  for (const recipe of recipes) {
    const key = recipe.dayOfWeek;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(recipe);
  }

  const unassigned = byDay.get(null) ?? [];

  function handleReset() {
    startTransition(async () => {
      try {
        await resetPlan(planId);
        toast.success("Plan reiniciado");
        setDialogOpen(false);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Error al reiniciar");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Day grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DAY_NAMES.map((dayName, dayIdx) => {
          const dayRecipes = byDay.get(dayIdx) ?? [];
          return (
            <div key={dayIdx} className="rounded-lg border bg-card p-3 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {dayName}
              </h3>
              {dayRecipes.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">---</p>
              ) : (
                dayRecipes.map((r) => (
                  <Link
                    key={r.recipeId}
                    href={`/recetas/${r.recipeId}`}
                    className="flex items-center gap-2 rounded p-1 transition-colors hover:bg-muted"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={getImageUrl(r.image)}
                        alt={r.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <TruncatedText text={r.title} className="text-xs" />
                  </Link>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Sin día asignado
          </h3>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {unassigned.map((r) => (
              <Link
                key={r.recipeId}
                href={`/recetas/${r.recipeId}`}
                className="flex items-center gap-2 rounded-lg border bg-card p-2 transition-colors hover:bg-muted/50"
              >
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={getImageUrl(r.image)}
                    alt={r.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <TruncatedText text={r.title} className="text-xs" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reset button */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => setDialogOpen(true)}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reiniciar Plan
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reiniciar plan semanal</DialogTitle>
            <DialogDescription>
              Se eliminarán todas las recetas del plan y la lista de compra
              asociada. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isPending}
            >
              {isPending ? "Reiniciando..." : "Reiniciar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
