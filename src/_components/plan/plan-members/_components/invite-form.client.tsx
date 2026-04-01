'use client'

import { useState } from 'react'
import { Input } from '@/_components/ui/input'
import { Button } from '@/_components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/_components/ui/select'
import { inviteMember } from '@/_server/actions/members'
import { toast } from 'sonner'
import { handleActionError } from '@/_lib/error-utils'
import { ROLE_OPTIONS, DEFAULT_ROLE, LABEL_TO_KEY } from '../constants'

interface IInviteFormProps {
    planId: number
    isPending: boolean
    onInvited: (fn: () => Promise<void>) => void
}

export function InviteForm(props: IInviteFormProps) {
    const { planId, isPending, onInvited } = props
    const [email, setEmail] = useState('')
    const [roleLabel, setRoleLabel] = useState(DEFAULT_ROLE.label)

    function handleInvite() {
        if (!email.trim()) return
        const roleKey = LABEL_TO_KEY[roleLabel] ?? DEFAULT_ROLE.key
        onInvited(async () => {
            try {
                await inviteMember({ planId, email, role: roleKey })
                setEmail('')
                toast.success('Invitación enviada')
            } catch (e) {
                handleActionError(e, 'Error al invitar')
            }
        })
    }

    return (
        <div className="flex gap-2 pt-2 border-t">
            <Input
                type="email"
                placeholder="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                className="flex-1"
            />
            <Select
                value={roleLabel}
                onValueChange={(v) => v && setRoleLabel(v)}
            >
                <SelectTrigger className="w-[90px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r.key} value={r.label}>
                            {r.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                onClick={handleInvite}
                disabled={isPending || !email.trim()}
                size="sm"
            >
                Invitar
            </Button>
        </div>
    )
}
