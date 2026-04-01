import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Pencil } from 'lucide-react'
import { getRecipeById } from '@/_server/queries/recipes'
import { getImageUrl } from '@/_lib/image-utils'
import { HelloFreshBadge } from '@/_components/recipes/hellofresh-badge'
import { FavoriteButton } from '@/_components/recipes/favorite-button.client'
import { Badge } from '@/_components/ui/badge'
import { Separator } from '@/_components/ui/separator'

interface IProps {
    params: Promise<{ id: string }>
}

export default async function RecipeDetailPage({ params }: IProps) {
    const { id } = await params
    const { userId } = await auth()
    const recipe = await getRecipeById(parseInt(id, 10), userId)

    if (!recipe) notFound()

    const shippedIngredients = recipe.ingredients.filter((i) => i.shipped)
    const notShippedIngredients = recipe.ingredients.filter((i) => !i.shipped)

    return (
        <div className="mx-auto max-w-4xl">
            {/* Hero image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden md:rounded-b-lg">
                <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 896px"
                    priority
                />
            </div>

            <div className="space-y-6 p-4 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
                {/* Sidebar on desktop */}
                <div className="space-y-6 md:col-span-1 md:sticky md:top-4 md:self-start">
                    {/* Title */}
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h1 className="text-2xl font-bold">
                                {recipe.title}
                            </h1>
                            <FavoriteButton
                                recipeId={recipe.id}
                                isFavorite={recipe.isFavorite}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {recipe.isHellofresh && <HelloFreshBadge />}
                            {recipe.url && (
                                <Link
                                    href={recipe.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    Ver en HelloFresh
                                </Link>
                            )}
                            {!recipe.isHellofresh &&
                                recipe.userId === userId && (
                                    <Link
                                        href={`/recetas/${recipe.id}/editar`}
                                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Editar
                                    </Link>
                                )}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Ingredientes</h2>
                        {shippedIngredients.length > 0 && (
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Enviados
                                </h3>
                                <ul className="space-y-1">
                                    {shippedIngredients.map((ing) => (
                                        <li key={ing.id} className="text-sm">
                                            <span className="text-muted-foreground">
                                                {[ing.quantity, ing.unit]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                            </span>
                                            {(ing.quantity || ing.unit) &&
                                                ' — '}
                                            {ing.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {notShippedIngredients.length > 0 && (
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    No enviados
                                </h3>
                                <ul className="space-y-1">
                                    {notShippedIngredients.map((ing) => (
                                        <li key={ing.id} className="text-sm">
                                            <span className="text-muted-foreground">
                                                {[ing.quantity, ing.unit]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                            </span>
                                            {(ing.quantity || ing.unit) &&
                                                ' — '}
                                            {ing.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Utensils */}
                    {recipe.utensils.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">
                                Utensilios
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                {recipe.utensils.map((u) => (
                                    <Badge key={u.id} variant="secondary">
                                        {u.text}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="space-y-6 md:col-span-2">
                    <h2 className="text-lg font-semibold">Instrucciones</h2>
                    {recipe.instructions.map((step, idx) => (
                        <div key={step.id} className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                    {idx + 1}
                                </span>
                                <p className="text-sm leading-relaxed">
                                    {step.text}
                                </p>
                            </div>
                            {step.image && (
                                <div className="relative ml-10 aspect-[16/10] overflow-hidden rounded-lg">
                                    <Image
                                        src={getImageUrl(step.image)}
                                        alt={`Paso ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 90vw, 600px"
                                    />
                                </div>
                            )}
                            {idx < recipe.instructions.length - 1 && (
                                <Separator className="ml-10" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
