import { config } from 'dotenv'
config({ path: '.env.local' })

import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq, isNotNull, and, not, like } from 'drizzle-orm'
import { put } from '@vercel/blob'
import * as schema from '../db/schema'
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.resolve(
    __dirname,
    '../../scraping/hello-fresh/scraping/hello-fresh-images'
)

const DB_URL = process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL!

async function main() {
    const pool = new Pool({ connectionString: DB_URL })
    const db = drizzle(pool, { schema })

    // Get all unique image filenames from recipes and instructions
    const recipeImages = await db
        .select({ id: schema.recipes.id, image: schema.recipes.image })
        .from(schema.recipes)
        .where(
            and(
                isNotNull(schema.recipes.image),
                not(like(schema.recipes.image, 'http%'))
            )
        )

    const instructionImages = await db
        .select({
            id: schema.instructions.id,
            image: schema.instructions.image,
        })
        .from(schema.instructions)
        .where(
            and(
                isNotNull(schema.instructions.image),
                not(like(schema.instructions.image, 'http%'))
            )
        )

    // Collect unique filenames
    const allFilenames = new Set<string>()
    for (const r of recipeImages) if (r.image) allFilenames.add(r.image)
    for (const i of instructionImages) if (i.image) allFilenames.add(i.image)

    console.log(`Found ${allFilenames.size} unique images to upload`)

    // Upload and track mapping: filename → blob URL
    const urlMap = new Map<string, string>()
    let uploaded = 0
    let skipped = 0

    for (const filename of allFilenames) {
        const filePath = path.join(IMAGES_DIR, filename)

        if (!fs.existsSync(filePath)) {
            console.warn(`  SKIP (not found): ${filename}`)
            skipped++
            continue
        }

        try {
            const fileBuffer = fs.readFileSync(filePath)
            const blob = await put(`recipes/${filename}`, fileBuffer, {
                access: 'public',
                contentType: 'image/jpeg',
                token: process.env.BLOB_READ_WRITE_TOKEN!,
            })
            urlMap.set(filename, blob.url)
            uploaded++

            if (uploaded % 20 === 0) {
                console.log(`  Uploaded ${uploaded}/${allFilenames.size}`)
            }
        } catch (err) {
            console.error(`  ERROR uploading ${filename}:`, err)
        }
    }

    console.log(`\nUploaded: ${uploaded}, Skipped: ${skipped}`)
    console.log('Updating database...')

    // Update recipe images
    let updatedRecipes = 0
    for (const r of recipeImages) {
        const blobUrl = r.image ? urlMap.get(r.image) : null
        if (blobUrl) {
            await db
                .update(schema.recipes)
                .set({ image: blobUrl })
                .where(eq(schema.recipes.id, r.id))
            updatedRecipes++
        }
    }

    // Update instruction images
    let updatedInstructions = 0
    for (const i of instructionImages) {
        const blobUrl = i.image ? urlMap.get(i.image) : null
        if (blobUrl) {
            await db
                .update(schema.instructions)
                .set({ image: blobUrl })
                .where(eq(schema.instructions.id, i.id))
            updatedInstructions++
        }
    }

    console.log(
        `Updated ${updatedRecipes} recipes, ${updatedInstructions} instructions`
    )
    console.log('Done!')
    await pool.end()
}

main().catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
})
