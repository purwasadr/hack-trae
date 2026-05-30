import { describe, expect, it } from 'vitest'

import {
  buildReflectionQuestionSet,
  normalizeReflectionForm,
} from './reflection'

describe('normalizeReflectionForm', () => {
  it('keeps choice fields as arrays and coerces ratings', () => {
    expect(
      normalizeReflectionForm({
        date: '2026-05-30',
        workContext: 'A day with one planned focus block and a few supporting tasks',
        plannedTasks: ['Protect a distraction-light focus block'],
        completedTasks: ['Protected at least one useful focus block'],
        unfinishedTasks: ['The main task still needs one more focused block'],
        focusLevel: '7',
        energyLevel: '6',
        distractions: ['Messages and notifications kept pulling me out'],
        blockers: ['The task was not fully clear yet'],
        mood: 'mixed',
        notes: 'Need a better start tomorrow.',
      }),
    ).toMatchObject({
      blockers: ['The task was not fully clear yet'],
      completedTasks: ['Protected at least one useful focus block'],
      distractions: ['Messages and notifications kept pulling me out'],
      energyLevel: 6,
      focusLevel: 7,
      plannedTasks: ['Protect a distraction-light focus block'],
      unfinishedTasks: ['The main task still needs one more focused block'],
    })
  })

  it('rejects reflections without planned tasks', () => {
    expect(() =>
      normalizeReflectionForm({
        date: '2026-05-30',
        workContext: 'A day with one planned focus block and a few supporting tasks',
        plannedTasks: [],
        completedTasks: ['Protected at least one useful focus block'],
        unfinishedTasks: ['The main task still needs one more focused block'],
        focusLevel: '7',
        energyLevel: '6',
        distractions: [],
        blockers: [],
        mood: 'mixed',
        notes: '',
      }),
    ).toThrow('Too small')
  })
})

describe('buildReflectionQuestionSet', () => {
  it('puts profile-aware choices into the guided reflection', () => {
    const questionSet = buildReflectionQuestionSet({
      avatar: 'steady_builder',
      firstGoal: 'Protect one useful focus block before lunch three times this week.',
      mainStruggle: 'staying_focused',
      productivityStyle: 'structured_strider',
    })

    expect(questionSet.workContextOptions[0]?.label).toBe('Planned focus-block day')
    expect(questionSet.plannedTaskOptions.some((option) => option.value === 'Make progress on my current goal')).toBe(true)
  })
})
