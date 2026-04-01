import { db } from '@db'
import { weeklyPlanRecipes, recipes } from '@db/schema'
import { eq } from 'drizzle-orm'
import { getUserPlanForWeek } from '@/_lib/plan-permissions'

export async function getPlan(userId: string, weekStart: string) {
    const access = await getUserPlanForWeek(userId, weekStart)
    if (!access) return null

    const planRecipes = await db
        .select({
            recipeId: weeklyPlanRecipes.recipeId,
            dayOfWeek: weeklyPlanRecipes.dayOfWeek,
            mealTime: weeklyPlanRecipes.mealTime,
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
