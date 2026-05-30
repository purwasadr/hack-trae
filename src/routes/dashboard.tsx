import { createFileRoute, Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  CalendarDays,
  Gauge,
  History,
  Home,
  Leaf,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
  SunMedium,
  Target,
} from 'lucide-react'

import { AnalysisPanel } from '@/components/coach/analysis-panel'
import { buttonVariants } from '@/components/ui/button'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { productivityStyleDetails } from '@/features/coach/profile'
import { cn } from '@/lib/utils'
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
  const latestReflection = summary.latestReflection
  const reflectionDate = latestReflection
    ? new Date(latestReflection.reflection.date)
    : null
  const focusScore = getFocusScore(
    latestReflection?.reflection.focusLevel,
    latestReflection?.reflection.energyLevel,
  )

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fbfcf8_0%,#f4f8ef_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-[1380px] gap-6 px-4 py-6 lg:px-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[78px] shrink-0 rounded-[28px] border border-[#e5eadf] bg-white p-3 shadow-[0_12px_34px_rgba(17,24,39,0.06)] lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Leaf className="size-5" />
            </div>
            <div className="flex flex-col gap-2">
              <SidebarIconButton icon={Home} active label="Dashboard" />
              <Link
                to="/history"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="History"
              >
                <History className="size-4" />
              </Link>
              <Link
                to="/reflection/new"
                className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
                aria-label="New reflection"
              >
                <Plus className="size-4" />
              </Link>
            </div>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#7e8779] transition hover:bg-[#f6f8f3] hover:text-[#3b8e20]"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <section className="relative overflow-hidden rounded-[32px] border border-[#e3e8dc] bg-white px-6 py-7 shadow-[0_14px_40px_rgba(17,24,39,0.05)] md:px-8">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[320px] md:block">
              <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#eef7df] blur-3xl" />
              <div className="absolute bottom-2 right-4 h-32 w-52 rounded-t-[999px] bg-[#f4f8eb]" />
              <div className="absolute bottom-10 right-28 h-20 w-20 rounded-full bg-[#f9e7b3]/55 blur-2xl" />
              <SunMedium className="absolute right-20 top-12 size-9 text-[#f0c568]" />
            </div>
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#4ea72e]">
                  Dashboard
                </p>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.6rem]">
                    Your AI Self-Reflection Coach
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-[#687264] md:text-base">
                    Track your current style, reflect on what matters, and turn insights
                    into practical steps for better productivity.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/history"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'rounded-xl border-[#dde4d6] bg-white px-4 shadow-none hover:bg-[#f6f8f3]',
                  )}
                >
                  <History />
                  History
                </Link>
                <Link
                  to="/reflection/new"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'rounded-xl bg-[#4ea72e] px-4 text-white shadow-[0_10px_24px_rgba(78,167,46,0.24)] hover:bg-[#3b8e20]',
                  )}
                >
                  <Plus />
                  New Reflection
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={Target}
              tone="success"
              label="Main struggle"
              value={formatSnakeCase(summary.profile?.mainStruggle ?? 'not_set_yet')}
            />
            <SummaryCard
              icon={Leaf}
              tone="success"
              label="Current style"
              value={styleDetails?.title ?? 'Profile pending'}
            />
            <SummaryCard
              icon={ListChecks}
              tone="info"
              label="Reflection count"
              value={String(summary.reflectionCount)}
              helper={`${summary.reflectionCount} total reflections`}
            />
            <FocusScoreCard
              score={focusScore}
              label={getMomentumLabel(focusScore)}
            />
          </section>

          {latestReflection ? (
            <div className="mt-6 grid gap-6">
              <section className="overflow-hidden rounded-[28px] border border-[#e4e8df] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)] md:p-6">
                <div className="grid gap-5 md:grid-cols-[auto,1fr,160px] md:items-center">
                  <div className="rounded-[20px] bg-[#f3f7ec] px-4 py-5 text-center text-[#5f6b5a]">
                    <CalendarDays className="mx-auto mb-3 size-5 text-[#4ea72e]" />
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77826f]">
                      {reflectionDate
                        ? reflectionDate.toLocaleString('en-US', { month: 'short' })
                        : 'Latest'}
                    </div>
                    <div className="mt-1 text-xl font-semibold text-slate-900">
                      {reflectionDate ? reflectionDate.getDate() : '--'}
                    </div>
                    <div className="text-sm">
                      {reflectionDate
                        ? reflectionDate.toLocaleString('en-US', { weekday: 'long' })
                        : ''}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Latest Reflection</h2>
                      <p className="text-sm leading-6 text-[#6b7566]">
                        A quick snapshot of the most recent day you reflected on.
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-[#d8e7c8] bg-[#f8fbf2] px-4 py-3 text-sm italic leading-6 text-[#5e6959]">
                      “{latestReflection.reflection.workContext}”
                    </div>
                    <p className="text-sm leading-6 text-[#6b7566]">
                      <span className="font-semibold text-[#4ea72e]">Goal:</span>{' '}
                      {summary.profile?.firstGoal ?? 'No goal saved yet'}
                    </p>
                  </div>

                  <div className="hidden items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#f9fcf4_0%,#f4f8eb_100%)] p-5 md:flex">
                    <div className="rounded-[20px] bg-white/80 p-4 text-[#4ea72e] shadow-[0_10px_24px_rgba(78,167,46,0.12)]">
                      <BookOpen className="size-12" />
                    </div>
                  </div>
                </div>
              </section>

              <AnalysisPanel
                status={latestReflection.analysis?.status ?? 'pending'}
                controlFactors={latestReflection.analysis?.controlFactors ?? null}
                blockers={latestReflection.analysis?.blockers ?? null}
                diagnosis={latestReflection.analysis?.diagnosis ?? null}
                nextPlan={latestReflection.analysis?.nextPlan ?? null}
                errorMessage={latestReflection.analysis?.errorMessage}
              />
            </div>
          ) : (
            <section className="mt-6 rounded-[28px] border border-[#e4e8df] bg-white p-8 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
              <div className="flex max-w-2xl flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
                  <Sparkles className="size-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-slate-900">No reflections yet</h2>
                  <p className="text-sm leading-6 text-[#5f6b5a]">
                    Your profile is ready. Start your first reflection to unlock your
                    control factors, blocker analysis, and next practical plan.
                  </p>
                </div>
                <div>
                  <Link
                    to="/reflection/new"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'rounded-xl bg-[#4ea72e] px-4 text-white shadow-[0_10px_24px_rgba(78,167,46,0.24)] hover:bg-[#3b8e20]',
                    )}
                  >
                    Start First Reflection
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  helper?: string
  tone: 'success' | 'info'
}) {
  const toneStyles = tone === 'success'
    ? 'bg-[#eef8e8] text-[#3b8e20]'
    : 'bg-[#eff5ff] text-[#315ebd]'

  return (
    <section className="rounded-[24px] border border-[#e4e8df] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <div className="flex h-full flex-col gap-4">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', toneStyles)}>
          <Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b9486]">
            {label}
          </p>
          <p className="text-xl font-semibold text-slate-900">{value}</p>
          {helper ? <p className="text-sm text-[#6b7566]">{helper}</p> : null}
        </div>
      </div>
    </section>
  )
}

