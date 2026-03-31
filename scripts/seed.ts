import { config } from "dotenv";
config({ path: ".env.local" });
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/db/schema";
import { parseIngredient } from "../src/lib/ingredient-parser";
import { extractFilename } from "../src/lib/image-utils";
import fs from "fs";
import path from "path";

const DATA_PATH = path.resolve(__dirname, "data.json");

interface RawRecipe {
  id: string;
  text: string;
  image: string;
  url: string;
  ingredients_shipped: { text: string }[];
  ingredients_not_shipped: { text: string }[];
  utensils: { text: string }[];
  instructions: { image?: string; text: string }[];
}

async function main() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/weeklyfresh",
  });

  const db = drizzle(pool, { schema });

  const rawData: RawRecipe[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  console.log(`Found ${rawData.length} recipes to seed.`);

  for (let i = 0; i < rawData.length; i++) {
    const raw = rawData[i];

    await db.transaction(async (tx) => {
      const imageFilename = extractFilename(raw.image);

      const [recipe] = await tx
        .insert(schema.recipes)
        .values({
          userId: null,
          title: raw.text,
          image: imageFilename,
          url: raw.url,
          isHellofresh: true,
          isPublic: true,
        })
        .returning({ id: schema.recipes.id });

      // Ingredients shipped
      if (raw.ingredients_shipped?.length) {
        await tx.insert(schema.ingredients).values(
          raw.ingredients_shipped.map((ing) => {
            const parsed = parseIngredient(ing.text);
            return {
              recipeId: recipe.id,
              quantity: parsed.quantity,
              unit: parsed.unit,
              name: parsed.name,
              shipped: true,
            };
          })
        );
      }

      // Ingredients not shipped
      if (raw.ingredients_not_shipped?.length) {
        await tx.insert(schema.ingredients).values(
          raw.ingredients_not_shipped.map((ing) => {
            const parsed = parseIngredient(ing.text);
            return {
              recipeId: recipe.id,
              quantity: parsed.quantity,
              unit: parsed.unit,
              name: parsed.name,
              shipped: false,
            };
          })
        );
      }

      // Instructions
      if (raw.instructions?.length) {
        await tx.insert(schema.instructions).values(
          raw.instructions.map((inst, idx) => ({
            recipeId: recipe.id,
            stepOrder: idx,
            text: inst.text,
            image: inst.image ? extractFilename(inst.image) : null,
          }))
        );
      }

      // Utensils
      if (raw.utensils?.length) {
        await tx.insert(schema.utensils).values(
          raw.utensils.map((u) => ({
            recipeId: recipe.id,
            text: u.text,
          }))
        );
      }
    });

    if ((i + 1) % 20 === 0 || i === rawData.length - 1) {
      console.log(`Seeded ${i + 1}/${rawData.length} recipes`);
    }
  }

  console.log("Seed complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
