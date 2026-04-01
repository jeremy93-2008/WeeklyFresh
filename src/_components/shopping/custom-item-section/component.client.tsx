'use client'

import { useState, useTransition } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/_components/ui/input'
import { Button } from '@/_components/ui/button'
import { addCustomItem } from '@/_server/actions/shopping'
import { handleActionError } from '@/_lib/error-utils'
import { CustomItemRow } from './_components/custom-item-row.client'

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
