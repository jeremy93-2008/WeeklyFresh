import Image from 'next/image'
import Link from 'next/link'
import { Sun, Moon } from 'lucide-react'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import { getImageUrl } from '@/_lib/image-utils'
import { IPlanRecipe } from '../types'

interface IDayCardProps {
    dayName: string
    recipes: IPlanRecipe[]
}

export function DayCard(props: IDayCardProps) {
    const { dayName, recipes } = props

    if (recipes.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-3 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {dayName}
                </h3>
                <p className="text-xs text-muted-foreground/60">---</p>
            </div>
        )
    }

    const lunch = recipes.filter((r) => (r.mealTime ?? 'lunch') === 'lunch')
    const dinner = recipes.filter((r) => r.mealTime === 'dinner')
    const hasBoth = lunch.length > 0 && dinner.length > 0

    return (
        <div className="rounded-lg border bg-card p-3 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
                {dayName}
            </h3>
            {hasBoth ? (
                <div className="grid grid-cols-2 gap-2">
                    <MealColumn
                        icon={<Sun className="h-3 w-3" />}
                        label="Almuerzo"
                        recipes={lunch}
                    />
                    <MealColumn
                        icon={<Moon className="h-3 w-3" />}
                        label="Cena"
                        recipes={dinner}
                    />
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        {dinner.length > 0 ? (
                            <Moon className="h-3 w-3" />
                        ) : (
                            <Sun className="h-3 w-3" />
                        )}
                        <span className="text-[10px]">
                            {dinner.length > 0 ? 'Cena' : 'Almuerzo'}
                        </span>
                    </div>
                    <RecipeList recipes={recipes} />
                </>
            )}
        </div>
    )
}

function MealColumn(props: {
    icon: React.ReactNode
    label: string
    recipes: IPlanRecipe[]
}) {
    const { icon, label, recipes } = props
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-muted-foreground">
                {icon}
                <span className="text-[10px]">{label}</span>
            </div>
            <RecipeList recipes={recipes} />
        </div>
    )
}

function RecipeList(props: { recipes: IPlanRecipe[] }) {
    const { recipes } = props
    return (
        <>
            {recipes.map((r) => (
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
            ))}
        </>
    )
}
