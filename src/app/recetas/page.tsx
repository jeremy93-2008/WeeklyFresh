import { auth } from "@clerk/nextjs/server";
import { getRecipes, getDistinctUtensils } from "@/queries/recipes";
import { RecipeSearch } from "@/components/recipes/recipe-search";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { Pagination } from "@/components/recipes/pagination";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    q?: string;
    ingrediente?: string;
    utensilio?: string;
    vista?: string;
    pagina?: string;
  }>;
}

export default async function RecetasPage({ searchParams }: Props) {
  const params = await searchParams;
  const { userId } = await auth();

  const page = parseInt(params.pagina ?? "1", 10);
  const view = (params.vista as "grid" | "list") ?? "grid";

  const [data, utensilOptions] = await Promise.all([
    getRecipes({
      search: params.q,
      ingredient: params.ingrediente,
      utensil: params.utensilio,
      page,
      userId,
    }),
    getDistinctUtensils(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">Recetas</h1>

      <Suspense>
        <RecipeSearch utensilOptions={utensilOptions} />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        {data.total} receta{data.total !== 1 ? "s" : ""}
      </p>

      <RecipeGrid recipes={data.recipes} view={view} />

      <Pagination page={data.page} totalPages={data.totalPages} />
    </div>
  );
}
