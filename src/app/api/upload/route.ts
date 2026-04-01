import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { put } from '@vercel/blob'
import nodePath from 'path'
import fs from 'fs/promises'

async function saveFile(filename: string, file: File): Promise<string> {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return blob.url
    }

    const bytes = await file.arrayBuffer()
    const uploadsDir = nodePath.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.writeFile(nodePath.join(uploadsDir, filename), Buffer.from(bytes))
    return `/uploads/${filename}`
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
        return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const ext = nodePath.extname(file.name) || '.jpg'
    const filename = `${userId}-${Date.now()}${ext}`
    const url = await saveFile(filename, file)

    return NextResponse.json({ url })
}
