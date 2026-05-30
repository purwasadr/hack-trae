import { z } from 'zod'

export const productivityAvatarSchema = z.enum([
  'steady_builder',
  'momentum_starter',
  'adaptive_juggler',
  'fresh_rebuilder',
])

export const mainStruggleSchema = z.enum([
  'starting_on_time',
  'staying_focused',
  'finishing_tasks',
  'managing_interruptions',
])

export const productivityStyleSchema = z.enum([
  'structured_strider',
  'momentum_sprinter',
  'adaptive_balancer',
  'recovery_rebuilder',
])

export const productivityStyleQuizSchema = z.object({
  planningPreference: z.enum([
    'time_blocks',
    'simple_list',
    'start_fast',
    'flexible_shuffle',
  ]),
  focusDip: z.enum([
    'short_reset',
    'push_through',
    'switch_tasks',
    'quick_scroll',
  ]),
  blockedResponse: z.enum([
    'ask_for_clarity',
    'research_quietly',
    'pick_smaller_step',
    'delay_until_later',
  ]),
  wrapUpStyle: z.enum([
    'review_and_plan',
    'stop_when_done',
    'squeeze_more',
    'lose_track_of_time',
  ]),
})

export const saveOnboardingProfileSchema = z.object({
  avatar: productivityAvatarSchema,
  mainStruggle: mainStruggleSchema,
  scenarioAnswers: productivityStyleQuizSchema,
  productivityStyle: productivityStyleSchema,
  firstGoal: z.string().trim().min(8).max(180),
})

export type ProductivityAvatar = z.infer<typeof productivityAvatarSchema>
export type MainStruggle = z.infer<typeof mainStruggleSchema>
export type ProductivityStyle = z.infer<typeof productivityStyleSchema>
export type ProductivityStyleQuizAnswers = z.infer<
  typeof productivityStyleQuizSchema
>
export type SaveOnboardingProfileInput = z.infer<
  typeof saveOnboardingProfileSchema
>

export const productivityAvatarOptions = [
  {
    value: 'steady_builder',
    label: 'Steady Builder',
    description: 'You like calm structure and a clear plan before you begin.',
  },
  {
    value: 'momentum_starter',
    label: 'Momentum Starter',
    description: 'You do best when you begin quickly and build energy through action.',
  },
  {
    value: 'adaptive_juggler',
    label: 'Adaptive Juggler',
    description: 'You adjust fast when priorities shift and contexts keep changing.',
  },
  {
    value: 'fresh_rebuilder',
    label: 'Fresh Rebuilder',
    description: 'You are rebuilding consistency and need supportive reset habits.',
  },
] as const satisfies ReadonlyArray<{
  value: ProductivityAvatar
  label: string
  description: string
}>

export const mainStruggleOptions = [
  { value: 'starting_on_time', label: 'Starting on time' },
  { value: 'staying_focused', label: 'Staying focused' },
  { value: 'finishing_tasks', label: 'Finishing tasks' },
  { value: 'managing_interruptions', label: 'Managing interruptions' },
] as const satisfies ReadonlyArray<{ value: MainStruggle; label: string }>

export const productivityStyleDetails: Record<
  ProductivityStyle,
  { title: string; summary: string; nextFocus: string }
> = {
  structured_strider: {
    title: 'Structured Strider',
    summary:
      'You gain momentum when your day has shape, checkpoints, and clear priorities.',
    nextFocus: 'Protect your first planned block and keep your task list realistic.',
  },
  momentum_sprinter: {
    title: 'Momentum Sprinter',
    summary:
      'You move well when you can begin fast and keep friction low.',
    nextFocus: 'Start smaller, reduce setup time, and capture quick wins early.',
  },
  adaptive_balancer: {
    title: 'Adaptive Balancer',
    summary:
      'You handle change well, but you need a steady anchor when plans shift.',
    nextFocus: 'Choose one anchor task and one recovery habit for interrupted days.',
  },
  recovery_rebuilder: {
    title: 'Recovery Rebuilder',
    summary:
      'You benefit from gentle resets, simpler goals, and more energy awareness.',
    nextFocus: 'Lower the bar for re-entry and celebrate small follow-through steps.',
  },
}

const styleScoreMap: Record<
  keyof ProductivityStyleQuizAnswers,
  Record<ProductivityStyleQuizAnswers[keyof ProductivityStyleQuizAnswers], ProductivityStyle>
> = {
  planningPreference: {
    time_blocks: 'structured_strider',
    simple_list: 'adaptive_balancer',
    start_fast: 'momentum_sprinter',
    flexible_shuffle: 'adaptive_balancer',
  },
  focusDip: {
    short_reset: 'recovery_rebuilder',
    push_through: 'momentum_sprinter',
    switch_tasks: 'adaptive_balancer',
    quick_scroll: 'recovery_rebuilder',
  },
  blockedResponse: {
    ask_for_clarity: 'structured_strider',
    research_quietly: 'structured_strider',
    pick_smaller_step: 'momentum_sprinter',
    delay_until_later: 'recovery_rebuilder',
  },
  wrapUpStyle: {
    review_and_plan: 'structured_strider',
    stop_when_done: 'adaptive_balancer',
    squeeze_more: 'momentum_sprinter',
    lose_track_of_time: 'recovery_rebuilder',
  },
}

const productivityStylePriority: ProductivityStyle[] = [
  'structured_strider',
  'momentum_sprinter',
  'adaptive_balancer',
  'recovery_rebuilder',
]

// The quiz stays intentionally light so the first-run flow feels quick and supportive.
export function calculateProductivityStyle(
  answers: ProductivityStyleQuizAnswers,
): ProductivityStyle {
  const scores = {
    structured_strider: 0,
    momentum_sprinter: 0,
    adaptive_balancer: 0,
    recovery_rebuilder: 0,
  } satisfies Record<ProductivityStyle, number>

  for (const [questionKey, answer] of Object.entries(answers) as Array<[
    keyof ProductivityStyleQuizAnswers,
    ProductivityStyleQuizAnswers[keyof ProductivityStyleQuizAnswers],
  ]>) {
    const style = styleScoreMap[questionKey][answer]
    scores[style] += 1
  }

  return productivityStylePriority.reduce((bestStyle, style) => {
    return scores[style] > scores[bestStyle] ? style : bestStyle
  }, productivityStylePriority[0])
}
