export interface IParsedIngredient {
    quantity: string | null
    unit: string | null
    name: string
}

export function parseIngredient(text: string): IParsedIngredient {
    const parts = text.split(' - ')

    if (parts.length < 2) {
        return { quantity: null, unit: null, name: text.trim() }
    }

    const name = parts.slice(1).join(' - ').trim()
    const left = parts[0].trim()

    const match = left.match(/^(\d+(?:[.,]\d+)?)\s+(.+)$/)
    if (match) {
        return {
            quantity: match[1],
            unit: match[2].trim(),
            name,
        }
    }

    // No numeric prefix — whole left side is the unit (e.g. "pizca(s)")
    return {
        quantity: null,
        unit: left || null,
        name,
    }
}
