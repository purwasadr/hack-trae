import { date, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import type {
  ActionPlan,
  BlockerAnalysis,
  ControlFactor,
  ProductivityDiagnosis,
  ReflectionAnalysisStatus,
} from '@/features/coach/analysis'
import type {
  MainStruggle,
  ProductivityAvatar,
  ProductivityStyle,
  ProductivityStyleQuizAnswers,
} from '@/features/coach/profile'
import type { ReflectionInput } from '@/features/coach/reflection'

import { user } from './auth'

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}

export const coachProfiles = pgTable('coach_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  avatar: text('avatar').$type<ProductivityAvatar>().notNull(),
  mainStruggle: text('main_struggle').$type<MainStruggle>().notNull(),
  scenarioAnswers: jsonb('scenario_answers').$type<ProductivityStyleQuizAnswers>().notNull(),
  productivityStyle: text('productivity_style').$type<ProductivityStyle>().notNull(),
  firstGoal: text('first_goal').notNull(),
  ...timestamps,
})

export const reflections = pgTable('reflections', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  profileId: text('profile_id').references(() => coachProfiles.id, {
    onDelete: 'set null',
  }),
  date: date('date', { mode: 'string' }).notNull(),
  workContext: text('work_context').notNull(),
  plannedTasks: jsonb('planned_tasks').$type<ReflectionInput['plannedTasks']>().notNull(),
  completedTasks: jsonb('completed_tasks').$type<ReflectionInput['completedTasks']>().notNull(),
  unfinishedTasks: jsonb('unfinished_tasks').$type<ReflectionInput['unfinishedTasks']>().notNull(),
  focusLevel: integer('focus_level').notNull(),
  energyLevel: integer('energy_level').notNull(),
  distractions: jsonb('distractions').$type<ReflectionInput['distractions']>().notNull(),
  blockers: jsonb('blockers').$type<ReflectionInput['blockers']>().notNull(),
  mood: text('mood').notNull(),
  notes: text('notes').notNull(),
  ...timestamps,
})

export const reflectionAnalyses = pgTable('reflection_analyses', {
  id: text('id').primaryKey(),
  reflectionId: text('reflection_id')
    .notNull()
    .unique()
    .references(() => reflections.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  model: text('model').notNull(),
  status: text('status').$type<ReflectionAnalysisStatus>().notNull(),
  controlFactors: jsonb('control_factors').$type<ControlFactor[] | null>(),
  blockers: jsonb('blockers').$type<BlockerAnalysis[] | null>(),
  diagnosis: jsonb('diagnosis').$type<ProductivityDiagnosis | null>(),
  nextPlan: jsonb('next_plan').$type<ActionPlan | null>(),
  rawResponse: text('raw_response'),
  errorMessage: text('error_message'),
  ...timestamps,
})
