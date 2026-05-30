import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Clock3, Sparkles } from 'lucide-react'

import { PageShell } from '@/components/coach/page-shell'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { listReflections } from '@/server/reflection.fn'

export const Route = createFileRoute('/history')({
  loader: async () => {
    await requireProfileOrRedirect()
    return listReflections()
  },
  component: HistoryPage,
})

function HistoryPage() {
  const items = Route.useLoaderData()
  const latestDate = items[0]?.reflection.date ?? 'No entries yet'

  return (
    <PageShell
      eyebrow="History"
      title="Past reflections"
      description="Review recent entries, reopen analysis results, or revisit the original details."
      actions={(
        <Link to="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Dashboard
        </Link>
      )}
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <CalendarDays className="size-5" />
            </div>
            <CardTitle>Your reflection archive</CardTitle>
            <CardDescription>
              Revisit recent patterns, compare older entries, or reopen a past result when
              you want more context.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="grid gap-6">
          <Card className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
                <Clock3 className="size-5" />
              </div>
              <CardTitle>{items.length} reflections</CardTitle>
              <CardDescription>Latest entry: {latestDate}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
                <Sparkles className="size-5" />
              </div>
              <CardTitle>Supportive review</CardTitle>
              <CardDescription>
                Use older entries to notice what helps your workdays recover, not to judge
                yourself for imperfect weeks.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {items.length === 0 ? (
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <CardTitle>No history yet</CardTitle>
            <CardDescription>
              Finish your first reflection and it will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.reflection.id} className="bg-[#fcfdf9]">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{item.reflection.date}</CardTitle>
                    <CardDescription>{item.reflection.workContext}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-[#d7e4cd] bg-white text-[#55704c]">
                    {item.analysis?.status ?? 'pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-3 text-sm text-[#6b7566] md:grid-cols-3">
                  <div className="rounded-[18px] border border-[#e4e8df] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94a08e]">
                      Completed
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {item.reflection.completedTasks.length} items
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-[#e4e8df] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94a08e]">
                      Unfinished
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {item.reflection.unfinishedTasks.length} items
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-[#e4e8df] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#94a08e]">
                      Mood
                    </p>
                    <p className="mt-2 font-semibold capitalize text-slate-900">
                      {item.reflection.mood.replaceAll('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                <Link
                  to="/reflection/$reflectionId"
                  params={{ reflectionId: item.reflection.id }}
                  className={buttonVariants({ variant: 'outline' })}
                >
                  View details
                </Link>
                <Link
                  to="/reflection/$reflectionId/result"
                  params={{ reflectionId: item.reflection.id }}
                  className={buttonVariants()}
                >
                  View result
                </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
