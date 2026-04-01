'use client'

import { Button } from '@/_components/ui/button'

interface IConfirmBarProps {
    count: number
    isPending: boolean
    onConfirm: () => void
}

export function ConfirmBar(props: IConfirmBarProps) {
    const { count, isPending, onConfirm } = props

    if (count === 0) return null

    return (
        <div className="sticky bottom-16 md:bottom-0 bg-background/95 backdrop-blur border-t p-3 -mx-4">
            <Button onClick={onConfirm} disabled={isPending} className="w-full">
                {isPending
                    ? 'Confirmando...'
                    : `Confirmar Plan (${count} receta${count !== 1 ? 's' : ''})`}
            </Button>
        </div>
    )
}
