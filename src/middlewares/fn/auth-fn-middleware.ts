import { createMiddleware } from '@tanstack/react-start'

const authFnMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const { requireServerSession } = await import('@/server/auth.server')
  const session = await requireServerSession()

  return next({
    context: {
      session,
    },
  })
})

export default authFnMiddleware
