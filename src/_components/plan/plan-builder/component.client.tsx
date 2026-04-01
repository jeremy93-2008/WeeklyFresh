'use client'

import { useState, useMemo, useTransition } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import { Input } from '@/_components/ui/input'
import { confirmPlan } from '@/_server/actions/plans'
import { cn } from '@/_lib/utils'
import { toast } from 'sonner'
import { handleActionError } from '@/_lib/error-utils'
import type { IAvailableRecipe, ISelectedRecipe } from './types'
import { SelectedRecipeRow } from './_components/selected-recipe-row.client'
import { RecipeGridCard } from './_components/recipe-grid-card.client'
import { RecipeListRow } from './_components/recipe-list-row.client'
import { RecipePagination } from './_components/recipe-pagination.client'
import { ConfirmBar } from './_components/confirm-bar.client'

interface IPlanBuilderProps {
    weekStart: string
    availableRecipes: IAvailableRecipe[]
}

export function PlanBuilder(props: IPlanBuilderProps) {
    const { weekStart, availableRecipes } = props
    const [selected, setSelected] = useState<ISelectedRecipe[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [page, setPage] = useState(1)
    const [isPending, startTransition] = useTransition()
    const perPage = 16

    const { paginated, totalPages } = useMemo(() => {
        const selectedIds = new Set(selected.map((r) => r.recipeId))
        const filtered = availableRecipes.filter(
            (r) =>
                !selectedIds.has(r.id) &&
                r.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        return {
            paginated: filtered.slice((page - 1) * perPage, page * perPage),
            totalPages: Math.ceil(filtered.length / perPage),
        }
    }, [availableRecipes, selected, searchQuery, page, perPage])

    function addRecipe(recipe: IAvailableRecipe) {
        setSelected((prev) => [
            ...prev,
            {
                recipeId: recipe.id,
                title: recipe.title,
                image: recipe.image,
                dayOfWeek: null,
            },
        ])
    }

    function removeRecipe(recipeId: number) {
        setSelected((prev) => prev.filter((r) => r.recipeId !== recipeId))
    }

    function setDay(recipeId: number, day: number | null) {
        setSelected((prev) =>
            prev.map((r) =>
                r.recipeId === recipeId ? { ...r, dayOfWeek: day } : r
            )
        )
    }

    function handleConfirm() {
        startTransition(async () => {
            try {
                await confirmPlan({
                    weekStart,
                    planRecipes: selected.map((r) => ({
                        recipeId: r.recipeId,
                        dayOfWeek: r.dayOfWeek,
                    })),
                })
                toast.success('Plan confirmado')
            } catch (e) {
                handleActionError(e, 'Error al confirmar')
            }
        })
    }

    return (
        <div className="space-y-6">
            {selected.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-sm font-medium">
                        Recetas seleccionadas ({selected.length})
                    </h2>
                    <div className="space-y-2">
                        {selected.map((recipe) => (
                            <SelectedRecipeRow
                                key={recipe.recipeId}
                                recipe={recipe}
                                onSetDay={setDay}
                                onRemove={removeRecipe}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium flex-1">
                        Agregar recetas
                    </h2>
                    <div className="flex rounded-md border">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setView('grid')}
                            className={cn(
                                'rounded-r-none h-8 w-8',
                                view === 'grid' && 'bg-muted'
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setView('list')}
                            className={cn(
                                'rounded-l-none h-8 w-8',
                                view === 'list' && 'bg-muted'
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <Input
                    placeholder="Buscar recetas..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setPage(1)
                    }}
                />

                {view === 'grid' ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {paginated.map((recipe) => (
                            <RecipeGridCard
                                key={recipe.id}
                                recipe={recipe}
                                onAdd={addRecipe}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {paginated.map((recipe) => (
                            <RecipeListRow
                                key={recipe.id}
                                recipe={recipe}
                                onAdd={addRecipe}
                            />
                        ))}
                    </div>
                )}

                <RecipePagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            <ConfirmBar
                count={selected.length}
                isPending={isPending}
                onConfirm={handleConfirm}
            />
        </div>
    )
}
