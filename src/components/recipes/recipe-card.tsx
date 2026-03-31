import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { TruncatedText } from "@/components/ui/truncated-text";
import { HelloFreshBadge } from "./hellofresh-badge";
import { FavoriteButton } from "./favorite-button";

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string | null;
    isHellofresh: boolean;
    isFavorite: boolean;
  };
  variant?: "grid" | "list";
}

export function RecipeCard({ recipe, variant = "grid" }: RecipeCardProps) {
  if (variant === "list") {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
        <Link
          href={`/recetas/${recipe.id}`}
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md"
        >
          <Image
            src={getImageUrl(recipe.image)}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/recetas/${recipe.id}`}>
            <TruncatedText text={recipe.title} className="text-sm font-medium leading-tight" />
          </Link>
          {recipe.isHellofresh && (
            <div className="mt-1">
              <HelloFreshBadge />
            </div>
          )}
        </div>
        <FavoriteButton
          recipeId={recipe.id}
          isFavorite={recipe.isFavorite}
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/recetas/${recipe.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {recipe.isHellofresh && (
          <div className="absolute top-2 right-2">
            <HelloFreshBadge />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <FavoriteButton
            recipeId={recipe.id}
            isFavorite={recipe.isFavorite}
            size="sm"
          />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/recetas/${recipe.id}`}>
          <TruncatedText text={recipe.title} className="text-sm font-medium leading-tight" />
        </Link>
      </div>
    </div>
  );
}
