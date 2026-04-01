import type { IRecipe } from '@db/types'

export interface ISelectedRecipe {
    recipeId: number
    title: string
    image: string | null
    dayOfWeek: number | null
}

export type IAvailableRecipe = Pick<
    IRecipe,
    'id' | 'title' | 'image' | 'isHellofresh'
>
