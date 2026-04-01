import type { IRecipe } from '@db/types'
import type { IMealTime } from '@/_lib/constants'

export interface ISelectedRecipe {
    recipeId: number
    title: string
    image: string | null
    dayOfWeek: number | null
    mealTime: IMealTime | null
}

export type IAvailableRecipe = Pick<
    IRecipe,
    'id' | 'title' | 'image' | 'isHellofresh'
>
