import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

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
import { redirectIfProfileExists } from '@/features/coach/route-helpers'

export const Route = createFileRoute('/onboarding/')({
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingStartPage,
})

function OnboardingStartPage() {
  return (
    <PageShell
      eyebrow="Onboarding"
      title="Set up your reflection coach"
      description="A short setup helps the app keep your feedback more relevant and more supportive."
      actions={(
        <Link
          to="/onboarding/avatar"
          className={buttonVariants({ size: 'lg' })}
        >
          Pick your avatar
          <ArrowRight />
        </Link>
      )}
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Step 1
            </Badge>
            <CardTitle>Choose your avatar</CardTitle>
            <CardDescription>
              Start with the working style that feels closest to you today.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Step 2
            </Badge>
            <CardTitle>Name your main struggle</CardTitle>
            <CardDescription>
              This keeps the app focused on the friction you most want to improve.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="outline" className="w-fit">
              Step 3
            </Badge>
            <CardTitle>Get a coach style and first goal</CardTitle>
            <CardDescription>
              A quick quiz shapes the tone, then you set one realistic first target.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What this unlocks</CardTitle>
          <CardDescription>
            Your dashboard, daily reflections, history, and AI productivity analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>Daily check-ins stay grounded in your goal and current work pattern.</p>
          <p>The AI uses encouraging language and avoids blame-focused labels.</p>
          <p>You always leave with a small, practical plan for tomorrow.</p>
        </CardContent>
      </Card>
    </PageShell>
  )
}
