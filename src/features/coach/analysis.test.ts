import { describe, expect, it } from 'vitest'

import { reflectionAnalysisResultSchema } from './analysis'

describe('reflectionAnalysisResultSchema', () => {
  it('accepts the supported AI output contract', () => {
    expect(
      reflectionAnalysisResultSchema.parse({
        controlFactors: [
          {
            label: 'Morning plan',
            category: 'within_control',
            explanation: 'The plan was clear enough to guide the start of the day.',
            nextStep: 'Keep tomorrow to one top priority before noon.',
          },
        ],
        blockers: [
          {
            blocker: 'Meeting spillover',
            pattern: 'Unplanned follow-up tasks filled the afternoon.',
            impact: 'medium',
            suggestion: 'Block 15 minutes after meetings for quick cleanup.',
          },
        ],
        diagnosis: {
          summary: 'You made progress, but context switching reduced depth.',
          likelyPattern: 'The day lost momentum after interruptions stacked up.',
          encouragingReframe: 'The issue looks more like overload than lack of effort.',
        },
        nextPlan: {
          focusForTomorrow: 'Protect the first deep-work window.',
          smallActions: ['Start with one visible task', 'Silence chat for 30 minutes'],
          avoidTomorrow: ['Adding extra tasks late', 'Checking messages during focus time'],
        },
      }),
    ).toBeTruthy()
  })
})
