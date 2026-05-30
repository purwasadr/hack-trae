import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth'
import { ServerFnError } from '@/lib/server-fn-error'

export function assertSession<T>(session: T | null) {
  if (!session) {
    throw new ServerFnError('UNAUTHORIZED', 'You must be logged in to access this resource')
  }

  return session
}

export async function getServerSession() {
  return auth.api.getSession({
    headers: getRequestHeaders(),
  })
}

export async function requireServerSession() {
  return assertSession(await getServerSession())
}
