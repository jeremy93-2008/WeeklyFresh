'use client'

import { Mail, X } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import { Badge } from '@/_components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { KEY_TO_LABEL, ROLE_ICONS } from '../constants'
import { Eye } from 'lucide-react'
import type { IMember } from '../types'

interface IMemberListItemProps {
    member: IMember
    isOwner: boolean
    onRemove: (memberId: number) => void
    onRoleChange: (memberId: number, newLabel: string) => void
    isPending: boolean
}

export function MemberListItem(props: IMemberListItemProps) {
    const { member, isOwner, onRemove, onRoleChange, isPending } = props
    const RoleIcon = ROLE_ICONS[member.role] ?? Eye

    return (
        <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 truncate">{member.email}</span>
            {!member.userId && (
                <Badge variant="secondary" className="text-xs">
                    Pendiente
                </Badge>
            )}
            {isOwner ? (
                <>
                    <Select
                        value={KEY_TO_LABEL[member.role] ?? 'Ver'}
                        onValueChange={(v) => v && onRoleChange(member.id, v)}
                    >
                        <SelectTrigger className="w-[90px] h-7 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Ver">Ver</SelectItem>
                            <SelectItem value="Editar">Editar</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onRemove(member.id)}
                        disabled={isPending}
                    >
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </>
            ) : (
                <Badge variant="outline" className="text-xs gap-1">
                    <RoleIcon className="h-3 w-3" />
                    {KEY_TO_LABEL[member.role] ?? member.role}
                </Badge>
            )}
        </div>
    )
}
