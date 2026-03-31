"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(recipeId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");

  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, userId),
      eq(favorites.recipeId, recipeId)
    ),
  });

  if (existing) {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId))
      );
  } else {
    await db.insert(favorites).values({ userId, recipeId });
  }

  revalidatePath("/recetas");
  revalidatePath("/favoritos");
}
