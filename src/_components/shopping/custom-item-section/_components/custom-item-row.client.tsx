'use client'

import { useTransition } from 'react'
import { X } from 'lucide-react'
import { Checkbox } from '@/_components/ui/checkbox'
import { Button } from '@/_components/ui/button'
import {
    toggleCustomItemCheck,
    removeCustomItem,
} from '@/_server/actions/shopping'
import { useOptimisticAction } from '@/_hooks/use-optimistic-action'
import { cn } from '@/_lib/utils'

interface ICustomItemRowProps {
    item: {
        id: number
        name: string
        checked: boolean
    }
}

export function CustomItemRow(props: ICustomItemRowProps) {
    const { item } = props
    const [isPending, startTransition] = useTransition()

    const { value: optimisticChecked, run: toggle } = useOptimisticAction(
        item.checked,
        () => toggleCustomItemCheck(item.id)
    )

    function handleRemove() {
        startTransition(async () => {
            await removeCustomItem(item.id)
        })
    }

    return (
        <div className="flex items-center gap-3 py-1">
            <Checkbox
                checked={optimisticChecked}
                onCheckedChange={() => toggle(!optimisticChecked)}
                disabled={isPending}
            />
            <span
                className={cn(
                    'flex-1 text-sm',
                    optimisticChecked && 'line-through text-muted-foreground'
                )}
            >
                {item.name}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleRemove}
                disabled={isPending}
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    )
}
