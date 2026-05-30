import { describe, expect, it } from 'vitest'

import { normalizeReflectionForm } from './reflection'

describe('normalizeReflectionForm', () => {
  it('parses list fields into arrays and coerces ratings', () => {
    expect(
      normalizeReflectionForm({
        date: '2026-05-30',
        workContext: 'Focused work with a few meetings in the afternoon.',
        plannedTasks: 'Draft outline\nReview notes',
        completedTasks: 'Draft outline',
        unfinishedTasks: 'Review notes',
        focusLevel: '7',
        energyLevel: '6',
        distractions: 'Slack',
        blockers: 'Unclear requirements',
        mood: 'mixed',
        notes: 'Need a better start tomorrow.',
      }),
    ).toMatchObject({
      blockers: ['Unclear requirements'],
      completedTasks: ['Draft outline'],
      distractions: ['Slack'],
      energyLevel: 6,
      focusLevel: 7,
      plannedTasks: ['Draft outline', 'Review notes'],
      unfinishedTasks: ['Review notes'],
    })
  })

  it('rejects reflections without planned tasks', () => {
    expect(() =>
      normalizeReflectionForm({
        date: '2026-05-30',
        workContext: 'Focused work with a few meetings in the afternoon.',
        plannedTasks: '   ',
        completedTasks: 'Draft outline',
        unfinishedTasks: 'Review notes',
        focusLevel: '7',
        energyLevel: '6',
        distractions: '',
        blockers: '',
        mood: 'mixed',
        notes: '',
      }),
    ).toThrow('Too small')
  })
})
