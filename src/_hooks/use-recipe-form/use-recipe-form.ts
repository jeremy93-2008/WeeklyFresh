'use client'

import { useState, useTransition } from 'react'
import { createRecipe, updateRecipe } from '@/_server/actions/recipes'
import { handleActionError } from '@/_lib/error-utils'
import { toast } from 'sonner'
import { useListState } from './use-list-state'
import { useImageUpload } from './use-image-upload'
import type { IIngredientRow, IInstructionRow, IRecipeFormData } from './types'

const EMPTY_INGREDIENT: IIngredientRow = {
    quantity: '',
    unit: '',
    name: '',
    shipped: true,
}
const EMPTY_INSTRUCTION: IInstructionRow = { text: '', image: null }

export function useRecipeForm(initialData?: IRecipeFormData) {
    const isEditing = !!initialData?.id

    const [title, setTitle] = useState(initialData?.title ?? '')
    const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? true)
    const [isPending, startTransition] = useTransition()

    const ingredientList = useListState(
        initialData?.ingredients ?? [],
        EMPTY_INGREDIENT
    )
    const instructionList = useListState(
        initialData?.instructions ?? [],
        EMPTY_INSTRUCTION
    )
    const utensilList = useListState(initialData?.utensils ?? [], '')
    const image = useImageUpload(initialData?.image ?? null)

    const validIngredients = ingredientList.items.filter((r) => r.name.trim())
    const validInstructions = instructionList.items.filter((r) => r.text.trim())
    const validUtensils = utensilList.items.filter((u) =>
        typeof u === 'string' ? u.trim() : false
    )

    function updateIngredient(
        idx: number,
        field: keyof IIngredientRow,
        value: string | boolean
    ) {
        const current = ingredientList.items[idx]
        if (!current) return
        ingredientList.update(idx, { ...current, [field]: value })
    }

    function updateInstruction(idx: number, text: string) {
        const current = instructionList.items[idx]
        if (!current) return
        instructionList.update(idx, { ...current, text })
    }

    function updateUtensil(idx: number, value: string) {
        utensilList.update(idx, value)
    }

    function handleSubmit() {
        if (!title.trim()) {
            toast.error('El título es requerido')
            return
        }
        if (validIngredients.length === 0) {
            toast.error('Agrega al menos un ingrediente')
            return
        }

        startTransition(async () => {
            try {
                const payload = {
                    title,
                    image: image.imageUrl,
                    isPublic,
                    ingredients: validIngredients,
                    instructions: validInstructions,
                    utensils: validUtensils as string[],
                }
                if (isEditing && initialData?.id) {
                    await updateRecipe(initialData.id, payload)
                    toast.success('Receta actualizada')
                } else {
                    await createRecipe(payload)
                    toast.success('Receta creada')
                }
            } catch (e) {
                handleActionError(e, 'Error al guardar receta')
            }
        })
    }

    return {
        // State
        title,
        setTitle,
        isPublic,
        setIsPublic,
        imageUrl: image.imageUrl,
        isUploading: image.isUploading,
        ingredients: ingredientList.items,
        instructions: instructionList.items,
        utensils: utensilList.items as string[],
        isPending,
        isEditing,

        // Derived
        validIngredients,
        validInstructions,
        validUtensils: validUtensils as string[],

        // Ingredient actions
        updateIngredient,
        addIngredient: ingredientList.add,
        removeIngredient: ingredientList.remove,

        // Instruction actions
        updateInstruction,
        addInstruction: instructionList.add,
        removeInstruction: instructionList.remove,
        moveInstruction: instructionList.move,

        // Utensil actions
        updateUtensil,
        addUtensil: utensilList.add,
        removeUtensil: utensilList.remove,

        // Image actions
        handleImageUpload: image.handleUpload,
        removeImage: image.removeImage,

        // Submit
        handleSubmit,
    }
}
