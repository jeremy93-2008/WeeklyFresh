'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/_components/ui/button'

interface IRecipePaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function RecipePagination(props: IRecipePaginationProps) {
    const { page, totalPages, onPageChange } = props

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 py-2">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(Math.max(1, page - 1))}
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
                className="h-8 w-8"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
