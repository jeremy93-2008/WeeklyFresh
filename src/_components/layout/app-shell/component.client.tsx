'use client'

import { DesktopSidebarShell } from '@/_components/layout/app-shell/_components/desktop-sidebar.client'
import { MobileHeaderShell } from '@/_components/layout/app-shell/_components/mobile-header.client'
import { MobileBottomShell } from '@/_components/layout/app-shell/_components/mobile-bottom.client'

interface IAppShellProps {
    children: React.ReactNode
}

export function AppShell(props: IAppShellProps) {
    const { children } = props

    return (
        <>
            <DesktopSidebarShell />
            <MobileHeaderShell />
            <main className="flex-1 pb-16 md:pb-0 md:pl-60">{children}</main>
            <MobileBottomShell />
        </>
    )
}
