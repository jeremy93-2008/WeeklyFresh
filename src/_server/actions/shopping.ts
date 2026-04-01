'use server'

import { db, weeklyPlanIngredientChecks, weeklyPlanCustomItems } from '@db'
import { eq, and } from 'drizzle-orm'
import { requireAuth, requirePlanAccess } from '@/_server/middleware'
import { revalidatePlan } from '@/_server/cache'

export async function toggleIngredientCheck(
    planId: number,
    ingredientId: number
) {
    const userId = await requireAuth()
    await requirePlanAccess(planId, userId, 'editor')

    const check = await db.query.weeklyPlanIngredientChecks.findFirst({
        where: and(
            eq(weeklyPlanIngredientChecks.planId, planId),
            eq(weeklyPlanIngredientChecks.ingredientId, ingredientId)
        ),
    })
    if (!check) throw new Error('Ingrediente no encontrado')

    await db
        .update(weeklyPlanIngredientChecks)
        .set({ checked: !check.checked })
        .where(
            and(
                eq(weeklyPlanIngredientChecks.planId, planId),
                eq(weeklyPlanIngredientChecks.ingredientId, ingredientId)
            )
        )

    revalidatePlan()
}

export async function toggleCustomItemCheck(itemId: number) {
    const userId = await requireAuth()

    const item = await db.query.weeklyPlanCustomItems.findFirst({
        where: eq(weeklyPlanCustomItems.id, itemId),
    })
    if (!item) throw new Error('Item no encontrado')

    await requirePlanAccess(item.planId, userId, 'editor')

    await db
        .update(weeklyPlanCustomItems)
        .set({ checked: !item.checked })
        .where(eq(weeklyPlanCustomItems.id, itemId))

    revalidatePlan()
}

export async function addCustomItem(planId: number, name: string) {
    const userId = await requireAuth()
    await requirePlanAccess(planId, userId, 'editor')

    await db.insert(weeklyPlanCustomItems).values({
        planId,
        name: name.trim(),
        checked: false,
    })

    revalidatePlan()
}

export async function removeCustomItem(itemId: number) {
    const userId = await requireAuth()

    const item = await db.query.weeklyPlanCustomItems.findFirst({
        where: eq(weeklyPlanCustomItems.id, itemId),
    })
    if (!item) throw new Error('Item no encontrado')

    await requirePlanAccess(item.planId, userId, 'editor')

    await db
        .delete(weeklyPlanCustomItems)
        .where(eq(weeklyPlanCustomItems.id, itemId))

    revalidatePlan()
}
