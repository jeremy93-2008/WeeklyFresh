"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  weeklyPlans,
  weeklyPlanRecipes,
  weeklyPlanIngredientChecks,
  ingredients,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getPlanForUser } from "@/lib/plan-permissions";

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

  const date = new Date(weekStart);
  if (date.getDay() !== 1) throw new Error("weekStart debe ser un lunes");

  if (planRecipes.length === 0) throw new Error("Selecciona al menos una receta");

  await db.transaction(async (tx) => {
    const existing = await tx.query.weeklyPlans.findFirst({
      where: and(
        eq(weeklyPlans.userId, userId),
        eq(weeklyPlans.weekStart, weekStart)
      ),
    });
    if (existing) throw new Error("Ya existe un plan para esta semana");

    const [plan] = await tx
      .insert(weeklyPlans)
      .values({ userId, weekStart })
      .returning({ id: weeklyPlans.id });

    await tx.insert(weeklyPlanRecipes).values(
      planRecipes.map((r) => ({
        planId: plan.id,
        recipeId: r.recipeId,
        dayOfWeek: r.dayOfWeek,
      }))
    );

    // Single query for all ingredients across all recipes (no N+1)
    const recipeIds = planRecipes.map((r) => r.recipeId);
    const allIngredients = await tx
      .select({ id: ingredients.id })
      .from(ingredients)
      .where(inArray(ingredients.recipeId, recipeIds));

    if (allIngredients.length > 0) {
      await tx.insert(weeklyPlanIngredientChecks).values(
        allIngredients.map((ing) => ({
          planId: plan.id,
          ingredientId: ing.id,
          checked: false,
        }))
      );
    }
  });

  revalidatePath("/plan");
  revalidatePath("/lista");
}

export async function resetPlan(planId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const access = await getPlanForUser(planId, userId);
  if (!access) throw new Error("Plan no encontrado");
  if (access.role !== "owner") throw new Error("Solo el propietario puede reiniciar el plan");

  await db.delete(weeklyPlans).where(eq(weeklyPlans.id, planId));

  revalidatePath("/plan");
  revalidatePath("/lista");
}
