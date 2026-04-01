import { auth } from '@clerk/nextjs/server'
import { getPlanForUser } from '@/_lib/plan-permissions'

export type IPlanRole = 'viewer' | 'editor' | 'owner'

const ROLE_HIERARCHY: IPlanRole[] = ['viewer', 'editor', 'owner']

export async function requireAuth(): Promise<string> {
    const { userId } = await auth()
    if (!userId) throw new Error('No autenticado')
    return userId
}

export async function requirePlanAccess(
    planId: number,
    userId: string,
    minRole: IPlanRole
) {
    const access = await getPlanForUser(planId, userId)
    if (!access) throw new Error('Plan no encontrado')

    const userLevel = ROLE_HIERARCHY.indexOf(access.role as IPlanRole)
    const requiredLevel = ROLE_HIERARCHY.indexOf(minRole)

    if (userLevel < requiredLevel) {
        throw new Error('No tienes permisos suficientes')
    }

    return access
}
