import {
    pgTable,
    serial,
    text,
    boolean,
    integer,
    date,
    primaryKey,
    uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Recipes & content ───

export const recipes = pgTable('recipes', {
    id: serial('id').primaryKey(),
    userId: text('user_id'),
    title: text('title').notNull(),
    image: text('image'),
    url: text('url'),
    isHellofresh: boolean('is_hellofresh').notNull().default(false),
    isPublic: boolean('is_public').notNull().default(true),
})

export const recipesRelations = relations(recipes, ({ many }) => ({
    ingredients: many(ingredients),
    instructions: many(instructions),
    utensils: many(utensils),
    favorites: many(favorites),
    weeklyPlanRecipes: many(weeklyPlanRecipes),
}))

export const ingredients = pgTable('ingredients', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
        .notNull()
        .references(() => recipes.id, { onDelete: 'cascade' }),
    quantity: text('quantity'),
    unit: text('unit'),
    name: text('name').notNull(),
    shipped: boolean('shipped').notNull().default(false),
})

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, {
        fields: [ingredients.recipeId],
        references: [recipes.id],
    }),
}))

export const instructions = pgTable('instructions', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
        .notNull()
        .references(() => recipes.id, { onDelete: 'cascade' }),
    stepOrder: integer('step_order').notNull(),
    text: text('text').notNull(),
    image: text('image'),
})

export const instructionsRelations = relations(instructions, ({ one }) => ({
    recipe: one(recipes, {
        fields: [instructions.recipeId],
        references: [recipes.id],
    }),
}))

export const utensils = pgTable('utensils', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
        .notNull()
        .references(() => recipes.id, { onDelete: 'cascade' }),
    text: text('text').notNull(),
})

export const utensilsRelations = relations(utensils, ({ one }) => ({
    recipe: one(recipes, {
        fields: [utensils.recipeId],
        references: [recipes.id],
    }),
}))

export const favorites = pgTable(
    'favorites',
    {
        userId: text('user_id').notNull(),
        recipeId: integer('recipe_id')
            .notNull()
            .references(() => recipes.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.userId, t.recipeId] })]
)

export const favoritesRelations = relations(favorites, ({ one }) => ({
    recipe: one(recipes, {
        fields: [favorites.recipeId],
        references: [recipes.id],
    }),
}))

// ─── Weekly planning ───

export const weeklyPlans = pgTable(
    'weekly_plans',
    {
        id: serial('id').primaryKey(),
        userId: text('user_id').notNull(),
        weekStart: date('week_start').notNull(),
    },
    (t) => [uniqueIndex('weekly_plans_user_week_idx').on(t.userId, t.weekStart)]
)

export const weeklyPlansRelations = relations(weeklyPlans, ({ many }) => ({
    recipes: many(weeklyPlanRecipes),
    ingredientChecks: many(weeklyPlanIngredientChecks),
    customItems: many(weeklyPlanCustomItems),
    members: many(planMembers),
}))

export const planMembers = pgTable(
    'plan_members',
    {
        id: serial('id').primaryKey(),
        planId: integer('plan_id')
            .notNull()
            .references(() => weeklyPlans.id, { onDelete: 'cascade' }),
        userId: text('user_id'),
        email: text('email').notNull(),
        role: text('role').notNull(), // "viewer" | "editor"
    },
    (t) => [uniqueIndex('plan_members_plan_email_idx').on(t.planId, t.email)]
)

export const planMembersRelations = relations(planMembers, ({ one }) => ({
    plan: one(weeklyPlans, {
        fields: [planMembers.planId],
        references: [weeklyPlans.id],
    }),
}))

export const weeklyPlanRecipes = pgTable(
    'weekly_plan_recipes',
    {
        planId: integer('plan_id')
            .notNull()
            .references(() => weeklyPlans.id, { onDelete: 'cascade' }),
        recipeId: integer('recipe_id')
            .notNull()
            .references(() => recipes.id, { onDelete: 'cascade' }),
        dayOfWeek: integer('day_of_week'),
        mealTime: text('meal_time'),
    },
    (t) => [primaryKey({ columns: [t.planId, t.recipeId] })]
)

export const weeklyPlanRecipesRelations = relations(
    weeklyPlanRecipes,
    ({ one }) => ({
        plan: one(weeklyPlans, {
            fields: [weeklyPlanRecipes.planId],
            references: [weeklyPlans.id],
        }),
        recipe: one(recipes, {
            fields: [weeklyPlanRecipes.recipeId],
            references: [recipes.id],
        }),
    })
)

// ─── Shopping list ───

export const weeklyPlanIngredientChecks = pgTable(
    'weekly_plan_ingredient_checks',
    {
        planId: integer('plan_id')
            .notNull()
            .references(() => weeklyPlans.id, { onDelete: 'cascade' }),
        ingredientId: integer('ingredient_id')
            .notNull()
            .references(() => ingredients.id, { onDelete: 'cascade' }),
        checked: boolean('checked').notNull().default(false),
    },
    (t) => [primaryKey({ columns: [t.planId, t.ingredientId] })]
)

export const weeklyPlanIngredientChecksRelations = relations(
    weeklyPlanIngredientChecks,
    ({ one }) => ({
        plan: one(weeklyPlans, {
            fields: [weeklyPlanIngredientChecks.planId],
            references: [weeklyPlans.id],
        }),
        ingredient: one(ingredients, {
            fields: [weeklyPlanIngredientChecks.ingredientId],
            references: [ingredients.id],
        }),
    })
)

export const weeklyPlanCustomItems = pgTable('weekly_plan_custom_items', {
    id: serial('id').primaryKey(),
    planId: integer('plan_id')
        .notNull()
        .references(() => weeklyPlans.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    checked: boolean('checked').notNull().default(false),
})

export const weeklyPlanCustomItemsRelations = relations(
    weeklyPlanCustomItems,
    ({ one }) => ({
        plan: one(weeklyPlans, {
            fields: [weeklyPlanCustomItems.planId],
            references: [weeklyPlans.id],
        }),
    })
)
