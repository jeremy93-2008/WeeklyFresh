import { NavItems } from '@/_components/layout/nav-items.client'
import { usePathname } from 'next/navigation'

export function MobileBottomShell() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-card md:hidden safe-area-bottom">
            <div className="flex h-14 items-center justify-around">
                <NavItems pathname={pathname} layout="bar" />
            </div>
        </nav>
    )
}