function FocusScoreCard({
  score,
  label,
}: {
  score: number
  label: string
}) {
  const ringStyle = {
    background: `conic-gradient(#4ea72e ${score * 3.6}deg, #e8efe0 0deg)`,
  }

  return (
    <section className="rounded-[24px] border border-[#e4e8df] bg-white p-5 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
      <div className="flex h-full flex-col gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
          <Gauge className="size-5" />
        </div>
        <div className="flex items-center gap-4">
          <div
            className="grid h-20 w-20 place-items-center rounded-full p-1"
            style={ringStyle}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
              <span className="text-2xl font-semibold text-slate-900">{score}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b9486]">
              Focus score
            </p>
            <p className="text-sm font-medium text-slate-900">{label}</p>
            <p className="text-xs text-[#7b8576]">
              Built from your latest focus and energy ratings
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SidebarIconButton({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
}) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-2xl',
        active ? 'bg-[#eef8e8] text-[#3b8e20]' : 'text-[#7e8779]',
      )}
      aria-label={label}
    >
      <Icon className="size-4" />
    </div>
  )
}

function formatSnakeCase(value: string) {
  return value
    .split('_')
    .filter(Boolean)
    .join(' ')
}

function getFocusScore(focusLevel?: number, energyLevel?: number) {
  if (!focusLevel || !energyLevel) {
    return 0
  }

  return Math.round(((focusLevel + energyLevel) / 20) * 100)
}

function getMomentumLabel(score: number) {
  if (score >= 75) {
    return 'Strong momentum'
  }

  if (score >= 60) {
    return 'Keep building momentum'
  }

  if (score >= 40) {
    return 'A gentler reset may help'
  }

  return 'Start with one smaller win'
}
