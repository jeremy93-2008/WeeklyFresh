import { RecipeCard } from './recipe-card'

interface IRecipe {
    id: number
    title: string
    image: string | null
    isHellofresh: boolean
    isFavorite: boolean
}

interface IRecipeGridProps {
    recipes: IRecipe[]
    view?: 'grid' | 'list'
}

export function RecipeGrid(props: IRecipeGridProps) {
    const { recipes, view = 'grid' } = props
    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">
                    No se encontraron recetas.
                </p>
            </div>
        )
    }

    if (view === 'list') {
        return (
            <div className="space-y-2">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        variant="list"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="grid" />
            ))}
        </div>
    )
}
