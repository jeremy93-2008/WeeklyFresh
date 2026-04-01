'use client'

import { useOptimistic, useTransition } from 'react'

export function useOptimisticAction<T>(
    currentValue: T,
    action: () => Promise<void>
) {
    const [isPending, startTransition] = useTransition()
    const [optimistic, setOptimistic] = useOptimistic(currentValue)

    function run(newValue: T) {
        startTransition(async () => {
            setOptimistic(newValue)
            await action()
        })
    }

    return { value: optimistic, isPending, run }
}
