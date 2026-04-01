'use client'

import { useState } from 'react'
import { useNavigateWithProgress } from '@/_hooks/use-navigate-with-progress'
import {
    startOfWeek,
    addWeeks,
    subWeeks,
    format,
    endOfWeek,
    isSameDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import { cn } from '@/_lib/utils'

interface IWeekSelectorProps {
    basePath: string
    selectedWeek?: string
}

function formatWeekRange(monday: Date) {
    const sunday = endOfWeek(monday, { weekStartsOn: 1 })
    const from = format(monday, 'd MMM', { locale: es })
    const to = format(sunday, 'd MMM', { locale: es })
    return `${from} - ${to}`
}

export function WeekSelector(props: IWeekSelectorProps) {
    const { basePath, selectedWeek } = props
    const navigate = useNavigateWithProgress()

    const currentMonday = startOfWeek(new Date(), { weekStartsOn: 1 })
    const selected = selectedWeek
        ? startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 })
        : currentMonday

    const [windowStart, setWindowStart] = useState(() => subWeeks(selected, 1))

    const weeks = Array.from({ length: 4 }, (_, i) => addWeeks(windowStart, i))

    function selectWeek(monday: Date) {
        const dateStr = format(monday, 'yyyy-MM-dd')
        navigate(`${basePath}?week=${dateStr}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setWindowStart((s) => subWeeks(s, 1))}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex flex-1 gap-1.5 overflow-x-auto">
                {weeks.map((monday) => {
                    const key = format(monday, 'yyyy-MM-dd')
                    return (
                        <button
                            key={key}
                            onClick={() => selectWeek(monday)}
                            className={cn(
                                'flex-1 min-w-[100px] rounded-md border px-2 py-1.5 text-xs text-center transition-colors',
                                isSameDay(monday, selected)
                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                    : 'border-border hover:bg-muted',
                                isSameDay(monday, currentMonday) &&
                                    !isSameDay(monday, selected) &&
                                    'border-primary/30'
                            )}
                        >
                            {formatWeekRange(monday)}
                        </button>
                    )
                })}
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setWindowStart((s) => addWeeks(s, 1))}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
