'use client'

import { useSearchParams } from 'next/navigation'
import { useNavigateWithProgress } from '@/_hooks/use-navigate-with-progress'
import { Button } from '@/_components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface IPaginationProps {
    page: number
    totalPages: number
}

export function Pagination(props: IPaginationProps) {
    const { page, totalPages } = props
    const navigate = useNavigateWithProgress()
    const searchParams = useSearchParams()

    if (totalPages <= 1) return null

    function goToPage(p: number) {
        const params = new URLSearchParams(searchParams.toString())
        if (p > 1) {
            params.set('pagina', String(p))
        } else {
            params.delete('pagina')
        }
        navigate(`/recetas?${params.toString()}`, 'replace')
    }

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
