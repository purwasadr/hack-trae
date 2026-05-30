import { z } from 'zod'

import type {
  MainStruggle,
  ProductivityStyle,
  SaveOnboardingProfileInput,
} from './profile'

const ratingSchema = z.coerce.number().int().min(1).max(10)
const requiredChoiceListSchema = z.array(z.string().min(1).max(160)).min(1).max(4)
const optionalChoiceListSchema = z.array(z.string().min(1).max(160)).max(4)

type ReflectionChoiceOption = {
  value: string
  label: string
  description?: string
}

type ReflectionQuestionProfile = Pick<
  SaveOnboardingProfileInput,
  'avatar' | 'firstGoal' | 'mainStruggle' | 'productivityStyle'
>

export type ReflectionQuestionSet = {
  workContextOptions: ReflectionChoiceOption[]
  plannedTaskOptions: ReflectionChoiceOption[]
  completedTaskOptions: ReflectionChoiceOption[]
  unfinishedTaskOptions: ReflectionChoiceOption[]
  distractionOptions: ReflectionChoiceOption[]
  blockerOptions: ReflectionChoiceOption[]
}

export const reflectionFormSchema = z.object({
  date: z.string().min(1, 'Date is required.'),
  workContext: z.string().trim().min(2).max(160),
  plannedTasks: requiredChoiceListSchema,
  completedTasks: requiredChoiceListSchema,
  unfinishedTasks: requiredChoiceListSchema,
  focusLevel: ratingSchema,
  energyLevel: ratingSchema,
  distractions: optionalChoiceListSchema,
  blockers: optionalChoiceListSchema,
  mood: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(1200),
})

export const reflectionInputSchema = reflectionFormSchema.extend({
  date: z.string().min(1),
})

export type ReflectionFormValues = z.input<typeof reflectionFormSchema>
export type ReflectionInput = z.infer<typeof reflectionInputSchema>

export const reflectionMoodOptions = [
  {
    value: 'calm',
    label: 'Calm and steady',
    description: 'The day felt manageable even if it was not perfect.',
  },
  {
    value: 'stretched',
    label: 'Stretched',
    description: 'There was forward movement, but it took effort to keep up.',
  },
  {
    value: 'motivated',
    label: 'Motivated',
    description: 'You had useful momentum and wanted to keep going.',
  },
  {
    value: 'frustrated',
    label: 'Frustrated',
    description: 'Friction or blockers took more energy than expected.',
  },
  {
    value: 'mixed',
    label: 'Mixed',
    description: 'Some parts went well, and some parts felt messy.',
  },
] as const

export const reflectionRatingOptions = Array.from({ length: 10 }, (_, index) => {
  const value = String(index + 1)

  return {
    value,
    label: `${value} / 10`,
  }
})

function getGoalOption(profile: ReflectionQuestionProfile | null): ReflectionChoiceOption {
  return profile?.firstGoal
    ? {
        value: 'Make progress on my current goal',
        label: 'Make progress on my current goal',
        description: profile.firstGoal,
      }
    : {
        value: 'Protect one meaningful priority',
        label: 'Protect one meaningful priority',
        description: 'Keep the day centered on one useful win instead of scattered effort.',
      }
}

function getStrugglePlanOption(struggle: MainStruggle | null): ReflectionChoiceOption {
  switch (struggle) {
    case 'starting_on_time':
      return {
        value: 'Start the first important task on time',
        label: 'Start the first important task on time',
        description: 'Build early traction before the day gets noisy.',
      }
    case 'finishing_tasks':
      return {
        value: 'Close one task fully before switching',
        label: 'Close one task fully before switching',
        description: 'Aim for completion, not just motion.',
      }
    case 'managing_interruptions':
      return {
        value: 'Protect a work block from interruptions',
        label: 'Protect a work block from interruptions',
        description: 'Create at least one calmer window for real progress.',
      }
    case 'staying_focused':
    default:
      return {
        value: 'Protect a distraction-light focus block',
        label: 'Protect a distraction-light focus block',
        description: 'Give your attention one place to stay.',
      }
  }
}

function getStylePlanOption(style: ProductivityStyle | null): ReflectionChoiceOption {
  switch (style) {
    case 'momentum_sprinter':
      return {
        value: 'Start fast on a small visible win',
        label: 'Start fast on a small visible win',
        description: 'Use early motion to build confidence.',
      }
    case 'adaptive_balancer':
      return {
        value: 'Keep one anchor task while adapting around changes',
        label: 'Keep one anchor task while adapting around changes',
        description: 'Stay flexible without losing the day’s center.',
      }
    case 'recovery_rebuilder':
      return {
        value: 'Keep the plan light enough to follow through',
        label: 'Keep the plan light enough to follow through',
        description: 'A gentler target can still move you forward.',
      }
    case 'structured_strider':
    default:
      return {
        value: 'Follow a simple plan with clear checkpoints',
        label: 'Follow a simple plan with clear checkpoints',
        description: 'A little structure helps momentum hold.',
      }
  }
}

