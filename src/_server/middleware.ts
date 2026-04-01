import { auth } from '@clerk/nextjs/server'
import { getPlanForUser } from '@/_lib/plan-permissions'
import { PLAN_ROLES, type IPlanRole } from '@/_lib/constants'

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

    const userLevel = PLAN_ROLES.indexOf(access.role)
    const requiredLevel = PLAN_ROLES.indexOf(minRole)

    if (userLevel < requiredLevel) {
        throw new Error('No tienes permisos suficientes')
    }

    return access
}
