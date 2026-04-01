import { NextRequest, NextResponse } from 'next/server'
import { db } from '@db'
import { planMembers } from '@db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export async function POST(request: NextRequest) {
    const payload = await request.json()

    // Handle user.created event — resolve pending invites
    if (payload.type === 'user.created') {
        const user = payload.data
        const emails =
            user.email_addresses?.map(
                (e: { email_address: string }) => e.email_address
            ) ?? []

        for (const email of emails) {
            // Find pending members with this email and fill in userId
            await db
                .update(planMembers)
                .set({ userId: user.id })
                .where(
                    and(
                        eq(planMembers.email, email.toLowerCase()),
                        isNull(planMembers.userId)
                    )
                )
        }
    }

    return NextResponse.json({ received: true })
}
