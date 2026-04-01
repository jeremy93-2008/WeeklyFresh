export interface ISelectedRecipe {
    recipeId: number
    title: string
    image: string | null
    dayOfWeek: number | null
}

export interface IAvailableRecipe {
    id: number
    title: string
    image: string | null
    isHellofresh: boolean
}
