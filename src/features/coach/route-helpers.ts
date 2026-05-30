import { redirect } from '@tanstack/react-router'

import { getSession } from '@/server/auth.fn'
import { getCoachProfile } from '@/server/reflection.fn'

export async function redirectAuthenticatedUser() {
  const session = await getSession()
  if (!session) {
    return null
  }

  const profile = await getCoachProfile()

  throw redirect({
    to: profile ? '/dashboard' : '/onboarding',
  })
}

export async function requireSessionOrRedirect() {
  const session = await getSession()
  if (!session) {
    throw redirect({ to: '/login' })
  }
  return session
}

export async function redirectIfProfileExists() {
  await requireSessionOrRedirect()
  const profile = await getCoachProfile()
  if (profile) {
    throw redirect({ to: '/dashboard' })
  }
}

export async function requireProfileOrRedirect() {
  await requireSessionOrRedirect()
  const profile = await getCoachProfile()
  if (!profile) {
    throw redirect({ to: '/onboarding' })
  }
  return profile
}
