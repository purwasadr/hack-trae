import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  LogIn,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

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
  const highlights = [
    {
      description: 'Notice what was workable, what was external, and what needs a gentler response.',
      icon: ShieldCheck,
      title: 'Control-aware feedback',
    },
    {
      description: 'Spot repeating friction before it quietly becomes your normal workday pattern.',
      icon: TrendingUp,
      title: 'Blocker patterns',
    },
    {
      description: 'Leave each reflection with one useful move for tomorrow instead of vague advice.',
      icon: Target,
      title: 'Small next plans',
    },
  ] as const
  const journeyStates = [
    {
      body: 'You will be sent to login before starting your first reflection.',
      label: 'Logged out',
    },
    {
      body: 'You will begin onboarding and set your first goal.',
      label: 'Logged in, no profile',
    },
    {
      body: 'You can jump straight to your dashboard and latest reflection.',
      label: 'Logged in, profile ready',
    },
  ] as const

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
        <Card className="relative overflow-hidden border-[#dbe7d4] bg-[linear-gradient(180deg,#f8fbf4_0%,#eef6e6_100%)]">
          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[#f4e4a2]/30 blur-3xl" />
          <CardHeader className="relative">
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
          <CardContent className="relative grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_25px_rgba(17,24,39,0.04)] backdrop-blur"
              >
                <item.icon className="size-5 text-[#4ea72e]" />
                <p className="mt-4 font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6b7566]">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <CardTitle>Where you go next</CardTitle>
            <CardDescription>
              The home page adapts to your current progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {journeyStates.map((state, index) => (
              <div
                key={state.label}
                className="rounded-[20px] border border-[#e4e8df] bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#94a08e]">
                  Step {index + 1}
                </p>
                <p className="mt-3 font-semibold text-slate-900">{state.label}</p>
                <p className="mt-2 leading-6 text-[#6b7566]">{state.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}
