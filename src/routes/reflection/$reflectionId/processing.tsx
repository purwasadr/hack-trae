import { createFileRoute, Link, isRedirect, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { analyzeReflection } from '@/server/reflection.fn'

const processingSearchSchema = z.object({
  retry: z.coerce.number().optional(),
})

export const Route = createFileRoute('/reflection/$reflectionId/processing')({
  validateSearch: (search) => processingSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ retry: search.retry }),
  loader: async ({ params }) => {
    await requireProfileOrRedirect()

    try {
      await analyzeReflection({
        data: {
          reflectionId: params.reflectionId,
        },
      })

      throw redirect({
        to: '/reflection/$reflectionId/result',
        params: {
          reflectionId: params.reflectionId,
        },
      })
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }

      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : 'The coach could not finish the analysis right now.',
      }
    }
  },
  component: ReflectionProcessingPage,
})

function ReflectionProcessingPage() {
  const { errorMessage } = Route.useLoaderData()
  const params = Route.useParams()

  return (
    <PageShell
      eyebrow="Reflection"
      title="Analysis needs another try"
      description="Your reflection is saved. The coach ran into a problem while preparing the result."
    >
      <Card>
        <CardHeader>
          <CardTitle>Retry-friendly error</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <p className="text-muted-foreground">{errorMessage}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/reflection/$reflectionId/processing"
              params={params}
              search={{ retry: Date.now() }}
              className={buttonVariants()}
            >
              Try analysis again
            </Link>
            <Link
              to="/dashboard"
              className={buttonVariants({ variant: 'outline' })}
            >
              Return to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
