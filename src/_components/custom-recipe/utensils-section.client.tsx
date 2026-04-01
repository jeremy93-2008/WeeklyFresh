'use client'

import { Plus, X } from 'lucide-react'
import { Input } from '@/_components/ui/input'
import { Button } from '@/_components/ui/button'

interface IUtensilsSectionProps {
    rows: string[]
    onUpdate: (idx: number, value: string) => void
    onAdd: () => void
    onRemove: (idx: number) => void
}

export function UtensilsSection(props: IUtensilsSectionProps) {
    const { rows, onUpdate, onAdd, onRemove } = props
    return (
        <div className="space-y-3">
            {rows.map((row, idx) => (
                <div key={idx} className="flex gap-2">
                    <Input
                        placeholder="Utensilio"
                        value={row}
                        onChange={(e) => onUpdate(idx, e.target.value)}
                        className="flex-1"
                    />
                    {rows.length > 1 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => onRemove(idx)}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Agregar utensilio
            </Button>
        </div>
    )
}
