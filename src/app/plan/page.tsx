import { getPlanPageSetup } from '@/_server/queries/page-setup'
import { getPlan } from '@/_server/queries/plans'
import { getRecipes } from '@/_server/queries/recipes'
import { WeekSelector } from '@/_components/plan/week-selector.client'
import { PlanBuilder } from '@/_components/plan/plan-builder/component.client'
import { PlanConfirmed } from '@/_components/plan/plan-confirmed/component.client'
import { PlanMembers } from '@/_components/plan/plan-members/component.client'
import { Badge } from '@/_components/ui/badge'
import { InviteToast } from '@/_components/layout/invite-toast.client'

interface IProps {
    searchParams: Promise<{ week?: string }>
}

export default async function PlanPage({ searchParams }: IProps) {
    const params = await searchParams
    const setup = await getPlanPageSetup(params.week)
    if (!setup) return null

    const { userId, weekStart, resolvedCount } = setup
    const plan = await getPlan(userId, weekStart)

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4">
            <InviteToast count={resolvedCount} />
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold flex-1">Plan Semanal</h1>
                {plan && plan.role !== 'owner' && (
                    <Badge variant="secondary">Plan compartido</Badge>
                )}
                {plan && (
                    <PlanMembers
                        planId={plan.id}
                        members={plan.members}
                        isOwner={plan.role === 'owner'}
                    />
                )}
            </div>

            <WeekSelector basePath="/plan" selectedWeek={weekStart} />

            {plan ? (
                <PlanConfirmed
                    planId={plan.id}
                    recipes={plan.recipes}
                    role={plan.role}
                />
            ) : (
                <PlanBuilderWrapper weekStart={weekStart} userId={userId} />
            )}
        </div>
    )
}

async function PlanBuilderWrapper({
    weekStart,
    userId,
}: {
    weekStart: string
    userId: string
}) {
    const data = await getRecipes({ limit: 200, userId })
    return (
        <PlanBuilder
            weekStart={weekStart}
            availableRecipes={data.recipes.map((r) => ({
                id: r.id,
                title: r.title,
                image: r.image,
                isHellofresh: r.isHellofresh,
            }))}
        />
    )
}
