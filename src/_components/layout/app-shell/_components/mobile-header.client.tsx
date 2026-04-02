import { Logo } from '@/_components/layout/logo'
import { ThemeToggle } from '@/_components/layout/theme-toggle.client'
import { AuthButton } from '@/_components/layout/auth-button.client'

export function MobileHeaderShell() {
    return (
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-card px-4 md:hidden">
            <Logo />
            <div className="flex items-center gap-1">
                <ThemeToggle />
                <AuthButton variant="compact" />
            </div>
        </header>
    )
}