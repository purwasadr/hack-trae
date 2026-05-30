import { createFileRoute, Link } from '@tanstack/react-router'
import { History, Plus } from 'lucide-react'

import { AnalysisPanel } from '@/components/coach/analysis-panel'
import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { productivityStyleDetails } from '@/features/coach/profile'
import { getDashboardSummary } from '@/server/reflection.fn'

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    await requireProfileOrRedirect()
    return getDashboardSummary()
  },
  component: DashboardPage,
})

function DashboardPage() {
  const summary = Route.useLoaderData()
  const styleDetails = summary.profile
    ? productivityStyleDetails[summary.profile.productivityStyle]
    : null

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Your productivity dashboard"
      description="Track your current style, your latest reflection, and the next useful action."
      actions={(
        <>
          <Link
            to="/history"
            className={buttonVariants({ variant: 'outline' })}
          >
            <History />
            History
          </Link>
          <Link to="/reflection/new" className={buttonVariants()}>
            <Plus />
            New reflection
          </Link>
        </>
      )}
    >
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Main struggle</CardDescription>
            <CardTitle>{summary.profile?.mainStruggle ?? 'Not set yet'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Current style</CardDescription>
            <CardTitle>{styleDetails?.title ?? 'Profile pending'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Reflection count</CardDescription>
            <CardTitle>{summary.reflectionCount}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      {summary.latestReflection ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Latest reflection</CardTitle>
              <CardDescription>
                {summary.latestReflection.reflection.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>{summary.latestReflection.reflection.workContext}</p>
              <p>
                <span className="font-medium text-foreground">Goal:</span>{' '}
                {summary.profile?.firstGoal ?? 'No goal saved yet'}
              </p>
            </CardContent>
          </Card>

          <AnalysisPanel
            status={summary.latestReflection.analysis?.status ?? 'pending'}
            controlFactors={summary.latestReflection.analysis?.controlFactors ?? null}
            blockers={summary.latestReflection.analysis?.blockers ?? null}
            diagnosis={summary.latestReflection.analysis?.diagnosis ?? null}
            nextPlan={summary.latestReflection.analysis?.nextPlan ?? null}
            errorMessage={summary.latestReflection.analysis?.errorMessage}
          />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No reflections yet</CardTitle>
            <CardDescription>
              Your profile is ready. Start your first reflection to unlock analysis and history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/reflection/new" className={buttonVariants()}>
              Start first reflection
            </Link>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}
