'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function useImageUpload(initial: string | null) {
    const [imageUrl, setImageUrl] = useState<string | null>(initial)
    const [isUploading, setIsUploading] = useState(false)

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.url) setImageUrl(data.url)
            else throw new Error('Upload failed')
        } catch {
            toast.error('Error al subir imagen')
        } finally {
            setIsUploading(false)
        }
    }

    function removeImage() {
        setImageUrl(null)
    }

    return { imageUrl, isUploading, handleUpload, removeImage }
}
