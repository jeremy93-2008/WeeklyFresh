import { Eye, Pencil } from 'lucide-react'

export const ROLE_MAP: Record<
    string,
    { label: string; key: 'viewer' | 'editor' }
> = {
    Ver: { label: 'Ver', key: 'viewer' },
    Editar: { label: 'Editar', key: 'editor' },
}

export const KEY_TO_LABEL: Record<string, string> = {
    viewer: 'Ver',
    editor: 'Editar',
}

export const ROLE_ICONS: Record<string, typeof Eye> = {
    viewer: Eye,
    editor: Pencil,
}
