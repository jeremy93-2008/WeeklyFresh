'use client'

import Image from 'next/image'
import { X, Sun, Moon } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/_components/ui/toggle-group'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/_components/ui/tooltip'
import { DAY_NAMES, type IMealTime } from '@/_lib/constants'
import { getImageUrl } from '@/_lib/image-utils'
import { TruncatedText } from '@/_components/ui/truncated-text.client'
import type { ISelectedRecipe } from '../types'

interface ISelectedRecipeRowProps {
    recipe: ISelectedRecipe
    onSetDay: (recipeId: number, day: number | null) => void
    onSetMealTime: (recipeId: number, mealTime: IMealTime) => void
    onRemove: (recipeId: number) => void
}

export function SelectedRecipeRow(props: ISelectedRecipeRowProps) {
    const { recipe, onSetDay, onSetMealTime, onRemove } = props

    return (
        <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
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
            {recipe.dayOfWeek !== null && (
                <ToggleGroup
                    value={[recipe.mealTime ?? 'lunch']}
                    onValueChange={(value) => {
                        const next = value[value.length - 1] as IMealTime
                        if (next) onSetMealTime(recipe.recipeId, next)
                    }}
                    variant="outline"
                    size="sm"
                >
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <ToggleGroupItem
                                    value="lunch"
                                    aria-label="Almuerzo"
                                />
                            }
                        >
                            <Sun className="h-3.5 w-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>Almuerzo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <ToggleGroupItem
                                    value="dinner"
                                    aria-label="Cena"
                                />
                            }
                        >
                            <Moon className="h-3.5 w-3.5" />
                        </TooltipTrigger>
                        <TooltipContent>Cena</TooltipContent>
                    </Tooltip>
                </ToggleGroup>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => onRemove(recipe.recipeId)}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
