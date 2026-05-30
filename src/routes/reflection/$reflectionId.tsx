import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

import { AnalysisPanel } from '@/components/coach/analysis-panel'
import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { getReflection } from '@/server/reflection.fn'

export const Route = createFileRoute('/reflection/$reflectionId')({
  loader: async ({ params }) => {
    await requireProfileOrRedirect()
    const reflection = await getReflection({
      data: {
        reflectionId: params.reflectionId,
      },
    })

    if (!reflection) {
      throw redirect({ to: '/history' })
    }

    return reflection
  },
  component: ReflectionDetailPage,
})

function ReflectionDetailPage() {
  const reflection = Route.useLoaderData()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  // This route is also the parent for `/result` and `/processing`.
  // Only render the detail page for the exact path so child routes can render normally.
  if (pathname !== `/reflection/${reflection.reflection.id}`) {
    return <Outlet />
  }

  return (
    <PageShell
      eyebrow="Reflection Detail"
      title={reflection.reflection.date}
      description="See the original reflection side by side with the latest available analysis."
      actions={(
        <>
          <Link to="/history" className={buttonVariants({ variant: 'outline' })}>
            History
          </Link>
          <Link
            to="/reflection/$reflectionId/result"
            params={{ reflectionId: reflection.reflection.id }}
            className={buttonVariants()}
          >
            Result page
          </Link>
        </>
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Original reflection</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
          <p><span className="font-medium text-foreground">Work context:</span> {reflection.reflection.workContext}</p>
          <p><span className="font-medium text-foreground">Planned tasks:</span> {reflection.reflection.plannedTasks.join(', ')}</p>
          <p><span className="font-medium text-foreground">Completed tasks:</span> {reflection.reflection.completedTasks.join(', ')}</p>
          <p><span className="font-medium text-foreground">Unfinished tasks:</span> {reflection.reflection.unfinishedTasks.join(', ')}</p>
          <p><span className="font-medium text-foreground">Distractions:</span> {reflection.reflection.distractions.join(', ') || 'None noted'}</p>
          <p><span className="font-medium text-foreground">Blockers:</span> {reflection.reflection.blockers.join(', ') || 'None noted'}</p>
          <p><span className="font-medium text-foreground">Mood:</span> {reflection.reflection.mood}</p>
          <p><span className="font-medium text-foreground">Notes:</span> {reflection.reflection.notes || 'No extra notes'}</p>
        </CardContent>
      </Card>

      <AnalysisPanel
        status={reflection.analysis?.status ?? 'pending'}
        controlFactors={reflection.analysis?.controlFactors ?? null}
        blockers={reflection.analysis?.blockers ?? null}
        diagnosis={reflection.analysis?.diagnosis ?? null}
        nextPlan={reflection.analysis?.nextPlan ?? null}
        errorMessage={reflection.analysis?.errorMessage}
      />
    </PageShell>
  )
}
