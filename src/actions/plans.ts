"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  weeklyPlans,
  weeklyPlanRecipes,
  weeklyPlanIngredientChecks,
  ingredients,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface PlanRecipe {
  recipeId: number;
  dayOfWeek: number | null;
}

export async function confirmPlan(
  weekStart: string,
  planRecipes: PlanRecipe[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  // Validate weekStart is a Monday
  const date = new Date(weekStart);
  if (date.getDay() !== 1) throw new Error("weekStart debe ser un lunes");

  if (planRecipes.length === 0) throw new Error("Selecciona al menos una receta");

  await db.transaction(async (tx) => {
    // Check no existing plan
    const existing = await tx.query.weeklyPlans.findFirst({
      where: and(
        eq(weeklyPlans.userId, userId),
        eq(weeklyPlans.weekStart, weekStart)
      ),
    });
    if (existing) throw new Error("Ya existe un plan para esta semana");

    // Insert plan
    const [plan] = await tx
      .insert(weeklyPlans)
      .values({ userId, weekStart })
      .returning({ id: weeklyPlans.id });

    // Insert plan recipes
    await tx.insert(weeklyPlanRecipes).values(
      planRecipes.map((r) => ({
        planId: plan.id,
        recipeId: r.recipeId,
        dayOfWeek: r.dayOfWeek,
      }))
    );

    // Create ingredient checks for all ingredients of all recipes in the plan
    const recipeIds = planRecipes.map((r) => r.recipeId);
    for (const recipeId of recipeIds) {
      const recipeIngredients = await tx
        .select({ id: ingredients.id })
        .from(ingredients)
        .where(eq(ingredients.recipeId, recipeId));

      if (recipeIngredients.length > 0) {
        await tx.insert(weeklyPlanIngredientChecks).values(
          recipeIngredients.map((ing) => ({
            planId: plan.id,
            ingredientId: ing.id,
            checked: false,
          }))
        );
      }
    }
  });

  revalidatePath("/plan");
  revalidatePath("/lista");
}

export async function resetPlan(planId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  // Verify ownership
  const plan = await db.query.weeklyPlans.findFirst({
    where: and(eq(weeklyPlans.id, planId), eq(weeklyPlans.userId, userId)),
  });
  if (!plan) throw new Error("Plan no encontrado");

  // Cascade delete handles all child rows
  await db.delete(weeklyPlans).where(eq(weeklyPlans.id, planId));

  revalidatePath("/plan");
  revalidatePath("/lista");
}
