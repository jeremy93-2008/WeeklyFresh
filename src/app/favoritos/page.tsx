import { auth } from '@clerk/nextjs/server'
import { db } from '@db'
import { favorites, recipes } from '@db/schema'
import { eq } from 'drizzle-orm'
import { RecipeGrid } from '@/_components/recipes/recipe-grid'
import Link from 'next/link'

export default async function FavoritosPage() {
    const { userId } = await auth()
    if (!userId) return null

    const favs = await db
        .select({
            id: recipes.id,
            title: recipes.title,
            image: recipes.image,
            isHellofresh: recipes.isHellofresh,
            isPublic: recipes.isPublic,
        })
        .from(favorites)
        .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
        .where(eq(favorites.userId, userId))
        .orderBy(recipes.title)

    const recipesWithFav = favs.map((r) => ({ ...r, isFavorite: true }))

    return (
        <div className="mx-auto max-w-6xl space-y-4 p-4">
            <h1 className="text-2xl font-bold">Favoritos</h1>

            {recipesWithFav.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">
                        No tienes recetas favoritas.{' '}
                        <Link
                            href="/recetas"
                            className="text-primary hover:underline"
                        >
                            Explora el catálogo
                        </Link>{' '}
                        para agregar algunas.
                    </p>
                </div>
            ) : (
                <RecipeGrid recipes={recipesWithFav} />
            )}
        </div>
    )
}
