import { describe, expect, it } from 'vitest'

import {
  buildSuggestedFirstGoals,
  calculateProductivityStyle,
} from './profile'

describe('calculateProductivityStyle', () => {
  it('returns a structured style for planning-heavy answers', () => {
    expect(
      calculateProductivityStyle({
        blockedResponse: 'ask_for_clarity',
        focusDip: 'switch_tasks',
        planningPreference: 'time_blocks',
        wrapUpStyle: 'review_and_plan',
      }),
    ).toBe('structured_strider')
  })

  it('returns a recovery style when reset answers dominate', () => {
    expect(
      calculateProductivityStyle({
        blockedResponse: 'delay_until_later',
        focusDip: 'quick_scroll',
        planningPreference: 'simple_list',
        wrapUpStyle: 'lose_track_of_time',
      }),
    ).toBe('recovery_rebuilder')
  })
})

describe('buildSuggestedFirstGoals', () => {
  it('returns goal suggestions tailored to struggle and style', () => {
    expect(
      buildSuggestedFirstGoals({
        mainStruggle: 'staying_focused',
        productivityStyle: 'structured_strider',
      }),
    ).toContain(
      'Protect one distraction-light focus block before lunch on three days this week.',
    )
  })
})
