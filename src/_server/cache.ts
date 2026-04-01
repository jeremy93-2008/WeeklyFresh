import { revalidatePath } from 'next/cache'

const RECIPE_PATHS = ['/recetas', '/favoritos'] as const
const PLAN_PATHS = ['/plan', '/lista'] as const

export function revalidateRecipes(recipeId?: number) {
    RECIPE_PATHS.forEach((path) => revalidatePath(path))
    if (recipeId) revalidatePath(`/recetas/${recipeId}`)
}

export function revalidatePlan() {
    PLAN_PATHS.forEach((path) => revalidatePath(path))
}
