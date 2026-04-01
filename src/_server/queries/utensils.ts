import { db } from '@db'
import { utensils } from '@db/schema'

export async function getDistinctUtensils() {
    const result = await db
        .selectDistinct({ text: utensils.text })
        .from(utensils)
        .orderBy(utensils.text)
    return result.map((r) => r.text)
}
