import { z } from 'zod'
import { ASSIGNABLE_ROLES } from '@/_lib/constants'

export const recipeInputSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    image: z.string().nullable(),
    isPublic: z.boolean(),
    ingredients: z
        .array(
            z.object({
                quantity: z.string(),
                unit: z.string(),
                name: z
                    .string()
                    .min(1, 'El nombre del ingrediente es requerido'),
                shipped: z.boolean(),
            })
        )
        .min(1, 'Agrega al menos un ingrediente'),
    instructions: z.array(
        z.object({
            text: z.string(),
            image: z.string().nullable(),
        })
    ),
    utensils: z.array(z.string()),
})

export const confirmPlanSchema = z.object({
    weekStart: z
        .string()
        .refine(
            (s) => new Date(s).getDay() === 1,
            'weekStart debe ser un lunes'
        ),
    planRecipes: z
        .array(
            z.object({
                recipeId: z.number(),
                dayOfWeek: z.number().nullable(),
            })
        )
        .min(1, 'Selecciona al menos una receta'),
})

export const inviteMemberSchema = z.object({
    planId: z.number(),
    email: z.string().email('Email inválido'),
    role: z.enum(ASSIGNABLE_ROLES),
})

export type IRecipeInput = z.infer<typeof recipeInputSchema>
export type IConfirmPlanInput = z.infer<typeof confirmPlanSchema>
export type IInviteMemberInput = z.infer<typeof inviteMemberSchema>
