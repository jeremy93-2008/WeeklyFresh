'use server'

import {
    db,
    weeklyPlans,
    weeklyPlanRecipes,
    weeklyPlanIngredientChecks,
    ingredients,
} from '@db'
import { eq, and, inArray } from 'drizzle-orm'
import { requireAuth, requirePlanAccess } from '@/_server/middleware'
import { confirmPlanSchema, type IConfirmPlanInput } from '@/_server/schemas'
import { revalidatePlan } from '@/_server/cache'

export async function confirmPlan(input: IConfirmPlanInput) {
    const userId = await requireAuth()
    const { weekStart, planRecipes } = confirmPlanSchema.parse(input)

    await db.transaction(async (tx) => {
        const existing = await tx.query.weeklyPlans.findFirst({
            where: and(
                eq(weeklyPlans.userId, userId),
                eq(weeklyPlans.weekStart, weekStart)
            ),
        })
        if (existing) throw new Error('Ya existe un plan para esta semana')

        const [plan] = await tx
            .insert(weeklyPlans)
            .values({ userId, weekStart })
            .returning({ id: weeklyPlans.id })

        await tx.insert(weeklyPlanRecipes).values(
            planRecipes.map((r) => ({
                planId: plan.id,
                recipeId: r.recipeId,
                dayOfWeek: r.dayOfWeek,
                mealTime: r.mealTime,
            }))
        )

        const recipeIds = planRecipes.map((r) => r.recipeId)
        const allIngredients = await tx
            .select({ id: ingredients.id })
            .from(ingredients)
            .where(inArray(ingredients.recipeId, recipeIds))

        if (allIngredients.length > 0) {
            await tx.insert(weeklyPlanIngredientChecks).values(
                allIngredients.map((ing) => ({
                    planId: plan.id,
                    ingredientId: ing.id,
                    checked: false,
                }))
            )
        }
    })

    revalidatePlan()
}

export async function resetPlan(planId: number) {
    const userId = await requireAuth()
    await requirePlanAccess(planId, userId, 'owner')

    await db.delete(weeklyPlans).where(eq(weeklyPlans.id, planId))

    revalidatePlan()
}
