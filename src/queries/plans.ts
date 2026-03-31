import { db } from "@/db";
import {
  weeklyPlans,
  weeklyPlanRecipes,
  recipes,
  ingredients,
  weeklyPlanIngredientChecks,
  weeklyPlanCustomItems,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getPlan(userId: string, weekStart: string) {
  const plan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.userId, userId),
      eq(weeklyPlans.weekStart, weekStart)
    ),
  });

  if (!plan) return null;

  const planRecipes = await db
    .select({
      recipeId: weeklyPlanRecipes.recipeId,
      dayOfWeek: weeklyPlanRecipes.dayOfWeek,
      title: recipes.title,
      image: recipes.image,
    })
    .from(weeklyPlanRecipes)
    .innerJoin(recipes, eq(weeklyPlanRecipes.recipeId, recipes.id))
    .where(eq(weeklyPlanRecipes.planId, plan.id));

  return {
    ...plan,
    recipes: planRecipes,
  };
}

export async function getShoppingList(userId: string, weekStart: string) {
  const plan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.userId, userId),
      eq(weeklyPlans.weekStart, weekStart)
    ),
  });

  if (!plan) return null;

  // Get all ingredient checks with ingredient and recipe info
  const checks = await db
    .select({
      ingredientId: weeklyPlanIngredientChecks.ingredientId,
      checked: weeklyPlanIngredientChecks.checked,
      quantity: ingredients.quantity,
      unit: ingredients.unit,
      name: ingredients.name,
      shipped: ingredients.shipped,
      recipeId: ingredients.recipeId,
      recipeTitle: recipes.title,
      recipeImage: recipes.image,
    })
    .from(weeklyPlanIngredientChecks)
    .innerJoin(
      ingredients,
      eq(weeklyPlanIngredientChecks.ingredientId, ingredients.id)
    )
    .innerJoin(recipes, eq(ingredients.recipeId, recipes.id))
    .where(eq(weeklyPlanIngredientChecks.planId, plan.id))
    .orderBy(recipes.title, ingredients.name);

  // Group by recipe
  const recipeGroups = new Map<
    number,
    {
      recipeId: number;
      recipeTitle: string;
      recipeImage: string | null;
      ingredients: typeof checks;
    }
  >();

  for (const check of checks) {
    if (!recipeGroups.has(check.recipeId)) {
      recipeGroups.set(check.recipeId, {
        recipeId: check.recipeId,
        recipeTitle: check.recipeTitle,
        recipeImage: check.recipeImage,
        ingredients: [],
      });
    }
    recipeGroups.get(check.recipeId)!.ingredients.push(check);
  }

  const customItems = await db
    .select()
    .from(weeklyPlanCustomItems)
    .where(eq(weeklyPlanCustomItems.planId, plan.id))
    .orderBy(weeklyPlanCustomItems.name);

  return {
    planId: plan.id,
    recipeGroups: Array.from(recipeGroups.values()),
    customItems,
  };
}
