'use client'

import { useState, useTransition } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/_components/ui/dialog'
import { resetPlan } from '@/_server/actions/plans'
import { toast } from 'sonner'
import { handleActionError } from '@/_lib/error-utils'

interface IResetPlanDialogProps {
    planId: number
}

export function ResetPlanDialog(props: IResetPlanDialogProps) {
    const { planId } = props
    const [isPending, startTransition] = useTransition()
    const [dialogOpen, setDialogOpen] = useState(false)

    function handleReset() {
        startTransition(async () => {
            try {
                await resetPlan(planId)
                toast.success('Plan reiniciado')
                setDialogOpen(false)
            } catch (e) {
                handleActionError(e, 'Error al reiniciar')
            }
        })
    }

    return (
        <>
            <Button
                variant="destructive"
                className="w-full"
                onClick={() => setDialogOpen(true)}
            >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar Plan
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reiniciar plan semanal</DialogTitle>
                        <DialogDescription>
                            Se eliminarán todas las recetas del plan y la lista
                            de compra asociada. Esta acción no se puede
                            deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReset}
                            disabled={isPending}
                        >
                            {isPending ? 'Reiniciando...' : 'Reiniciar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
