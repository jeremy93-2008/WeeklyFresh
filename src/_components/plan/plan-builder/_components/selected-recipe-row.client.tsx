'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { DAY_NAMES } from '@/_lib/constants'
import { getImageUrl } from '@/_lib/image-utils'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import type { ISelectedRecipe } from '../types'

interface ISelectedRecipeRowProps {
    recipe: ISelectedRecipe
    onSetDay: (recipeId: number, day: number | null) => void
    onRemove: (recipeId: number) => void
}

export function SelectedRecipeRow(props: ISelectedRecipeRowProps) {
    const { recipe, onSetDay, onRemove } = props

    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-2">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                <Image
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                />
            </div>
            <TruncatedText
                text={recipe.title}
                maxLines={1}
                className="flex-1 text-sm"
            />
            <Select
                value={
                    recipe.dayOfWeek !== null
                        ? DAY_NAMES[recipe.dayOfWeek]
                        : 'Sin asignar'
                }
                onValueChange={(v) => {
                    if (!v) return
                    const idx = DAY_NAMES.indexOf(
                        v as (typeof DAY_NAMES)[number]
                    )
                    onSetDay(recipe.recipeId, idx >= 0 ? idx : null)
                }}
            >
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Sin asignar">Sin asignar</SelectItem>
                    {DAY_NAMES.map((name) => (
                        <SelectItem key={name} value={name}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemove(recipe.recipeId)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
