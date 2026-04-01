'use client'

import { useState, useTransition } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/_components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/_components/ui/dialog'
import { Badge } from '@/_components/ui/badge'
import { removeMember, updateMemberRole } from '@/_server/actions/members'
import { toast } from 'sonner'
import { handleActionError } from '@/_lib/error-utils'
import { ROLE_MAP } from './constants'
import { MemberListItem } from './_components/member-list-item.client'
import { InviteForm } from './_components/invite-form.client'
import type { IMember } from './types'

interface IPlanMembersProps {
    planId: number
    members: IMember[]
    isOwner: boolean
}

export function PlanMembers(props: IPlanMembersProps) {
    const { planId, members, isOwner } = props
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    function handleRemove(memberId: number) {
        startTransition(async () => {
            try {
                await removeMember(planId, memberId)
                toast.success('Miembro eliminado')
            } catch (e) {
                handleActionError(e, 'Error')
            }
        })
    }

    function handleRoleChange(memberId: number, newLabel: string) {
        const roleKey = ROLE_MAP[newLabel]?.key
        if (!roleKey) return
        startTransition(async () => {
            try {
                await updateMemberRole(planId, memberId, roleKey)
            } catch (e) {
                handleActionError(e, 'Error')
            }
        })
    }

    function handleInvited(fn: () => Promise<void>) {
        startTransition(async () => {
            await fn()
        })
    }

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                className="gap-2"
            >
                <Users className="h-4 w-4" />
                Miembros
                {members.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                        {members.length}
                    </Badge>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Miembros del plan
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {members.length > 0 ? (
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <MemberListItem
                                        key={member.id}
                                        member={member}
                                        isOwner={isOwner}
                                        onRemove={handleRemove}
                                        onRoleChange={handleRoleChange}
                                        isPending={isPending}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No hay miembros. Invita a alguien para compartir
                                este plan.
                            </p>
                        )}

                        {isOwner && (
                            <InviteForm
                                planId={planId}
                                isPending={isPending}
                                onInvited={handleInvited}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