function getTailoredWorkContext(profile: ReflectionQuestionProfile | null): ReflectionChoiceOption {
  switch (profile?.avatar) {
    case 'momentum_starter':
      return {
        value: 'A day where getting started mattered more than perfect planning',
        label: 'Fast-start day',
        description: 'The challenge was building momentum quickly and keeping it going.',
      }
    case 'adaptive_juggler':
      return {
        value: 'A day with shifting priorities and several context changes',
        label: 'Shifting-priority day',
        description: 'The day needed flexibility more than a fixed script.',
      }
    case 'fresh_rebuilder':
      return {
        value: 'A day where energy and consistency needed a gentler pace',
        label: 'Gentle reset day',
        description: 'The goal was steady follow-through, not intensity.',
      }
    case 'steady_builder':
    default:
      return {
        value: 'A day with one planned focus block and a few supporting tasks',
        label: 'Planned focus-block day',
        description: 'You were aiming for structure with room for a few side tasks.',
      }
  }
}

function dedupeOptions(options: ReflectionChoiceOption[]) {
  return [...new Map(options.map((option) => [option.value, option])).values()]
}

// These question sets stay deterministic and profile-aware so users get easy choices
// without waiting on another AI round-trip before every reflection.
export function buildReflectionQuestionSet(
  profile: ReflectionQuestionProfile | null,
): ReflectionQuestionSet {
  const struggleOption = getStrugglePlanOption(profile?.mainStruggle ?? null)
  const styleOption = getStylePlanOption(profile?.productivityStyle ?? null)
  const goalOption = getGoalOption(profile)

  return {
    workContextOptions: dedupeOptions([
      getTailoredWorkContext(profile),
      {
        value: 'A meeting-heavy day with only short windows for focused work',
        label: 'Meeting-heavy day',
        description: 'Most of the day was shaped by calls, syncs, or other scheduled conversations.',
      },
      {
        value: 'A mixed day of follow-ups, admin work, and small tasks',
        label: 'Admin-and-follow-ups day',
        description: 'The day was practical, fragmented, and not ideal for deep work.',
      },
      {
        value: 'A study or build session with a few interruptions along the way',
        label: 'Study or build session',
        description: 'You had a main task, but interruptions still showed up.',
      },
    ]),
    plannedTaskOptions: dedupeOptions([
      goalOption,
      struggleOption,
      styleOption,
      {
        value: 'Clear messages, follow-ups, and lightweight admin',
        label: 'Clear messages and admin',
        description: 'Reduce background clutter so the rest of the day feels lighter.',
      },
    ]),
    completedTaskOptions: dedupeOptions([
      {
        value: 'Moved my current goal forward in a visible way',
        label: 'Moved the main goal forward',
        description: 'You created progress that was easy to point to.',
      },
      {
        value: 'Protected at least one useful focus block',
        label: 'Protected a focus block',
        description: 'You gave your attention a fair chance to stay in one place.',
      },
      {
        value: 'Cleared important follow-ups and smaller tasks',
        label: 'Cleared follow-ups',
        description: 'The day created useful closure even if it was not deep work.',
      },
      {
        value: 'Set up the next step clearly for tomorrow',
        label: 'Prepared tomorrow well',
        description: 'You reduced tomorrow’s startup friction.',
      },
    ]),
    unfinishedTaskOptions: dedupeOptions([
      {
        value: 'The main task still needs one more focused block',
        label: 'Main task still open',
        description: 'Progress started, but the work did not fully close.',
      },
      {
        value: 'Follow-ups or admin items kept spilling over',
        label: 'Follow-ups kept spilling over',
        description: 'Smaller items kept taking space late into the day.',
      },
      {
        value: 'I did not protect the focus block I hoped for',
        label: 'Focus block did not happen',
        description: 'The day stayed more reactive than planned.',
      },
      {
        value: 'The next step is still unclear',
        label: 'Next step still unclear',
        description: 'Uncertainty made it harder to finish with confidence.',
      },
    ]),
    distractionOptions: dedupeOptions([
      {
        value: 'Messages and notifications kept pulling me out',
        label: 'Messages and notifications',
      },
      {
        value: 'Task switching broke my momentum',
        label: 'Task switching',
      },
      {
        value: 'Unexpected requests changed the shape of the day',
        label: 'Unexpected requests',
      },
      {
        value: 'Low energy made it harder to stay with one task',
        label: 'Low energy',
      },
    ]),
    blockerOptions: dedupeOptions([
      {
        value: 'The task was not fully clear yet',
        label: 'Unclear requirements',
      },
      {
        value: 'There were too many competing priorities',
        label: 'Too many priorities',
      },
      {
        value: 'Interruptions cut the work into smaller pieces',
        label: 'Interruptions',
      },
      {
        value: 'Setup, tools, or environment slowed the start',
        label: 'Setup or tools friction',
      },
    ]),
  }
}

export function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10)
}

export function normalizeReflectionForm(
  values: ReflectionFormValues,
): ReflectionInput {
  return reflectionInputSchema.parse(values)
}

export function getDefaultReflectionValues(): ReflectionFormValues {
  return {
    date: getTodayDateValue(),
    workContext: '',
    plannedTasks: [],
    completedTasks: [],
    unfinishedTasks: [],
    focusLevel: '6',
    energyLevel: '6',
    distractions: [],
    blockers: [],
    mood: 'mixed',
    notes: '',
  }
}
