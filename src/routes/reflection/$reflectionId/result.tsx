import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { AnalysisPanel } from '@/components/coach/analysis-panel'
import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { getReflection } from '@/server/reflection.fn'

export const Route = createFileRoute('/reflection/$reflectionId/result')({
  loader: async ({ params }) => {
    await requireProfileOrRedirect()
    const reflection = await getReflection({
      data: {
        reflectionId: params.reflectionId,
      },
    })

    if (!reflection) {
      throw redirect({ to: '/dashboard' })
    }

    if (reflection.analysis?.status !== 'completed') {
      throw redirect({
        to: '/reflection/$reflectionId/processing',
        params: {
          reflectionId: params.reflectionId,
        },
      })
    }

    return reflection
  },
  component: ReflectionResultPage,
})

function ReflectionResultPage() {
  const reflection = Route.useLoaderData()

  return (
    <PageShell
      eyebrow="Reflection Result"
      title="Your productivity reflection"
      description="A supportive read of today’s patterns, blockers, and the next small steps that look most useful."
      actions={(
        <>
          <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
            Dashboard
          </Link>
          <Link to="/history" className={buttonVariants()}>
            History
          </Link>
        </>
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Original reflection</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Work context:</span> {reflection.reflection.workContext}</p>
          <p><span className="font-medium text-foreground">Completed:</span> {reflection.reflection.completedTasks.join(', ')}</p>
          <p><span className="font-medium text-foreground">Unfinished:</span> {reflection.reflection.unfinishedTasks.join(', ')}</p>
        </CardContent>
      </Card>

      <AnalysisPanel
        status={reflection.analysis.status}
        controlFactors={reflection.analysis.controlFactors}
        blockers={reflection.analysis.blockers}
        diagnosis={reflection.analysis.diagnosis}
        nextPlan={reflection.analysis.nextPlan}
        errorMessage={reflection.analysis.errorMessage}
      />
    </PageShell>
  )
}
