import type {
    recipes,
    ingredients,
    instructions,
    utensils,
    favorites,
    weeklyPlans,
    planMembers,
    weeklyPlanRecipes,
    weeklyPlanIngredientChecks,
    weeklyPlanCustomItems,
} from './schema'

export type IRecipe = typeof recipes.$inferSelect
export type IIngredient = typeof ingredients.$inferSelect
export type IInstruction = typeof instructions.$inferSelect
export type IUtensil = typeof utensils.$inferSelect
export type IFavorite = typeof favorites.$inferSelect
export type IWeeklyPlan = typeof weeklyPlans.$inferSelect
export type IPlanMember = typeof planMembers.$inferSelect
export type IWeeklyPlanRecipe = typeof weeklyPlanRecipes.$inferSelect
export type IWeeklyPlanIngredientCheck =
    typeof weeklyPlanIngredientChecks.$inferSelect
export type IWeeklyPlanCustomItem = typeof weeklyPlanCustomItems.$inferSelect
