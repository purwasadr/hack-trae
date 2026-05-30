import { z } from 'zod'

import { reflectionAnalysisResultSchema } from '@/features/coach/analysis'
import type { SaveOnboardingProfileInput } from '@/features/coach/profile'
import type { ReflectionInput } from '@/features/coach/reflection'
import { ServerFnError } from '@/lib/server-fn-error'

const outputContractText = `{
  "controlFactors": [
    {
      "label": "string",
      "category": "within_control | partly_influenced | outside_control",
      "explanation": "string",
      "nextStep": "string"
    }
  ],
  "blockers": [
    {
      "blocker": "string",
      "pattern": "string",
      "impact": "low | medium | high",
      "suggestion": "string"
    }
  ],
  "diagnosis": {
    "summary": "string",
    "likelyPattern": "string",
    "encouragingReframe": "string"
  },
  "nextPlan": {
    "focusForTomorrow": "string",
    "smallActions": ["string"],
    "avoidTomorrow": ["string"]
  }
}`

const openRouterEnvelopeSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.union([
          z.string(),
          z.array(
            z.object({
              type: z.string(),
              text: z.string().optional(),
            }),
          ),
        ]),
      }),
    }),
  ).min(1),
})

function getRequiredOpenRouterModel() {
  const model = process.env.OPENROUTER_MODEL
  if (!model) {
    throw new ServerFnError(
      'OPERATION_FAILED',
      'The coach is not ready yet because the analysis model is missing.',
    )
  }
  return model
}

function extractMessageContent(content: string | Array<{ type: string; text?: string }>) {
  if (typeof content === 'string') {
    return content
  }

  return content
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n')
}

function stripJsonFence(value: string) {
  return value.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
}

export function parseOpenRouterAnalysisResponse(rawResponse: string) {
  const envelope = openRouterEnvelopeSchema.parse(JSON.parse(rawResponse))
  const message = extractMessageContent(envelope.choices[0].message.content)
  return reflectionAnalysisResultSchema.parse(JSON.parse(stripJsonFence(message)))
}

function buildPrompt(input: {
  profile: SaveOnboardingProfileInput | null
  reflection: ReflectionInput
}) {
  const profileSummary = input.profile
    ? [
        `Avatar: ${input.profile.avatar}`,
        `Main struggle: ${input.profile.mainStruggle}`,
        `Productivity style: ${input.profile.productivityStyle}`,
        `First goal: ${input.profile.firstGoal}`,
      ].join('\n')
    : 'No onboarding profile is available for this user.'

  return [
    'You are a supportive productivity coach.',
    'Be practical, brief, and encouraging.',
    'Do not blame the user.',
    'Do not diagnose medical conditions.',
    'Use these control labels only: within_control, partly_influenced, outside_control.',
    'Return valid JSON only. No markdown. No explanation outside the JSON object.',
    'These reflection answers come from guided multiple-choice prompts, so be helpful without inventing fake specifics.',
    '',
    'Output schema:',
    outputContractText,
    '',
    'User profile:',
    profileSummary,
    '',
    'Reflection:',
    `Date: ${input.reflection.date}`,
    `Work context: ${input.reflection.workContext}`,
    `Planned tasks: ${input.reflection.plannedTasks.join('; ')}`,
    `Completed tasks: ${input.reflection.completedTasks.join('; ')}`,
    `Unfinished tasks: ${input.reflection.unfinishedTasks.join('; ')}`,
    `Focus level: ${input.reflection.focusLevel}/10`,
    `Energy level: ${input.reflection.energyLevel}/10`,
    `Distractions: ${input.reflection.distractions.join('; ') || 'None noted'}`,
    `Blockers: ${input.reflection.blockers.join('; ') || 'None noted'}`,
    `Mood: ${input.reflection.mood}`,
    `Notes: ${input.reflection.notes || 'No extra notes'}`,
  ].join('\n')
}

export async function analyzeReflectionWithOpenRouter(input: {
  profile: SaveOnboardingProfileInput | null
  reflection: ReflectionInput
}) {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = getRequiredOpenRouterModel()

  if (!apiKey) {
    throw new ServerFnError(
      'OPERATION_FAILED',
      'The coach is not ready yet because the analysis key is missing.',
    )
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(process.env.OPENROUTER_APP_URL
        ? { 'HTTP-Referer': process.env.OPENROUTER_APP_URL }
        : {}),
      ...(process.env.OPENROUTER_APP_NAME
        ? { 'X-Title': process.env.OPENROUTER_APP_NAME }
        : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: {
        type: 'json_object',
      },
      messages: [
        {
          role: 'system',
          content:
            'You are a calm productivity coach. Reply with strict JSON only.',
        },
        {
          role: 'user',
          content: buildPrompt(input),
        },
      ],
    }),
  })

  const rawResponse = await response.text()

  if (!response.ok) {
    throw new ServerFnError(
      'OPERATION_FAILED',
      'The coach could not finish the analysis right now. Please try again in a moment.',
    )
  }

  try {
    const result = parseOpenRouterAnalysisResponse(rawResponse)
    return {
      model,
      provider: 'openrouter' as const,
      rawResponse,
      result,
    }
  } catch {
    throw new ServerFnError(
      'OPERATION_FAILED',
      'The coach returned an unreadable analysis. Please try again.',
    )
  }
}
