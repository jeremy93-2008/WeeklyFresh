'use client'

import Link from 'next/link'
import { NAV_ITEMS } from '@/_lib/constants'
import { cn } from '@/_lib/utils'

interface INavItemsProps {
    pathname: string
    layout: 'sidebar' | 'bar'
}

export function NavItems(props: INavItemsProps) {
    const { pathname, layout } = props
    return (
        <>
            {NAV_ITEMS.map((item) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/')
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center transition-colors',
                            layout === 'bar'
                                ? cn(
                                      'flex-col gap-0.5 text-xs',
                                      isActive
                                          ? 'text-primary font-medium'
                                          : 'text-muted-foreground'
                                  )
                                : cn(
                                      'gap-3 rounded-md px-3 py-2 text-sm',
                                      isActive
                                          ? 'bg-primary/10 text-primary font-medium'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                  )
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </>
    )
}
