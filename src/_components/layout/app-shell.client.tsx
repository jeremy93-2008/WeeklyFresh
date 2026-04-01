'use client'

import { usePathname } from 'next/navigation'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle.client'
import { AuthButton } from './auth-button.client'
import { NavItems } from './nav-items.client'

interface IAppShellProps {
    children: React.ReactNode
}

export function AppShell(props: IAppShellProps) {
    const { children } = props
    const pathname = usePathname()

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="fixed left-0 inset-y-0 z-50 hidden w-60 flex-col border-r bg-card md:flex">
                <div className="flex h-14 items-center border-b px-4">
                    <Logo />
                </div>
                <nav className="flex-1 space-y-1 p-3">
                    <NavItems pathname={pathname} layout="sidebar" />
                </nav>
                <div className="flex items-center justify-between border-t p-3">
                    <AuthButton />
                    <ThemeToggle />
                </div>
            </aside>

            {/* Mobile header */}
            <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
                <Logo />
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <AuthButton variant="compact" />
                </div>
            </header>

            <main className="flex-1 pb-16 md:pb-0 md:pl-60">{children}</main>

            {/* Mobile bottom nav */}
            <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-card md:hidden safe-area-bottom">
                <div className="flex h-14 items-center justify-around">
                    <NavItems pathname={pathname} layout="bar" />
                </div>
            </nav>
        </>
    )
}
