import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { coachProfiles } from '@/db/schema'
import type { SaveOnboardingProfileInput } from '@/features/coach/profile'

export async function getCoachProfileByUserId(userId: string) {
  const [profile] = await db
    .select()
    .from(coachProfiles)
    .where(eq(coachProfiles.userId, userId))
    .limit(1)

  return profile ?? null
}

export async function saveCoachProfileByUserId(
  userId: string,
  input: SaveOnboardingProfileInput,
) {
  const [profile] = await db
    .insert(coachProfiles)
    .values({
      id: crypto.randomUUID(),
      userId,
      ...input,
    })
    .onConflictDoUpdate({
      target: coachProfiles.userId,
      set: {
        ...input,
        updatedAt: new Date(),
      },
    })
    .returning()

  return profile
}
