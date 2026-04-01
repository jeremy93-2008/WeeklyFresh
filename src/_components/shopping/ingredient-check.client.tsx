'use client'

import { Checkbox } from '@/_components/ui/checkbox'
import { toggleIngredientCheck } from '@/_server/actions/shopping'
import { useOptimisticAction } from '@/_hooks/use-optimistic-action'
import { cn } from '@/_lib/utils'

interface IIngredientCheckProps {
    planId: number
    ingredientId: number
    checked: boolean
    quantity: string | null
    unit: string | null
    name: string
}

export function IngredientCheck(props: IIngredientCheckProps) {
    const { planId, ingredientId, checked, quantity, unit, name } = props

    const {
        value: optimisticChecked,
        isPending,
        run: toggle,
    } = useOptimisticAction(checked, () =>
        toggleIngredientCheck(planId, ingredientId)
    )

    const label = [quantity, unit].filter(Boolean).join(' ')

    return (
        <label className="flex items-center gap-3 py-1 cursor-pointer">
            <Checkbox
                checked={optimisticChecked}
                onCheckedChange={() => toggle(!optimisticChecked)}
                disabled={isPending}
            />
            <span
                className={cn(
                    'text-sm',
                    optimisticChecked && 'line-through text-muted-foreground'
                )}
            >
                {label && (
                    <span className="text-muted-foreground">{label} — </span>
                )}
                {name}
            </span>
        </label>
    )
}
