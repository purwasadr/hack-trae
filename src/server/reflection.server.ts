import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { reflectionAnalyses, reflections } from '@/db/schema'
import type { SaveOnboardingProfileInput } from '@/features/coach/profile'
import type { ReflectionInput } from '@/features/coach/reflection'
import { ServerFnError } from '@/lib/server-fn-error'

import { getCoachProfileByUserId } from './coach.server'
import { analyzeReflectionWithOpenRouter } from './openrouter'

type ReflectionRow = typeof reflections.$inferSelect
type ReflectionAnalysisRow = typeof reflectionAnalyses.$inferSelect
export type ReflectionBundle = {
  reflection: ReflectionRow
  analysis: ReflectionAnalysisRow | null
  profile: SaveOnboardingProfileInput | null
}

function mapProfileForAnalysis(profile: Awaited<ReturnType<typeof getCoachProfileByUserId>>) {
  if (!profile) {
    return null
  }

  return {
    avatar: profile.avatar,
    firstGoal: profile.firstGoal,
    mainStruggle: profile.mainStruggle,
    productivityStyle: profile.productivityStyle,
    scenarioAnswers: profile.scenarioAnswers,
  } satisfies SaveOnboardingProfileInput
}

export function sortReflectionsNewestFirst<
  T extends { reflection: { date: string; createdAt: Date } },
>(items: T[]) {
  return [...items].sort((left, right) => {
    const dateDiff = right.reflection.date.localeCompare(left.reflection.date)
    if (dateDiff !== 0) {
      return dateDiff
    }
    return right.reflection.createdAt.getTime() - left.reflection.createdAt.getTime()
  })
}

export function buildDashboardSummary(
  profile: SaveOnboardingProfileInput | null,
  items: ReflectionBundle[],
) {
  const ordered = sortReflectionsNewestFirst(items)
  const latestReflection = ordered[0] ?? null

  return {
    profile,
    reflectionCount: ordered.length,
    latestReflection,
    latestCompletedAnalysis:
      latestReflection?.analysis?.status === 'completed'
        ? latestReflection.analysis
        : null,
  }
}

async function getAnalysisByReflectionId(reflectionId: string) {
  const [analysis] = await db
    .select()
    .from(reflectionAnalyses)
    .where(eq(reflectionAnalyses.reflectionId, reflectionId))
    .limit(1)

  return analysis ?? null
}

async function getReflectionRow(userId: string, reflectionId: string) {
  const [reflection] = await db
    .select()
    .from(reflections)
    .where(
      and(
        eq(reflections.id, reflectionId),
        eq(reflections.userId, userId),
      ),
    )
    .limit(1)

  return reflection ?? null
}

async function ensurePendingAnalysisRow(userId: string, reflectionId: string) {
  const existing = await getAnalysisByReflectionId(reflectionId)
  if (existing) {
    return existing
  }

  const [analysis] = await db
    .insert(reflectionAnalyses)
    .values({
      id: crypto.randomUUID(),
      reflectionId,
      userId,
      provider: 'openrouter',
      model: process.env.OPENROUTER_MODEL ?? 'unknown',
      status: 'pending',
    })
    .returning()

  return analysis
}

export async function createReflectionForUser(
  userId: string,
  profileId: string | null,
  input: ReflectionInput,
) {
  const [reflection] = await db
    .insert(reflections)
    .values({
      id: crypto.randomUUID(),
      userId,
      profileId,
      date: input.date,
      workContext: input.workContext,
      plannedTasks: input.plannedTasks,
      completedTasks: input.completedTasks,
      unfinishedTasks: input.unfinishedTasks,
      focusLevel: input.focusLevel,
      energyLevel: input.energyLevel,
      distractions: input.distractions,
      blockers: input.blockers,
      mood: input.mood,
      notes: input.notes,
    })
    .returning()

  await ensurePendingAnalysisRow(userId, reflection.id)

  return reflection
}

export async function getReflectionBundleById(
  userId: string,
  reflectionId: string,
): Promise<ReflectionBundle | null> {
  const reflection = await getReflectionRow(userId, reflectionId)
  if (!reflection) {
    return null
  }

  const [analysis, profile] = await Promise.all([
    getAnalysisByReflectionId(reflectionId),
    getCoachProfileByUserId(userId),
  ])

  return {
    reflection,
    analysis,
    profile: mapProfileForAnalysis(profile),
  }
}

export async function listReflectionBundlesByUserId(userId: string) {
  const [rows, profile] = await Promise.all([
    db
      .select()
      .from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.date), desc(reflections.createdAt)),
    getCoachProfileByUserId(userId),
  ])

  const items = await Promise.all(
    rows.map(async (reflection) => ({
      analysis: await getAnalysisByReflectionId(reflection.id),
      profile: mapProfileForAnalysis(profile),
      reflection,
    })),
  )

  return sortReflectionsNewestFirst(items)
}

export async function getDashboardSummaryForUser(userId: string) {
  const [items, profile] = await Promise.all([
    listReflectionBundlesByUserId(userId),
    getCoachProfileByUserId(userId),
  ])

  return buildDashboardSummary(mapProfileForAnalysis(profile), items)
}

export async function analyzeReflectionForUser(userId: string, reflectionId: string) {
  const bundle = await getReflectionBundleById(userId, reflectionId)
  if (!bundle) {
    throw new ServerFnError('NOT_FOUND', 'Reflection not found.')
  }

  const pendingAnalysis = await ensurePendingAnalysisRow(userId, reflectionId)

  if (
    pendingAnalysis.status === 'completed'
    && pendingAnalysis.controlFactors
    && pendingAnalysis.blockers
    && pendingAnalysis.diagnosis
    && pendingAnalysis.nextPlan
  ) {
    return {
      ...bundle,
      analysis: pendingAnalysis,
    }
  }

  try {
    const aiResponse = await analyzeReflectionWithOpenRouter({
      profile: bundle.profile,
      reflection: {
        blockers: bundle.reflection.blockers,
        completedTasks: bundle.reflection.completedTasks,
        date: bundle.reflection.date,
        distractions: bundle.reflection.distractions,
        energyLevel: bundle.reflection.energyLevel,
        focusLevel: bundle.reflection.focusLevel,
        mood: bundle.reflection.mood,
        notes: bundle.reflection.notes,
        plannedTasks: bundle.reflection.plannedTasks,
        unfinishedTasks: bundle.reflection.unfinishedTasks,
        workContext: bundle.reflection.workContext,
      },
    })

    const [analysis] = await db
      .update(reflectionAnalyses)
      .set({
        provider: aiResponse.provider,
        model: aiResponse.model,
        status: 'completed',
        controlFactors: aiResponse.result.controlFactors,
        blockers: aiResponse.result.blockers,
        diagnosis: aiResponse.result.diagnosis,
        nextPlan: aiResponse.result.nextPlan,
        rawResponse: aiResponse.rawResponse,
        errorMessage: null,
        updatedAt: new Date(),
      })
      .where(eq(reflectionAnalyses.id, pendingAnalysis.id))
      .returning()

    return {
      ...bundle,
      analysis,
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'The coach could not finish the analysis right now.'

    await db
      .update(reflectionAnalyses)
      .set({
        status: 'failed',
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(reflectionAnalyses.id, pendingAnalysis.id))

    if (error instanceof ServerFnError) {
      throw error
    }

    throw new ServerFnError('OPERATION_FAILED', message)
  }
}
