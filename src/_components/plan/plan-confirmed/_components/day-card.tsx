import Image from 'next/image'
import Link from 'next/link'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import { getImageUrl } from '@/_lib/image-utils'
import { IPlanRecipe } from '../types'

interface IDayCardProps {
    dayName: string
    recipes: IPlanRecipe[]
}

export function DayCard(props: IDayCardProps) {
    const { dayName, recipes } = props

    return (
        <div className="rounded-lg border bg-card p-3 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
                {dayName}
            </h3>
            {recipes.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">---</p>
            ) : (
                recipes.map((r) => (
                    <Link
                        key={r.recipeId}
                        href={`/recetas/${r.recipeId}`}
                        className="flex items-center gap-2 rounded p-1 transition-colors hover:bg-muted"
                    >
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            <Image
                                src={getImageUrl(r.image)}
                                alt={r.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        </div>
                        <TruncatedText text={r.title} className="text-xs" />
                    </Link>
                ))
            )}
        </div>
    )
}
