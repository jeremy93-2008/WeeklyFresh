"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { recipes, ingredients, instructions, utensils } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface IngredientInput {
  quantity: string;
  unit: string;
  name: string;
  shipped: boolean;
}

interface InstructionInput {
  text: string;
  image: string | null;
}

interface RecipeInput {
  title: string;
  image: string | null;
  isPublic: boolean;
  ingredients: IngredientInput[];
  instructions: InstructionInput[];
  utensils: string[];
}

// ─── Shared helpers ───

function validateRecipeInput(data: RecipeInput) {
  if (!data.title.trim()) throw new Error("El título es requerido");
  if (data.ingredients.length === 0)
    throw new Error("Agrega al menos un ingrediente");
}

async function insertRecipeDetails(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  recipeId: number,
  data: RecipeInput
) {
  if (data.ingredients.length > 0) {
    await tx.insert(ingredients).values(
      data.ingredients.map((ing) => ({
        recipeId,
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        name: ing.name.trim(),
        shipped: ing.shipped,
      }))
    );
  }

  if (data.instructions.length > 0) {
    await tx.insert(instructions).values(
      data.instructions.map((inst, idx) => ({
        recipeId,
        stepOrder: idx,
        text: inst.text.trim(),
        image: inst.image,
      }))
    );
  }

  const validUtensils = data.utensils.filter((u) => u.trim());
  if (validUtensils.length > 0) {
    await tx.insert(utensils).values(
      validUtensils.map((u) => ({
        recipeId,
        text: u.trim(),
      }))
    );
  }
}

// ─── Actions ───

export async function createRecipe(data: RecipeInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  validateRecipeInput(data);

  let recipeId: number;

  await db.transaction(async (tx) => {
    const [recipe] = await tx
      .insert(recipes)
      .values({
        userId,
        title: data.title.trim(),
        image: data.image,
        url: null,
        isHellofresh: false,
        isPublic: data.isPublic,
      })
      .returning({ id: recipes.id });

    recipeId = recipe.id;
    await insertRecipeDetails(tx, recipe.id, data);
  });

  revalidatePath("/recetas");
  redirect(`/recetas/${recipeId!}`);
}

export async function updateRecipe(recipeId: number, data: RecipeInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  validateRecipeInput(data);

  const recipe = await db.query.recipes.findFirst({
    where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
  });
  if (!recipe) throw new Error("Receta no encontrada");
  if (recipe.isHellofresh)
    throw new Error("No se puede editar una receta de HelloFresh");

  await db.transaction(async (tx) => {
    await tx
      .update(recipes)
      .set({
        title: data.title.trim(),
        image: data.image,
        isPublic: data.isPublic,
      })
      .where(eq(recipes.id, recipeId));

    // Clear old details and re-insert
    await tx.delete(ingredients).where(eq(ingredients.recipeId, recipeId));
    await tx.delete(instructions).where(eq(instructions.recipeId, recipeId));
    await tx.delete(utensils).where(eq(utensils.recipeId, recipeId));

    await insertRecipeDetails(tx, recipeId, data);
  });

  revalidatePath("/recetas");
  revalidatePath(`/recetas/${recipeId}`);
  redirect(`/recetas/${recipeId}`);
}

export async function deleteRecipe(recipeId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const recipe = await db.query.recipes.findFirst({
    where: and(eq(recipes.id, recipeId), eq(recipes.userId, userId)),
  });

  if (!recipe) throw new Error("Receta no encontrada");
  if (recipe.isHellofresh)
    throw new Error("No se puede eliminar una receta de HelloFresh");

  await db.delete(recipes).where(eq(recipes.id, recipeId));

  revalidatePath("/recetas");
  redirect("/recetas");
}
