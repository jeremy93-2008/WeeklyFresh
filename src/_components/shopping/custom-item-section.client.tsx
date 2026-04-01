'use client'

import { useState, useTransition } from 'react'
import { Plus, X } from 'lucide-react'
import { Checkbox } from '@/_components/ui/checkbox'
import { Input } from '@/_components/ui/input'
import { Button } from '@/_components/ui/button'
import {
    addCustomItem,
    removeCustomItem,
    toggleCustomItemCheck,
} from '@/_server/actions/shopping'
import { useOptimisticAction } from '@/_hooks/use-optimistic-action'
import { handleActionError } from '@/_lib/error-utils'
import { cn } from '@/_lib/utils'

interface ICustomItem {
    id: number
    name: string
    checked: boolean
}

interface ICustomItemSectionProps {
    planId: number
    items: ICustomItem[]
}

export function CustomItemSection(props: ICustomItemSectionProps) {
    const { planId, items } = props
    const [newItemName, setNewItemName] = useState('')
    const [isPending, startTransition] = useTransition()

    function handleAdd() {
        const name = newItemName.trim()
        if (!name) return

        startTransition(async () => {
            try {
                await addCustomItem(planId, name)
                setNewItemName('')
            } catch (e) {
                handleActionError(e, 'Error al agregar')
            }
        })
    }

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
                Otros ingredientes
            </h3>

            {items.map((item) => (
                <CustomItemRow key={item.id} item={item} />
            ))}

            <div className="flex gap-2">
                <Input
                    placeholder="Agregar ingrediente..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className="flex-1"
                />
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAdd}
                    disabled={isPending || !newItemName.trim()}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

interface ICustomItemRowProps {
    item: ICustomItem
}

function CustomItemRow(props: ICustomItemRowProps) {
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
