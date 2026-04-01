'use client'

import Image from 'next/image'
import { getImageUrl } from '@/_lib/image-utils'
import { RecipeActions } from '../../recipe-actions.client'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import type { IAvailableRecipe } from '../types'

interface IRecipeListRowProps {
    recipe: IAvailableRecipe
    onAdd: (recipe: IAvailableRecipe) => void
}

export function RecipeListRow(props: IRecipeListRowProps) {
    const { recipe, onAdd } = props

    return (
        <div
            onClick={() => onAdd(recipe)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg border bg-card p-2 text-left transition-colors hover:bg-muted/50"
        >
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded">
                <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                />
            </div>
            <TruncatedText
                text={recipe.title}
                maxLines={1}
                className="flex-1 text-sm"
            />
            <RecipeActions recipe={recipe} onAdd={() => onAdd(recipe)} />
        </div>
    )
}
