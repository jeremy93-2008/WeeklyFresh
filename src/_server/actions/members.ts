'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { db, planMembers } from '@db'
import { eq, and } from 'drizzle-orm'
import { requireAuth, requirePlanAccess } from '@/_server/middleware'
import { inviteMemberSchema, type IInviteMemberInput } from '@/_server/schemas'
import { revalidatePlan } from '@/_server/cache'

export async function inviteMember(input: IInviteMemberInput) {
    const userId = await requireAuth()
    const { planId, email, role } = inviteMemberSchema.parse(input)

    await requirePlanAccess(planId, userId, 'owner')

    const normalizedEmail = email.trim().toLowerCase()

    const existing = await db.query.planMembers.findFirst({
        where: and(
            eq(planMembers.planId, planId),
            eq(planMembers.email, normalizedEmail)
        ),
    })
    if (existing) throw new Error('Este email ya está invitado')

    const clerk = await clerkClient()
    const users = await clerk.users.getUserList({
        emailAddress: [normalizedEmail],
        limit: 1,
    })

    if (users.data.length > 0) {
        const invitedUser = users.data[0]
        if (invitedUser.id === userId)
            throw new Error('No puedes invitarte a ti mismo')

        await db.insert(planMembers).values({
            planId,
            userId: invitedUser.id,
            email: normalizedEmail,
            role,
        })
    } else {
        await db.insert(planMembers).values({
            planId,
            userId: null,
            email: normalizedEmail,
            role,
        })

        try {
            await clerk.invitations.createInvitation({
                emailAddress: normalizedEmail,
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/plan`,
                publicMetadata: {},
            })
        } catch {
            // Invitation may already exist
        }
    }

    revalidatePlan()
}

export async function removeMember(planId: number, memberId: number) {
    const userId = await requireAuth()
    await requirePlanAccess(planId, userId, 'owner')

    await db
        .delete(planMembers)
        .where(
            and(eq(planMembers.id, memberId), eq(planMembers.planId, planId))
        )

    revalidatePlan()
}

export async function updateMemberRole(
    planId: number,
    memberId: number,
    role: 'viewer' | 'editor'
) {
    const userId = await requireAuth()
    await requirePlanAccess(planId, userId, 'owner')

    await db
        .update(planMembers)
        .set({ role })
        .where(
            and(eq(planMembers.id, memberId), eq(planMembers.planId, planId))
        )

    revalidatePlan()
}
