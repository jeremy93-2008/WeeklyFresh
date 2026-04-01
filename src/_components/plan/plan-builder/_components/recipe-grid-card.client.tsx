'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { getImageUrl } from '@/_lib/image-utils'
import { RecipeActions } from '../../recipe-actions.client'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import type { IAvailableRecipe } from '../types'

interface IRecipeGridCardProps {
    recipe: IAvailableRecipe
    onAdd: (recipe: IAvailableRecipe) => void
}

export function RecipeGridCard(props: IRecipeGridCardProps) {
    const { recipe, onAdd } = props

    return (
        <div className="group cursor-pointer overflow-hidden rounded-lg border bg-card text-left transition-shadow hover:shadow-md">
            <div
                className="relative aspect-[4/3] overflow-hidden"
                onClick={() => onAdd(recipe)}
            >
                <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors group-hover:bg-primary/60">
                    <Plus className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
            </div>
            <div className="flex items-center gap-1 p-2">
                <TruncatedText
                    text={recipe.title}
                    className="flex-1 text-sm font-medium"
                />
                <RecipeActions recipe={recipe} onAdd={() => onAdd(recipe)} />
            </div>
        </div>
    )
}
