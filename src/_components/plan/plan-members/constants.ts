import { Eye, Pencil } from 'lucide-react'
import type { IAssignableRole } from '@/_lib/constants'

export const ROLE_OPTIONS: {
    key: IAssignableRole
    label: string
    icon: typeof Eye
}[] = [
    { key: 'viewer', label: 'Ver', icon: Eye },
    { key: 'editor', label: 'Editar', icon: Pencil },
]

export const DEFAULT_ROLE = ROLE_OPTIONS[1]

export const KEY_TO_LABEL = Object.fromEntries(
    ROLE_OPTIONS.map((r) => [r.key, r.label])
) as Record<string, string>

export const LABEL_TO_KEY = Object.fromEntries(
    ROLE_OPTIONS.map((r) => [r.label, r.key])
) as Record<string, IAssignableRole>

export const ROLE_ICONS = Object.fromEntries(
    ROLE_OPTIONS.map((r) => [r.key, r.icon])
) as Record<string, typeof Eye>
