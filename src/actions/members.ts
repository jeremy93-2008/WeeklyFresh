"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { planMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getPlanForUser } from "@/lib/plan-permissions";

async function requireOwner(planId: number, userId: string) {
  const access = await getPlanForUser(planId, userId);
  if (!access) throw new Error("Plan no encontrado");
  if (access.role !== "owner") throw new Error("Solo el propietario puede gestionar miembros");
  return access;
}

export async function inviteMember(
  planId: number,
  email: string,
  role: "viewer" | "editor"
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  await requireOwner(planId, userId);

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) throw new Error("Email requerido");

  // Check if already a member
  const existing = await db.query.planMembers.findFirst({
    where: and(
      eq(planMembers.planId, planId),
      eq(planMembers.email, normalizedEmail)
    ),
  });
  if (existing) throw new Error("Este email ya está invitado");

  // Search for existing user in Clerk
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({
    emailAddress: [normalizedEmail],
    limit: 1,
  });

  if (users.data.length > 0) {
    // User exists — add directly
    const invitedUser = users.data[0];
    if (invitedUser.id === userId) throw new Error("No puedes invitarte a ti mismo");

    await db.insert(planMembers).values({
      planId,
      userId: invitedUser.id,
      email: normalizedEmail,
      role,
    });
  } else {
    // User doesn't exist — create pending invite + send Clerk invitation
    await db.insert(planMembers).values({
      planId,
      userId: null,
      email: normalizedEmail,
      role,
    });

    try {
      await clerk.invitations.createInvitation({
        emailAddress: normalizedEmail,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/plan`,
        publicMetadata: {},
      });
    } catch {
      // Invitation may already exist — that's fine
    }
  }

  revalidatePath("/plan");
}

export async function removeMember(planId: number, memberId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  await requireOwner(planId, userId);

  await db.delete(planMembers).where(
    and(eq(planMembers.id, memberId), eq(planMembers.planId, planId))
  );

  revalidatePath("/plan");
}

export async function updateMemberRole(
  planId: number,
  memberId: number,
  role: "viewer" | "editor"
) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  await requireOwner(planId, userId);

  await db
    .update(planMembers)
    .set({ role })
    .where(
      and(eq(planMembers.id, memberId), eq(planMembers.planId, planId))
    );

  revalidatePath("/plan");
}
