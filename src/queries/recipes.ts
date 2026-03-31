import { db } from "@/db";
import { recipes, ingredients, utensils, favorites } from "@/db/schema";
import { eq, ilike, and, or, exists, sql, count } from "drizzle-orm";

interface GetRecipesParams {
  search?: string;
  ingredients?: string[];
  utensil?: string;
  page?: number;
  limit?: number;
  userId?: string | null;
}

export async function getRecipes({
  search,
  ingredients: ingredientFilters,
  utensil,
  page = 1,
  limit = 20,
  userId,
}: GetRecipesParams = {}) {
  const conditions = [];

  // Visibility: public or owned by user
  if (userId) {
    conditions.push(
      or(eq(recipes.isPublic, true), eq(recipes.userId, userId))
    );
  } else {
    conditions.push(eq(recipes.isPublic, true));
  }

  if (search) {
    conditions.push(ilike(recipes.title, `%${search}%`));
  }

  if (ingredientFilters?.length) {
    for (const ing of ingredientFilters) {
      conditions.push(
        exists(
          db
            .select({ one: sql`1` })
            .from(ingredients)
            .where(
              and(
                eq(ingredients.recipeId, recipes.id),
                ilike(ingredients.name, `%${ing}%`)
              )
            )
        )
      );
    }
  }

  if (utensil) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(utensils)
          .where(
            and(
              eq(utensils.recipeId, recipes.id),
              ilike(utensils.text, `%${utensil}%`)
            )
          )
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  const [recipeList, [{ total }]] = await Promise.all([
    db
      .select({
        id: recipes.id,
        title: recipes.title,
        image: recipes.image,
        isHellofresh: recipes.isHellofresh,
        isPublic: recipes.isPublic,
        url: recipes.url,
        userId: recipes.userId,
      })
      .from(recipes)
      .where(where)
      .orderBy(recipes.title)
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(recipes).where(where),
  ]);

  // Get favorite status if user is logged in
  let favoriteRecipeIds = new Set<number>();
  if (userId && recipeList.length > 0) {
    const favs = await db
      .select({ recipeId: favorites.recipeId })
      .from(favorites)
      .where(eq(favorites.userId, userId));
    favoriteRecipeIds = new Set(favs.map((f) => f.recipeId));
  }

  return {
    recipes: recipeList.map((r) => ({
      ...r,
      isFavorite: favoriteRecipeIds.has(r.id),
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRecipeById(id: number, userId?: string | null) {
  const recipe = await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      ingredients: true,
      instructions: {
        orderBy: (instructions, { asc }) => [asc(instructions.stepOrder)],
      },
      utensils: true,
    },
  });

  if (!recipe) return null;

  let isFavorite = false;
  if (userId) {
    const fav = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.recipeId, id)
      ),
    });
    isFavorite = !!fav;
  }

  return { ...recipe, isFavorite };
}

export async function getDistinctUtensils() {
  const result = await db
    .selectDistinct({ text: utensils.text })
    .from(utensils)
    .orderBy(utensils.text);
  return result.map((r) => r.text);
}
