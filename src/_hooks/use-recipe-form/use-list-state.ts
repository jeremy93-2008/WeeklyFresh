'use client'

import { useState } from 'react'

/**
 * Generic hook for managing an ordered list of items with CRUD + move operations.
 * Used by ingredients, instructions, and utensils.
 */
export function useListState<T>(initial: T[], empty: T) {
    const [items, setItems] = useState<T[]>(
        initial.length > 0 ? initial : [empty]
    )

    function update(idx: number, value: T) {
        setItems((prev) => prev.map((item, i) => (i === idx ? value : item)))
    }

    function add() {
        setItems((prev) => [...prev, { ...empty }])
    }

    function remove(idx: number) {
        setItems((prev) => prev.filter((_, i) => i !== idx))
    }

    function move(idx: number, dir: -1 | 1) {
        setItems((prev) => {
            const arr = [...prev]
            const target = idx + dir
            if (target < 0 || target >= arr.length) return arr
            ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
            return arr
        })
    }

    return { items, update, add, remove, move }
}
