import { toast } from 'sonner'

export function handleActionError(
    e: unknown,
    fallback = 'Ha ocurrido un error'
) {
    toast.error(e instanceof Error ? e.message : fallback)
}
