import { createFileRoute, Link } from '@tanstack/react-router'

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
      {items.length === 0 ? (
        <Card>
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
            <Card key={item.reflection.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{item.reflection.date}</CardTitle>
                    <CardDescription>{item.reflection.workContext}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {item.analysis?.status ?? 'pending'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}
