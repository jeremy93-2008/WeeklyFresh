'use server'

import { db, recipes, ingredients, instructions, utensils } from '@db'
import { eq, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/_server/middleware'
import { recipeInputSchema, type IRecipeInput } from '@/_server/schemas'
import { revalidateRecipes } from '@/_server/cache'

// ─── Helpers ───

async function insertRecipeDetails(
    tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
    recipeId: number,
    data: IRecipeInput
) {
    if (data.ingredients.length > 0) {
        await tx.insert(ingredients).values(
            data.ingredients.map((ing) => ({
                recipeId,
                quantity: ing.quantity || null,
                unit: ing.unit || null,
                name: ing.name.trim(),
                shipped: ing.shipped,
            }))
        )
    }

    if (data.instructions.length > 0) {
        await tx.insert(instructions).values(
            data.instructions.map((inst, idx) => ({
                recipeId,
                stepOrder: idx,
                text: inst.text.trim(),
                image: inst.image,
            }))
        )
    }

    const validUtensils = data.utensils.filter((u) => u.trim())
    if (validUtensils.length > 0) {
        await tx.insert(utensils).values(
            validUtensils.map((u) => ({
                recipeId,
                text: u.trim(),
            }))
        )
    }
}

// ─── Actions ───

export async function createRecipe(data: IRecipeInput) {
    const userId = await requireAuth()
    const parsed = recipeInputSchema.parse(data)

    let recipeId: number

    await db.transaction(async (tx) => {
        const [recipe] = await tx
            .insert(recipes)
            .values({
                userId,
                title: parsed.title.trim(),
                image: parsed.image,
                url: null,
                isHellofresh: false,
                isPublic: parsed.isPublic,
            })
            .returning({ id: recipes.id })

        recipeId = recipe.id
        await insertRecipeDetails(tx, recipe.id, parsed)
    })

    revalidateRecipes()
    redirect(`/recetas/${recipeId!}`)
}

export async function updateRecipe(recipeId: number, data: IRecipeInput) {
    const userId = await requireAuth()
    const parsed = recipeInputSchema.parse(data)

    const recipe = await db.query.recipes.findFirst({
        where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
    })
    if (!recipe) throw new Error('Receta no encontrada')
    if (recipe.isHellofresh)
        throw new Error('No se puede editar una receta de HelloFresh')

    await db.transaction(async (tx) => {
        await tx
            .update(recipes)
            .set({
                title: parsed.title.trim(),
                image: parsed.image,
                isPublic: parsed.isPublic,
            })
            .where(eq(recipes.id, recipeId))

        await tx.delete(ingredients).where(eq(ingredients.recipeId, recipeId))
        await tx.delete(instructions).where(eq(instructions.recipeId, recipeId))
        await tx.delete(utensils).where(eq(utensils.recipeId, recipeId))

        await insertRecipeDetails(tx, recipeId, parsed)
    })

    revalidateRecipes(recipeId)
    redirect(`/recetas/${recipeId}`)
}

export async function deleteRecipe(recipeId: number) {
    const userId = await requireAuth()

    const recipe = await db.query.recipes.findFirst({
        where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
    })
    if (!recipe) throw new Error('Receta no encontrada')
    if (recipe.isHellofresh)
        throw new Error('No se puede eliminar una receta de HelloFresh')

    await db.delete(recipes).where(eq(recipes.id, recipeId))

    revalidateRecipes()
    redirect('/recetas')
}
