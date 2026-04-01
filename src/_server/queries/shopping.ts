import { db } from '@db'
import {
    weeklyPlanIngredientChecks,
    weeklyPlanCustomItems,
    recipes,
    ingredients,
} from '@db/schema'
import { eq } from 'drizzle-orm'
import { getUserPlanForWeek } from '@/_lib/plan-permissions'

export async function getShoppingList(userId: string, weekStart: string) {
    const access = await getUserPlanForWeek(userId, weekStart)
    if (!access) return null

    // Viewers can't access shopping list
    if (access.role === 'viewer') return { restricted: true as const }

    const plan = access.plan

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
        .orderBy(recipes.title, ingredients.name)

    const recipeGroups = Object.groupBy(checks, (c) => String(c.recipeId))

    const recipeGroupList = Object.entries(recipeGroups).map(
        ([recipeId, items]) => ({
            recipeId: Number(recipeId),
            recipeTitle: items![0].recipeTitle,
            recipeImage: items![0].recipeImage,
            ingredients: items!,
        })
    )

    const customItems = await db
        .select()
        .from(weeklyPlanCustomItems)
        .where(eq(weeklyPlanCustomItems.planId, plan.id))
        .orderBy(weeklyPlanCustomItems.name)

    return {
        restricted: false as const,
        planId: plan.id,
        role: access.role,
        recipeGroups: recipeGroupList,
        customItems,
    }
}
