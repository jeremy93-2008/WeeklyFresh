"use client";

import { useRouter } from "next/navigation";
import { Plus, MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRecipe } from "@/actions/recipes";
import { toast } from "sonner";

interface RecipeActionsProps {
  recipe: {
    id: number;
    isHellofresh: boolean;
  };
  onAdd?: () => void;
}

export function RecipeActions(props: RecipeActionsProps) {
  const { recipe, onAdd } = props;
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <a href={`/recetas/${recipe.id}`}>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Ver receta
          </DropdownMenuItem>
        </a>
        {onAdd && (
          <DropdownMenuItem onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar al plan
          </DropdownMenuItem>
        )}
        {!recipe.isHellofresh && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/recetas/${recipe.id}/editar`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={async () => {
                if (!confirm("¿Eliminar esta receta?")) return;
                try {
                  await deleteRecipe(recipe.id);
                  toast.success("Receta eliminada");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Error");
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
