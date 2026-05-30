import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { saveOnboardingProfileSchema } from '@/features/coach/profile'
import {
  normalizeReflectionForm,
  reflectionFormSchema,
} from '@/features/coach/reflection'
import authFnMiddleware from '@/middlewares/fn/auth-fn-middleware'

const reflectionIdSchema = z.object({
  reflectionId: z.string().min(1),
})

export const getCoachProfile = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const { getCoachProfileByUserId } = await import('./coach.server')
    return getCoachProfileByUserId(context.session.user.id)
  })

export const saveOnboardingProfile = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(saveOnboardingProfileSchema)
  .handler(async ({ context, data }) => {
    const { saveCoachProfileByUserId } = await import('./coach.server')
    return saveCoachProfileByUserId(context.session.user.id, data)
  })

export const createReflection = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(reflectionFormSchema)
  .handler(async ({ context, data }) => {
    const { getCoachProfileByUserId } = await import('./coach.server')
    const { createReflectionForUser } = await import('./reflection.server')
    const profile = await getCoachProfileByUserId(context.session.user.id)
    const reflection = await createReflectionForUser(
      context.session.user.id,
      profile?.id ?? null,
      normalizeReflectionForm(data),
    )

    return reflection
  })

export const getReflection = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(reflectionIdSchema)
  .handler(async ({ context, data }) => {
    const { getReflectionBundleById } = await import('./reflection.server')
    return getReflectionBundleById(context.session.user.id, data.reflectionId)
  })

export const listReflections = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const { listReflectionBundlesByUserId } = await import('./reflection.server')
    return listReflectionBundlesByUserId(context.session.user.id)
  })

export const getDashboardSummary = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const { getDashboardSummaryForUser } = await import('./reflection.server')
    return getDashboardSummaryForUser(context.session.user.id)
  })

export const analyzeReflection = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(reflectionIdSchema)
  .handler(async ({ context, data }) => {
    const { analyzeReflectionForUser } = await import('./reflection.server')
    return analyzeReflectionForUser(context.session.user.id, data.reflectionId)
  })
