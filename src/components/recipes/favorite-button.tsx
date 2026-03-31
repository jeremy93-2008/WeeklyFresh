"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/actions/favorites";
import { useOptimistic, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  recipeId: number;
  isFavorite: boolean;
  size?: "sm" | "default";
}

export function FavoriteButton({
  recipeId,
  isFavorite,
  size = "default",
}: FavoriteButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite);
      await toggleFavorite(recipeId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm",
        size === "sm" ? "h-8 w-8" : "h-10 w-10"
      )}
      aria-label={optimisticFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          optimisticFavorite
            ? "fill-red-500 text-red-500"
            : "text-white"
        )}
      />
    </Button>
  );
}
