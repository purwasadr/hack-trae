import { z } from 'zod'

const ratingSchema = z.coerce.number().int().min(1).max(10)
const requiredListSchema = z.array(z.string().min(1).max(160)).min(1).max(8)
const optionalListSchema = z.array(z.string().min(1).max(160)).max(8)

export const reflectionFormSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  workContext: z.string().trim().min(10).max(300),
  plannedTasks: z.string().trim().min(3).max(700),
  completedTasks: z.string().trim().min(3).max(700),
  unfinishedTasks: z.string().trim().min(3).max(700),
  focusLevel: ratingSchema,
  energyLevel: ratingSchema,
  distractions: z.string().trim().max(700),
  blockers: z.string().trim().max(700),
  mood: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(1200),
})

export const reflectionInputSchema = z.object({
  date: z.string().min(1),
  workContext: z.string().trim().min(10).max(300),
  plannedTasks: requiredListSchema,
  completedTasks: requiredListSchema,
  unfinishedTasks: requiredListSchema,
  focusLevel: ratingSchema,
  energyLevel: ratingSchema,
  distractions: optionalListSchema,
  blockers: optionalListSchema,
  mood: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(1200),
})

export type ReflectionFormValues = z.input<typeof reflectionFormSchema>
export type ReflectionInput = z.infer<typeof reflectionInputSchema>

export const reflectionMoodOptions = [
  { value: 'calm', label: 'Calm' },
  { value: 'stretched', label: 'Stretched' },
  { value: 'motivated', label: 'Motivated' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'mixed', label: 'Mixed' },
] as const

export function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10)
}

// We store list-like answers as arrays so the AI prompt and detail UI can reuse them.
export function splitReflectionList(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeReflectionForm(
  values: ReflectionFormValues,
): ReflectionInput {
  return reflectionInputSchema.parse({
    ...values,
    plannedTasks: splitReflectionList(values.plannedTasks),
    completedTasks: splitReflectionList(values.completedTasks),
    unfinishedTasks: splitReflectionList(values.unfinishedTasks),
    distractions: splitReflectionList(values.distractions),
    blockers: splitReflectionList(values.blockers),
  })
}

export function getDefaultReflectionValues(): ReflectionFormValues {
  return {
    date: getTodayDateValue(),
    workContext: '',
    plannedTasks: '',
    completedTasks: '',
    unfinishedTasks: '',
    focusLevel: '6',
    energyLevel: '6',
    distractions: '',
    blockers: '',
    mood: 'mixed',
    notes: '',
  }
}
