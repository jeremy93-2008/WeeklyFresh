import { db } from '@db'
import {
    weeklyPlans,
    weeklyPlanRecipes,
    recipes,
    ingredients,
    weeklyPlanIngredientChecks,
    weeklyPlanCustomItems,
    planMembers,
} from '@db/schema'
import { eq, and } from 'drizzle-orm'
import { getUserPlanForWeek, type PlanRole } from '@/_lib/plan-permissions'

export async function getPlan(userId: string, weekStart: string) {
    const access = await getUserPlanForWeek(userId, weekStart)
    if (!access) return null

    const planRecipes = await db
        .select({
            recipeId: weeklyPlanRecipes.recipeId,
            dayOfWeek: weeklyPlanRecipes.dayOfWeek,
            title: recipes.title,
            image: recipes.image,
        })
        .from(weeklyPlanRecipes)
        .innerJoin(recipes, eq(weeklyPlanRecipes.recipeId, recipes.id))
        .where(eq(weeklyPlanRecipes.planId, access.plan.id))

    return {
        ...access.plan,
        role: access.role,
        members: access.members,
        recipes: planRecipes,
    }
}

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

    const recipeGroups = new Map<
        number,
        {
            recipeId: number
            recipeTitle: string
            recipeImage: string | null
            ingredients: typeof checks
        }
    >()

    for (const check of checks) {
        if (!recipeGroups.has(check.recipeId)) {
            recipeGroups.set(check.recipeId, {
                recipeId: check.recipeId,
                recipeTitle: check.recipeTitle,
                recipeImage: check.recipeImage,
                ingredients: [],
            })
        }
        recipeGroups.get(check.recipeId)!.ingredients.push(check)
    }

    const customItems = await db
        .select()
        .from(weeklyPlanCustomItems)
        .where(eq(weeklyPlanCustomItems.planId, plan.id))
        .orderBy(weeklyPlanCustomItems.name)

    return {
        restricted: false as const,
        planId: plan.id,
        role: access.role,
        recipeGroups: Array.from(recipeGroups.values()),
        customItems,
    }
}
