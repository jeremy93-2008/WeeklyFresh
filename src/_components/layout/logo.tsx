import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'

export function Logo() {
    return (
        <Link
            href="/recetas"
            className="flex items-center gap-2 hover:opacity-80"
        >
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-semibold">WeeklyFresh</span>
        </Link>
    )
}
