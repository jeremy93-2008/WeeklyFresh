import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/_components/ui/sonner'
import { TooltipProvider } from '@/_components/ui/tooltip'
import { AppShell } from '@/_components/layout/app-shell.client'
import { NavigationProgress } from '@/_components/layout/navigation-progress.client'
import './globals.css'

const poppins = Poppins({
    variable: '--font-sans',
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'WeeklyFresh',
    description: 'Planifica tus comidas semanales',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ClerkProvider localization={esES}>
            <html
                lang="es"
                suppressHydrationWarning
                className={`${poppins.variable} h-full antialiased`}
            >
                <body className="min-h-full flex flex-col font-sans">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <TooltipProvider>
                            <NavigationProgress />
                            <AppShell>{children}</AppShell>
                            <Toaster />
                        </TooltipProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
