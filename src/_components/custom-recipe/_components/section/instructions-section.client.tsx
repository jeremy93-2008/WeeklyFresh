'use client'

import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Textarea } from '@/_components/ui/textarea'
import { Button } from '@/_components/ui/button'
import type { IInstructionRow } from '@/_hooks/use-recipe-form'

interface IInstructionsSectionProps {
    rows: IInstructionRow[]
    onUpdate: (idx: number, text: string) => void
    onAdd: () => void
    onRemove: (idx: number) => void
    onMove: (idx: number, dir: -1 | 1) => void
}

export function InstructionsSection(props: IInstructionsSectionProps) {
    const { rows, onUpdate, onAdd, onRemove, onMove } = props
    return (
        <div className="space-y-3">
            {rows.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground mt-1">
                        {idx + 1}
                    </span>
                    <Textarea
                        placeholder={`Paso ${idx + 1}`}
                        value={row.text}
                        onChange={(e) => onUpdate(idx, e.target.value)}
                        className="flex-1"
                        rows={2}
                    />
                    <div className="flex flex-col gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onMove(idx, -1)}
                            disabled={idx === 0}
                        >
                            <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onMove(idx, 1)}
                            disabled={idx === rows.length - 1}
                        >
                            <ArrowDown className="h-3 w-3" />
                        </Button>
                        {rows.length > 1 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onRemove(idx)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Agregar paso
            </Button>
        </div>
    )
}
