import { LoaderCircle } from 'lucide-react'

export default function Loading() {
    return (
        <main className="w-full h-screen flex items-center justify-center">
            <LoaderCircle className="text-primary w-14 h-14 animate-spin" />
        </main>
    )
}
