import { db } from "@/db";
import { planMembers } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

/** Returns the number of resolved invites */
export async function resolveInvites(userId: string, email: string): Promise<number> {
  const pending = await db
    .select({ id: planMembers.id })
    .from(planMembers)
    .where(
      and(
        eq(planMembers.email, email.toLowerCase()),
        isNull(planMembers.userId)
      )
    );

  if (pending.length === 0) return 0;

  await db
    .update(planMembers)
    .set({ userId })
    .where(
      and(
        eq(planMembers.email, email.toLowerCase()),
        isNull(planMembers.userId)
      )
    );

  return pending.length;
}
