import { db } from "@/db";
import { weeklyPlans, planMembers } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

export type PlanRole = "owner" | "viewer" | "editor";

interface PlanAccess {
  plan: typeof weeklyPlans.$inferSelect;
  role: PlanRole;
}

export async function getPlanForUser(
  planId: number,
  userId: string
): Promise<PlanAccess | null> {
  // Check if owner
  const plan = await db.query.weeklyPlans.findFirst({
    where: eq(weeklyPlans.id, planId),
  });

  if (!plan) return null;

  if (plan.userId === userId) {
    return { plan, role: "owner" };
  }

  // Check if member
  const member = await db.query.planMembers.findFirst({
    where: and(
      eq(planMembers.planId, planId),
      eq(planMembers.userId, userId)
    ),
  });

  if (member) {
    return { plan, role: member.role as PlanRole };
  }

  return null;
}

export async function getUserPlanForWeek(
  userId: string,
  weekStart: string
): Promise<(PlanAccess & { members: (typeof planMembers.$inferSelect)[] }) | null> {
  // Check own plan first
  const ownPlan = await db.query.weeklyPlans.findFirst({
    where: and(
      eq(weeklyPlans.userId, userId),
      eq(weeklyPlans.weekStart, weekStart)
    ),
  });

  if (ownPlan) {
    const members = await db
      .select()
      .from(planMembers)
      .where(eq(planMembers.planId, ownPlan.id));
    return { plan: ownPlan, role: "owner", members };
  }

  // Check if member of someone else's plan for this week
  const membership = await db
    .select({
      member: planMembers,
      plan: weeklyPlans,
    })
    .from(planMembers)
    .innerJoin(weeklyPlans, eq(planMembers.planId, weeklyPlans.id))
    .where(
      and(
        eq(planMembers.userId, userId),
        eq(weeklyPlans.weekStart, weekStart)
      )
    )
    .limit(1);

  if (membership.length > 0) {
    const { plan, member } = membership[0];
    const members = await db
      .select()
      .from(planMembers)
      .where(eq(planMembers.planId, plan.id));
    return { plan, role: member.role as PlanRole, members };
  }

  return null;
}
