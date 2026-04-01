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
