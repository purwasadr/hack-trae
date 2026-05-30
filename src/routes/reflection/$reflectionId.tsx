import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { ClipboardList, Sparkles } from 'lucide-react'

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
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <ClipboardList className="size-5" />
            </div>
            <CardTitle>Reflection overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm leading-6 text-[#6b7566]">
            <p>
              <span className="font-medium text-slate-900">Focus:</span>{' '}
              {reflection.reflection.focusLevel}/10
            </p>
            <p>
              <span className="font-medium text-slate-900">Energy:</span>{' '}
              {reflection.reflection.energyLevel}/10
            </p>
            <p>
              <span className="font-medium text-slate-900">Mood:</span>{' '}
              {reflection.reflection.mood.replaceAll('_', ' ')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Latest analysis status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-[#6b7566]">
            {reflection.analysis
              ? `This entry currently has a ${reflection.analysis.status} analysis attached.`
              : 'This entry is saved, but no completed analysis is attached yet.'}
          </CardContent>
        </Card>
      </section>

      <Card className="bg-[#fcfdf9]">
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
