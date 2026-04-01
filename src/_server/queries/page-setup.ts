import { auth, currentUser } from '@clerk/nextjs/server'
import { startOfWeek, format } from 'date-fns'
import { resolveInvites } from '@/_lib/resolve-invites'

export async function getPlanPageSetup(weekParam?: string) {
    const { userId } = await auth()
    if (!userId) return null

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress
    const resolvedCount = email ? await resolveInvites(userId, email) : 0

    const currentMonday = format(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        'yyyy-MM-dd'
    )

    return {
        userId,
        weekStart: weekParam ?? currentMonday,
        resolvedCount,
    }
}
