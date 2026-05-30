import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, LogIn, Sparkles } from 'lucide-react'

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
import { getSession } from '@/server/auth.fn'
import { getCoachProfile } from '@/server/reflection.fn'

export const Route = createFileRoute('/')({
  loader: async () => {
    const session = await getSession()
    const profile = session ? await getCoachProfile() : null
    return {
      profile,
      session,
    }
  },
  component: App,
})

function App() {
  const { profile, session } = Route.useLoaderData()

  const primaryAction = !session
    ? {
        icon: LogIn,
        label: 'Login to start',
        to: '/login' as const,
      }
    : profile
      ? {
          icon: ArrowRight,
          label: 'Open dashboard',
          to: '/dashboard' as const,
        }
      : {
          icon: Sparkles,
          label: 'Start onboarding',
          to: '/onboarding' as const,
        }

  return (
    <PageShell
      eyebrow="AI Self-Reflection Coach"
      title="Understand your productivity without blaming yourself"
      description="Reflect on your day, spot what was within your control, and leave with a small plan that feels practical for tomorrow."
      actions={(
        <Link to={primaryAction.to} className={buttonVariants({ size: 'lg' })}>
          <primaryAction.icon />
          {primaryAction.label}
        </Link>
      )}
    >
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Supportive coach tone
            </Badge>
            <CardTitle className="text-2xl">
              Turn reflection into a calmer next step
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              This MVP helps you review work context, blockers, focus, unfinished tasks,
              and the patterns that likely shaped your day. The AI keeps the language
              practical and encouraging.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border bg-background p-4">
              <p className="font-medium">Control factors</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Separate what you can act on from what needs a softer response.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="font-medium">Blocker analysis</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Spot the recurring friction behind missed progress.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="font-medium">Next practical plan</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Finish with a small plan for tomorrow instead of vague advice.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Where you go next</CardTitle>
            <CardDescription>
              The home page adapts to your current progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="rounded-lg border p-4">
              <p className="font-medium">Logged out</p>
              <p className="mt-2 text-muted-foreground">
                You will be sent to login before starting your first reflection.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Logged in, no profile</p>
              <p className="mt-2 text-muted-foreground">
                You will begin onboarding and set your first goal.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-medium">Logged in, profile ready</p>
              <p className="mt-2 text-muted-foreground">
                You can jump straight to your dashboard and latest reflection.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}
