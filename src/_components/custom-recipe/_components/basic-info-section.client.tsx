'use client'

import { Input } from '@/_components/ui/input'
import { Switch } from '@/_components/ui/switch'
import { Label } from '@/_components/ui/label'

interface IBasicInfoSectionProps {
    title: string
    onTitleChange: (value: string) => void
    isPublic: boolean
    onPublicChange: (value: boolean) => void
}

export function BasicInfoSection(props: IBasicInfoSectionProps) {
    const { title, onTitleChange, isPublic, onPublicChange } = props
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                    id="title"
                    placeholder="Nombre de la receta"
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    required
                />
            </div>
            <div className="flex items-center gap-3">
                <Switch checked={isPublic} onCheckedChange={onPublicChange} />
                <Label>{isPublic ? 'Pública' : 'Privada'}</Label>
            </div>
        </div>
    )
}
