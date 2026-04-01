import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { getRecipeById } from '@/_server/queries/recipes'
import {
    RecipeForm,
    type IRecipeFormData,
} from '@/_components/custom-recipe/component.client'

interface IProps {
    params: Promise<{ id: string }>
}

export default async function EditarRecetaPage({ params }: IProps) {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const recipe = await getRecipeById(parseInt(id, 10), userId)
    if (!recipe) notFound()

    if (recipe.isHellofresh) redirect(`/recetas/${id}`)
    if (recipe.userId !== userId) redirect(`/recetas/${id}`)

    const initialData: IRecipeFormData = {
        id: recipe.id,
        title: recipe.title,
        isPublic: recipe.isPublic,
        image: recipe.image,
        ingredients: recipe.ingredients.map((ing) => ({
            quantity: ing.quantity ?? '',
            unit: ing.unit ?? '',
            name: ing.name,
            shipped: ing.shipped,
        })),
        instructions: recipe.instructions.map((inst) => ({
            text: inst.text,
            image: inst.image,
        })),
        utensils: recipe.utensils.map((u) => u.text),
    }

    return (
        <div className="mx-auto max-w-3xl p-4">
            <h1 className="text-2xl font-bold mb-6">Editar Receta</h1>
            <RecipeForm initialData={initialData} />
        </div>
    )
}
