"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  weeklyPlanIngredientChecks,
  weeklyPlanCustomItems,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getPlanForUser } from "@/lib/plan-permissions";

async function requireEditor(planId: number, userId: string) {
  const access = await getPlanForUser(planId, userId);
  if (!access) throw new Error("Plan no encontrado");
  if (access.role === "viewer") throw new Error("No tienes permisos de edición");
  return access;
}

export async function toggleIngredientCheck(
  planId: number,
  ingredientId: number
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  await requireEditor(planId, userId);

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

  await requireEditor(item.planId, userId);

  await db
    .update(weeklyPlanCustomItems)
    .set({ checked: !item.checked })
    .where(eq(weeklyPlanCustomItems.id, itemId));

  revalidatePath("/lista");
}

export async function addCustomItem(planId: number, name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  await requireEditor(planId, userId);

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

  await requireEditor(item.planId, userId);

  await db
    .delete(weeklyPlanCustomItems)
    .where(eq(weeklyPlanCustomItems.id, itemId));

  revalidatePath("/lista");
}
