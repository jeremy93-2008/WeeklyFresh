import { ingredients, instructions, utensils } from '@db'
import type { IRecipeInput } from '@/_server/schemas'
import type { db } from '@db'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export async function insertRecipeDetails(
    tx: Transaction,
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
