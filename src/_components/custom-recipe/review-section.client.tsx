'use client'

import { Button } from '@/_components/ui/button'
import type { IIngredientRow, IInstructionRow } from '@/_hooks/use-recipe-form'

interface IReviewSectionProps {
    title: string
    isPublic: boolean
    ingredients: IIngredientRow[]
    instructions: IInstructionRow[]
    utensils: string[]
    isEditing: boolean
    isPending: boolean
    onSubmit: () => void
}

export function ReviewSection(props: IReviewSectionProps) {
    const {
        title,
        isPublic,
        ingredients,
        instructions,
        utensils,
        isEditing,
        isPending,
        onSubmit,
    } = props
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium">Título</h3>
                <p className="text-sm">{title || '—'}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium">Visibilidad</h3>
                <p className="text-sm">{isPublic ? 'Pública' : 'Privada'}</p>
            </div>
            <div>
                <h3 className="text-sm font-medium">
                    Ingredientes ({ingredients.length})
                </h3>
                <ul className="text-sm space-y-0.5">
                    {ingredients.map((ing, i) => (
                        <li key={i}>
                            {[ing.quantity, ing.unit].filter(Boolean).join(' ')}{' '}
                            {(ing.quantity || ing.unit) && '— '}
                            {ing.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-sm font-medium">
                    Instrucciones ({instructions.length})
                </h3>
                <ol className="text-sm list-decimal ml-4 space-y-0.5">
                    {instructions.map((inst, i) => (
                        <li key={i}>{inst.text}</li>
                    ))}
                </ol>
            </div>
            {utensils.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium">Utensilios</h3>
                    <p className="text-sm">{utensils.join(', ')}</p>
                </div>
            )}
            <Button onClick={onSubmit} disabled={isPending} className="w-full">
                {isPending
                    ? 'Guardando...'
                    : isEditing
                      ? 'Guardar Cambios'
                      : 'Crear Receta'}
            </Button>
        </div>
    )
}
