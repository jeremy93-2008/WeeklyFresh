import Image from 'next/image'
import Link from 'next/link'
import { getPlanPageSetup } from '@/_server/queries/page-setup'
import { getShoppingList } from '@/_server/queries/plans'
import { getImageUrl } from '@/_lib/image-utils'
import { WeekSelector } from '@/_components/plan/week-selector.client'
import { IngredientCheck } from '@/_components/shopping/ingredient-check.client'
import { CustomItemSection } from '@/_components/shopping/custom-item-section.client'
import { Separator } from '@/_components/ui/separator'
import { InviteToast } from '@/_components/layout/invite-toast.client'

interface IProps {
    searchParams: Promise<{ week?: string }>
}

export default async function ListaPage({ searchParams }: IProps) {
    const params = await searchParams
    const setup = await getPlanPageSetup(params.week)
    if (!setup) return null

    const { userId, weekStart, resolvedCount } = setup
    const data = await getShoppingList(userId, weekStart)

    return (
        <div className="mx-auto max-w-2xl space-y-6 p-4">
            <InviteToast count={resolvedCount} />
            <h1 className="text-2xl font-bold">Lista de Compra</h1>

            <WeekSelector basePath="/lista" selectedWeek={weekStart} />

            {!data ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No hay plan confirmado para esta semana.</p>
                    <Link
                        href="/plan"
                        className="text-primary hover:underline text-sm"
                    >
                        Ir a Plan Semanal
                    </Link>
                </div>
            ) : data.restricted ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No tienes acceso a la lista de compra de este plan.</p>
                    <p className="text-sm mt-1">
                        Pide al propietario que te dé permisos de edición.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.recipeGroups.map((group) => (
                        <div key={group.recipeId} className="space-y-2">
                            <Link
                                href={`/recetas/${group.recipeId}`}
                                className="flex items-center gap-2 hover:opacity-80"
                            >
                                <div className="relative h-8 w-8 overflow-hidden rounded">
                                    <Image
                                        src={getImageUrl(group.recipeImage)}
                                        alt={group.recipeTitle}
                                        fill
                                        className="object-cover"
                                        sizes="32px"
                                    />
                                </div>
                                <h2 className="text-sm font-semibold">
                                    {group.recipeTitle}
                                </h2>
                            </Link>
                            <div className="ml-10 space-y-0.5">
                                {group.ingredients.map((ing) => (
                                    <IngredientCheck
                                        key={ing.ingredientId}
                                        planId={data.planId}
                                        ingredientId={ing.ingredientId}
                                        checked={ing.checked}
                                        quantity={ing.quantity}
                                        unit={ing.unit}
                                        name={ing.name}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    <Separator />

                    <CustomItemSection
                        planId={data.planId}
                        items={data.customItems}
                    />
                </div>
            )}
        </div>
    )
}
