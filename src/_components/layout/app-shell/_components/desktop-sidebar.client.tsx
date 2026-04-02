import { Logo } from '@/_components/layout/logo'
import { NavItems } from '@/_components/layout/nav-items.client'
import { AuthButton } from '@/_components/layout/auth-button.client'
import { ThemeToggle } from '@/_components/layout/theme-toggle.client'
import { usePathname } from 'next/navigation'

export function DesktopSidebarShell() {
    const pathname = usePathname()

    return (
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
    )
}