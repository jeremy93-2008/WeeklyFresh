'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import { DAY_NAMES } from '@/_lib/constants'
import { getImageUrl } from '@/_lib/image-utils'
import { IPlanRecipe } from './types'
import { DayCard } from './_components/day-card'
import { ResetPlanDialog } from './_components/reset-plan-dialog.client'

interface IPlanConfirmedProps {
    planId: number
    recipes: IPlanRecipe[]
    role: 'owner' | 'viewer' | 'editor'
}

export function PlanConfirmed(props: IPlanConfirmedProps) {
    const { planId, recipes, role } = props

    const byDay = Object.groupBy(recipes, (r) => String(r.dayOfWeek))
    const unassigned = byDay['null'] ?? []

    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {DAY_NAMES.map((dayName, dayIdx) => (
                    <DayCard
                        key={dayIdx}
                        dayName={dayName}
                        recipes={byDay[String(dayIdx)] ?? []}
                    />
                ))}
            </div>

            {unassigned.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Sin día asignado
                    </h3>
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
                        {unassigned.map((r) => (
                            <Link
                                key={r.recipeId}
                                href={`/recetas/${r.recipeId}`}
                                className="flex items-center gap-2 rounded-lg border bg-card p-2 transition-colors hover:bg-muted/50"
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
                                <TruncatedText
                                    text={r.title}
                                    className="text-xs"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {role === 'owner' && <ResetPlanDialog planId={planId} />}
        </div>
    )
}
