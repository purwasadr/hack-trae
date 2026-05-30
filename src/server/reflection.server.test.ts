import { describe, expect, it } from 'vitest'

import {
  buildDashboardSummary,
  sortReflectionsNewestFirst,
} from './reflection.server'

const profile = {
  avatar: 'steady_builder',
  mainStruggle: 'staying_focused',
  productivityStyle: 'structured_strider',
  scenarioAnswers: {
    blockedResponse: 'ask_for_clarity',
    focusDip: 'short_reset',
    planningPreference: 'time_blocks',
    wrapUpStyle: 'review_and_plan',
  },
  firstGoal: 'Finish my top priority task before lunch.',
} as const

describe('buildDashboardSummary', () => {
  it('returns an empty state when no reflections exist', () => {
    expect(buildDashboardSummary(profile, [])).toMatchObject({
      latestCompletedAnalysis: null,
      latestReflection: null,
      reflectionCount: 0,
    })
  })
})

describe('sortReflectionsNewestFirst', () => {
  it('orders newer reflection dates first', () => {
    const ordered = sortReflectionsNewestFirst([
      {
        reflection: {
          id: 'older',
          date: '2026-05-28',
          createdAt: new Date('2026-05-28T08:00:00.000Z'),
        },
      },
      {
        reflection: {
          id: 'newer',
          date: '2026-05-30',
          createdAt: new Date('2026-05-30T08:00:00.000Z'),
        },
      },
    ])

    expect(ordered.map((item) => item.reflection.id)).toEqual(['newer', 'older'])
  })
})
