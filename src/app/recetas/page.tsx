import { auth } from '@clerk/nextjs/server'
import { getRecipes, getDistinctUtensils } from '@/_server/queries/recipes'
import { RecipeSearch } from '@/_components/recipes/recipe-search.client'
import { RecipeGrid } from '@/_components/recipes/recipe-grid'
import { Pagination } from '@/_components/recipes/pagination.client'
import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface IProps {
    searchParams: Promise<{
        q?: string
        ingrediente?: string
        utensilio?: string
        vista?: string
        pagina?: string
    }>
}

export default async function RecetasPage({ searchParams }: IProps) {
    const params = await searchParams
    const { userId } = await auth()

    const page = parseInt(params.pagina ?? '1', 10)
    const view = (params.vista as 'grid' | 'list') ?? 'grid'

    const [data, utensilOptions] = await Promise.all([
        getRecipes({
            search: params.q,
            ingredients: params.ingrediente
                ? params.ingrediente.split(',').filter(Boolean)
                : undefined,
            utensil: params.utensilio,
            page,
            userId,
        }),
        getDistinctUtensils(),
    ])

    return (
        <div className="mx-auto max-w-6xl space-y-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Recetas</h1>
                <Link
                    href="/recetas/nueva"
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
                >
                    <Plus className="mr-1.5 h-4 w-4" />
                    Nueva receta
                </Link>
            </div>

            <Suspense>
                <RecipeSearch utensilOptions={utensilOptions} />
            </Suspense>

            <p className="text-sm text-muted-foreground">
                {data.total} receta{data.total !== 1 ? 's' : ''}
            </p>

            <RecipeGrid recipes={data.recipes} view={view} />

            <Pagination page={data.page} totalPages={data.totalPages} />
        </div>
    )
}
