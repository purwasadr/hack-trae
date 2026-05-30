import { z } from 'zod'

// These enums keep the UI labels and the AI response contract aligned.
export const controlFactorCategorySchema = z.enum([
  'within_control',
  'partly_influenced',
  'outside_control',
])

export const blockerImpactSchema = z.enum(['low', 'medium', 'high'])

export const analysisStatusSchema = z.enum(['pending', 'completed', 'failed'])

export const controlFactorSchema = z.object({
  label: z.string().min(1).max(120),
  category: controlFactorCategorySchema,
  explanation: z.string().min(1).max(240),
  nextStep: z.string().min(1).max(180),
})

export const blockerAnalysisSchema = z.object({
  blocker: z.string().min(1).max(120),
  pattern: z.string().min(1).max(180),
  impact: blockerImpactSchema,
  suggestion: z.string().min(1).max(180),
})

export const productivityDiagnosisSchema = z.object({
  summary: z.string().min(1).max(240),
  likelyPattern: z.string().min(1).max(180),
  encouragingReframe: z.string().min(1).max(180),
})

export const actionPlanSchema = z.object({
  focusForTomorrow: z.string().min(1).max(180),
  smallActions: z.array(z.string().min(1).max(120)).min(1).max(5),
  avoidTomorrow: z.array(z.string().min(1).max(120)).min(1).max(5),
})

export const reflectionAnalysisResultSchema = z.object({
  controlFactors: z.array(controlFactorSchema).min(1).max(6),
  blockers: z.array(blockerAnalysisSchema).min(1).max(6),
  diagnosis: productivityDiagnosisSchema,
  nextPlan: actionPlanSchema,
})

export type ControlFactor = z.infer<typeof controlFactorSchema>
export type ControlFactorCategory = z.infer<typeof controlFactorCategorySchema>
export type BlockerAnalysis = z.infer<typeof blockerAnalysisSchema>
export type BlockerImpact = z.infer<typeof blockerImpactSchema>
export type ProductivityDiagnosis = z.infer<typeof productivityDiagnosisSchema>
export type ActionPlan = z.infer<typeof actionPlanSchema>
export type ReflectionAnalysisResult = z.infer<
  typeof reflectionAnalysisResultSchema
>
export type ReflectionAnalysisStatus = z.infer<typeof analysisStatusSchema>

export const controlFactorCategoryLabels: Record<ControlFactorCategory, string> =
  {
    within_control: 'Within your control',
    partly_influenced: 'Partly influenced',
    outside_control: 'Outside your control',
  }

export const blockerImpactLabels: Record<BlockerImpact, string> = {
  low: 'Low impact',
  medium: 'Medium impact',
  high: 'High impact',
}
