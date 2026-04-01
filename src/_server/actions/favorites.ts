'use server'

import { db, favorites } from '@db'
import { and, eq } from 'drizzle-orm'
import { requireAuth } from '@/_server/middleware'
import { revalidateRecipes } from '@/_server/cache'

export async function toggleFavorite(recipeId: number) {
    const userId = await requireAuth()

    const existing = await db.query.favorites.findFirst({
        where: and(
            eq(favorites.userId, userId),
            eq(favorites.recipeId, recipeId)
        ),
    })

    if (existing) {
        await db
            .delete(favorites)
            .where(
                and(
                    eq(favorites.userId, userId),
                    eq(favorites.recipeId, recipeId)
                )
            )
    } else {
        await db.insert(favorites).values({ userId, recipeId })
    }

    revalidateRecipes()
}
