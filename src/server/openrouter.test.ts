import { describe, expect, it } from 'vitest'

import { parseOpenRouterAnalysisResponse } from './openrouter'

describe('parseOpenRouterAnalysisResponse', () => {
  it('reads strict JSON from an OpenRouter chat completion envelope', () => {
    expect(
      parseOpenRouterAnalysisResponse(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  controlFactors: [
                    {
                      label: 'Task sizing',
                      category: 'within_control',
                      explanation: 'The task list was larger than the available time.',
                      nextStep: 'Limit tomorrow to one essential task first.',
                    },
                  ],
                  blockers: [
                    {
                      blocker: 'Interruptions',
                      pattern: 'Messages kept breaking concentration.',
                      impact: 'high',
                      suggestion: 'Use one protected focus block before checking chat.',
                    },
                  ],
                  diagnosis: {
                    summary: 'Progress was possible, but the day got fragmented.',
                    likelyPattern: 'Frequent context switching drained momentum.',
                    encouragingReframe: 'This looks fixable with stronger boundaries.',
                  },
                  nextPlan: {
                    focusForTomorrow: 'Protect the first hour for focused work.',
                    smallActions: ['Pick one top task'],
                    avoidTomorrow: ['Opening chat first'],
                  },
                }),
              },
            },
          ],
        }),
      ),
    ).toBeTruthy()
  })

  it('throws when the provider response is malformed', () => {
    expect(() =>
      parseOpenRouterAnalysisResponse(
        JSON.stringify({
          choices: [
            {
              message: {
                content: '{"diagnosis":{}}',
              },
            },
          ],
        }),
      ),
    ).toThrow('Invalid')
  })
})
