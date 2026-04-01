'use client'

import { useState, useTransition } from 'react'
import { createRecipe, updateRecipe } from '@/_server/actions/recipes'
import { toast } from 'sonner'

export interface IIngredientRow {
    quantity: string
    unit: string
    name: string
    shipped: boolean
}

export interface IInstructionRow {
    text: string
    image: string | null
}

export interface IRecipeFormData {
    id?: number
    title: string
    isPublic: boolean
    image: string | null
    ingredients: IIngredientRow[]
    instructions: IInstructionRow[]
    utensils: string[]
}

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
    const [imageUrl, setImageUrl] = useState<string | null>(
        initialData?.image ?? null
    )
    const [ingredients, setIngredients] = useState<IIngredientRow[]>(
        initialData?.ingredients?.length
            ? initialData.ingredients
            : [EMPTY_INGREDIENT]
    )
    const [instructions, setInstructions] = useState<IInstructionRow[]>(
        initialData?.instructions?.length
            ? initialData.instructions
            : [EMPTY_INSTRUCTION]
    )
    const [utensils, setUtensils] = useState<string[]>(
        initialData?.utensils?.length ? initialData.utensils : ['']
    )
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)

    // ─── Filtered (valid) data ───

    const validIngredients = ingredients.filter((r) => r.name.trim())
    const validInstructions = instructions.filter((r) => r.text.trim())
    const validUtensils = utensils.filter((u) => u.trim())

    // ─── Ingredient actions ───

    function updateIngredient(
        idx: number,
        field: keyof IIngredientRow,
        value: string | boolean
    ) {
        setIngredients((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
        )
    }

    function addIngredient() {
        setIngredients((prev) => [...prev, { ...EMPTY_INGREDIENT }])
    }

    function removeIngredient(idx: number) {
        setIngredients((prev) => prev.filter((_, i) => i !== idx))
    }

    // ─── Instruction actions ───

    function updateInstruction(idx: number, text: string) {
        setInstructions((prev) =>
            prev.map((row, i) => (i === idx ? { ...row, text } : row))
        )
    }

    function addInstruction() {
        setInstructions((prev) => [...prev, { ...EMPTY_INSTRUCTION }])
    }

    function removeInstruction(idx: number) {
        setInstructions((prev) => prev.filter((_, i) => i !== idx))
    }

    function moveInstruction(idx: number, dir: -1 | 1) {
        setInstructions((prev) => {
            const arr = [...prev]
            const target = idx + dir
            if (target < 0 || target >= arr.length) return arr
            ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
            return arr
        })
    }

    // ─── Utensil actions ───

    function updateUtensil(idx: number, value: string) {
        setUtensils((prev) => prev.map((v, i) => (i === idx ? value : v)))
    }

    function addUtensil() {
        setUtensils((prev) => [...prev, ''])
    }

    function removeUtensil(idx: number) {
        setUtensils((prev) => prev.filter((_, i) => i !== idx))
    }

    // ─── Image upload ───

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.url) setImageUrl(data.url)
            else throw new Error('Upload failed')
        } catch {
            toast.error('Error al subir imagen')
        } finally {
            setIsUploading(false)
        }
    }

    function removeImage() {
        setImageUrl(null)
    }

    // ─── Submit ───

    function validate(): string | null {
        if (!title.trim()) return 'El título es requerido'
        if (validIngredients.length === 0)
            return 'Agrega al menos un ingrediente'
        return null
    }

    function handleSubmit() {
        const error = validate()
        if (error) {
            toast.error(error)
            return
        }

        startTransition(async () => {
            try {
                const payload = {
                    title,
                    image: imageUrl,
                    isPublic,
                    ingredients: validIngredients,
                    instructions: validInstructions,
                    utensils: validUtensils,
                }
                if (isEditing) {
                    await updateRecipe(initialData!.id!, payload)
                    toast.success('Receta actualizada')
                } else {
                    await createRecipe(payload)
                    toast.success('Receta creada')
                }
            } catch (e) {
                toast.error(
                    e instanceof Error ? e.message : 'Error al guardar receta'
                )
            }
        })
    }

    return {
        // State
        title,
        setTitle,
        isPublic,
        setIsPublic,
        imageUrl,
        isUploading,
        ingredients,
        instructions,
        utensils,
        isPending,
        isEditing,

        // Derived
        validIngredients,
        validInstructions,
        validUtensils,

        // Ingredient actions
        updateIngredient,
        addIngredient,
        removeIngredient,

        // Instruction actions
        updateInstruction,
        addInstruction,
        removeInstruction,
        moveInstruction,

        // Utensil actions
        updateUtensil,
        addUtensil,
        removeUtensil,

        // Image actions
        handleImageUpload,
        removeImage,

        // Submit
        handleSubmit,
    }
}
