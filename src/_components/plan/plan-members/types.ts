import type { IPlanMember } from '@db/types'

export type IMember = Pick<IPlanMember, 'id' | 'userId' | 'email' | 'role'>
