import {
    UtensilsCrossed,
    CalendarDays,
    ShoppingCart,
    Heart,
} from 'lucide-react'

export const NAV_ITEMS = [
    { href: '/recetas', label: 'Recetas', icon: UtensilsCrossed },
    { href: '/plan', label: 'Plan', icon: CalendarDays },
    { href: '/lista', label: 'Lista', icon: ShoppingCart },
    { href: '/favoritos', label: 'Favoritos', icon: Heart },
] as const

export const DAY_NAMES = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
] as const

export const PLAN_ROLES = ['viewer', 'editor', 'owner'] as const
export type IPlanRole = (typeof PLAN_ROLES)[number]

export const ASSIGNABLE_ROLES = ['viewer', 'editor'] as const
export type IAssignableRole = (typeof ASSIGNABLE_ROLES)[number]

export const DAY_NAMES_SHORT = [
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb',
    'Dom',
] as const
