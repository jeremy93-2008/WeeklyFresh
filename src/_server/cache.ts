import { revalidatePath } from 'next/cache'

export function revalidateRecipes(recipeId?: number) {
    revalidatePath('/recetas')
    revalidatePath('/favoritos')
    if (recipeId) {
        revalidatePath(`/recetas/${recipeId}`)
    }
}

export function revalidatePlan() {
    revalidatePath('/plan')
    revalidatePath('/lista')
}
