import {
  blockerImpactLabels,
  controlFactorCategoryLabels,
  type ActionPlan,
  type BlockerAnalysis,
  type ControlFactor,
  type ProductivityDiagnosis,
} from '@/features/coach/analysis'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AnalysisPanelProps = {
  status: string
  controlFactors: ControlFactor[] | null
  blockers: BlockerAnalysis[] | null
  diagnosis: ProductivityDiagnosis | null
  nextPlan: ActionPlan | null
  errorMessage?: string | null
}

export function AnalysisPanel({
  status,
  controlFactors,
  blockers,
  diagnosis,
  nextPlan,
  errorMessage,
}: AnalysisPanelProps) {
  if (status !== 'completed' || !controlFactors || !blockers || !diagnosis || !nextPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analysis unavailable</CardTitle>
          <CardDescription>
            {errorMessage
              ? errorMessage
              : 'The coach has not finished this reflection yet.'}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Control Factor Classification</CardTitle>
          <CardDescription>
            A calm split between what you can act on now and what needs a softer response.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {controlFactors.map((factor) => (
            <div key={`${factor.label}-${factor.category}`} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-medium">{factor.label}</h3>
                <Badge variant="outline">
                  {controlFactorCategoryLabels[factor.category]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{factor.explanation}</p>
              <p className="mt-3 text-sm font-medium">Next step: {factor.nextStep}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productivity Blocker Analysis</CardTitle>
          <CardDescription>
            Patterns that likely pulled down progress today.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {blockers.map((item) => (
            <div key={item.blocker} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-medium">{item.blocker}</h3>
                <Badge variant="secondary">
                  {blockerImpactLabels[item.impact]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Pattern: {item.pattern}</p>
              <p className="mt-2 text-sm font-medium">Suggestion: {item.suggestion}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Productivity Diagnosis</CardTitle>
          <CardDescription>
            A short summary designed to guide tomorrow, not judge today.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-6">
          <p><span className="font-medium">Summary:</span> {diagnosis.summary}</p>
          <p><span className="font-medium">Likely pattern:</span> {diagnosis.likelyPattern}</p>
          <p><span className="font-medium">Encouraging reframe:</span> {diagnosis.encouragingReframe}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Practical Plan</CardTitle>
          <CardDescription>
            Small moves to make tomorrow feel more manageable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6">
          <p><span className="font-medium">Focus for tomorrow:</span> {nextPlan.focusForTomorrow}</p>
          <div>
            <p className="font-medium">Small actions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {nextPlan.smallActions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-medium">Avoid tomorrow</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {nextPlan.avoidTomorrow.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
