import { createServerFn } from '@tanstack/react-start'

import authFnMiddleware from '@/middlewares/fn/auth-fn-middleware'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { getServerSession } = await import('./auth.server')
  return getServerSession()
})

export const ensureSession = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    return context.session
  })
