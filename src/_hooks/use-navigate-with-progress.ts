'use client'

import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'

export function useNavigateWithProgress() {
    const router = useRouter()

    return (url: string, method: 'push' | 'replace' = 'push') => {
        NProgress.start()
        router[method](url)
    }
}
