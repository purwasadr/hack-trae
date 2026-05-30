import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Compass, Flag, Shapes } from 'lucide-react'

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
  const steps = [
    {
      description: 'Start with the working style that feels closest to you today.',
      icon: Compass,
      label: 'Step 1',
      title: 'Choose your avatar',
    },
    {
      description: 'Keep the coach focused on the friction you most want to improve.',
      icon: Flag,
      label: 'Step 2',
      title: 'Name your main struggle',
    },
    {
      description: 'Get a style suggestion, then set one realistic first target.',
      icon: Shapes,
      label: 'Step 3',
      title: 'Shape your starting plan',
    },
  ] as const

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
        {steps.map((step) => (
          <Card key={step.title} className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
                <step.icon className="size-5" />
              </div>
              <Badge variant="outline" className="w-fit">
                {step.label}
              </Badge>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
        <CardHeader>
          <CardTitle>What this unlocks</CardTitle>
          <CardDescription>
            Your dashboard, daily reflections, history, and AI productivity analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-[20px] border border-[#e4e8df] bg-white p-4 text-[#6b7566]">
            Daily check-ins stay grounded in your goal and current work pattern.
          </div>
          <div className="rounded-[20px] border border-[#e4e8df] bg-white p-4 text-[#6b7566]">
            The AI uses encouraging language and avoids blame-focused labels.
          </div>
          <div className="rounded-[20px] border border-[#e4e8df] bg-white p-4 text-[#6b7566]">
            You always leave with a small, practical plan for tomorrow.
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
