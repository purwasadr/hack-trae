import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ClipboardList, Sparkles } from 'lucide-react'

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
  const analysis = reflection.analysis

  if (!analysis) {
    return null
  }

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
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <ClipboardList className="size-5" />
            </div>
            <CardTitle>Today&apos;s reflection snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm leading-6 text-[#6b7566]">
            <p>
              <span className="font-medium text-slate-900">Work context:</span>{' '}
              {reflection.reflection.workContext}
            </p>
            <p>
              <span className="font-medium text-slate-900">Completed:</span>{' '}
              {reflection.reflection.completedTasks.join(', ')}
            </p>
            <p>
              <span className="font-medium text-slate-900">Unfinished:</span>{' '}
              {reflection.reflection.unfinishedTasks.join(', ')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>How to read this</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-[#6b7566]">
            The coach is looking for useful patterns, not perfect performance. Use the
            analysis to decide what small adjustment would help tomorrow feel easier.
          </CardContent>
        </Card>
      </section>

      <Card className="bg-[#fcfdf9]">
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
        status={analysis.status}
        controlFactors={analysis.controlFactors}
        blockers={analysis.blockers}
        diagnosis={analysis.diagnosis}
        nextPlan={analysis.nextPlan}
        errorMessage={analysis.errorMessage}
      />
    </PageShell>
  )
}
