"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  weeklyPlanIngredientChecks,
  weeklyPlanCustomItems,
  weeklyPlans,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleIngredientCheck(
  planId: number,
  ingredientId: number
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  // Verify ownership
  const plan = await db.query.weeklyPlans.findFirst({
    where: and(eq(weeklyPlans.id, planId), eq(weeklyPlans.userId, userId)),
  });
  if (!plan) throw new Error("Plan no encontrado");

  const check = await db.query.weeklyPlanIngredientChecks.findFirst({
    where: and(
      eq(weeklyPlanIngredientChecks.planId, planId),
      eq(weeklyPlanIngredientChecks.ingredientId, ingredientId)
    ),
  });

  if (!check) throw new Error("Ingrediente no encontrado");

  await db
    .update(weeklyPlanIngredientChecks)
    .set({ checked: !check.checked })
    .where(
      and(
        eq(weeklyPlanIngredientChecks.planId, planId),
        eq(weeklyPlanIngredientChecks.ingredientId, ingredientId)
      )
    );

  revalidatePath("/lista");
}

export async function toggleCustomItemCheck(itemId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const item = await db.query.weeklyPlanCustomItems.findFirst({
    where: eq(weeklyPlanCustomItems.id, itemId),
  });
  if (!item) throw new Error("Item no encontrado");

  // Verify ownership via plan
  const plan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.id, item.planId),
      eq(weeklyPlans.userId, userId)
    ),
  });
  if (!plan) throw new Error("Plan no encontrado");

  await db
    .update(weeklyPlanCustomItems)
    .set({ checked: !item.checked })
    .where(eq(weeklyPlanCustomItems.id, itemId));

  revalidatePath("/lista");
}

export async function addCustomItem(planId: number, name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const plan = await db.query.weeklyPlans.findFirst({
    where: and(eq(weeklyPlans.id, planId), eq(weeklyPlans.userId, userId)),
  });
  if (!plan) throw new Error("Plan no encontrado");

  await db.insert(weeklyPlanCustomItems).values({
    planId,
    name: name.trim(),
    checked: false,
  });

  revalidatePath("/lista");
}

export async function removeCustomItem(itemId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const item = await db.query.weeklyPlanCustomItems.findFirst({
    where: eq(weeklyPlanCustomItems.id, itemId),
  });
  if (!item) throw new Error("Item no encontrado");

  const plan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.id, item.planId),
      eq(weeklyPlans.userId, userId)
    ),
  });
  if (!plan) throw new Error("Plan no encontrado");

  await db
    .delete(weeklyPlanCustomItems)
    .where(eq(weeklyPlanCustomItems.id, itemId));

  revalidatePath("/lista");
}
