import {
  blockerImpactLabels,
  controlFactorCategoryLabels,
  type ActionPlan,
  type BlockerAnalysis,
  type ControlFactor,
  type ProductivityDiagnosis,
} from '@/features/coach/analysis'
import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Leaf,
  ListChecks,
  ListTodo,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'

type AnalysisPanelProps = {
  status: string
  controlFactors: ControlFactor[] | null
  blockers: BlockerAnalysis[] | null
  diagnosis: ProductivityDiagnosis | null
  nextPlan: ActionPlan | null
  errorMessage?: string | null
}

export function AnalysisPanel({
  status,
  controlFactors,
  blockers,
  diagnosis,
  nextPlan,
  errorMessage,
}: AnalysisPanelProps) {
  if (status !== 'completed' || !controlFactors || !blockers || !diagnosis || !nextPlan) {
    return (
      <section className="rounded-[28px] border border-[#e4e8df] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Analysis unavailable</h2>
          <p className="text-sm leading-6 text-[#5f6b5a]">
            {errorMessage
              ? errorMessage
              : 'The coach has not finished this reflection yet.'}
          </p>
        </div>
      </section>
    )
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[#e4e8df] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <SectionHeading
          number={1}
          title="Control Factor Classification"
          description="A calm split between what you can act on now and what needs a softer response."
        />
        <div className="grid gap-4">
          {controlFactors.map((factor) => (
            <div
              key={`${factor.label}-${factor.category}`}
              className="grid gap-4 rounded-[22px] border border-[#e7ebdf] bg-[#fcfdf9] p-5 md:grid-cols-[auto,1fr,auto]"
            >
              <IconBadge
                icon={getControlFactorIcon(factor.category, factor.label)}
                tone={getControlFactorTone(factor.category)}
              />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                  {factor.label}
                </h3>
                <p className="text-sm leading-6 text-[#6d7768]">{factor.explanation}</p>
                <p className="text-sm font-medium text-[#3b8e20]">
                  Next step: <span className="font-normal text-[#5f6b5a]">{factor.nextStep}</span>
                </p>
              </div>
              <StatusBadge tone={getControlFactorTone(factor.category)}>
                {controlFactorCategoryLabels[factor.category]}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#e4e8df] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <SectionHeading
          number={2}
          title="Productivity Blocker Analysis"
          description="Patterns that likely pulled down progress today."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {blockers.map((item) => (
            <div
              key={item.blocker}
              className="rounded-[22px] border border-[#ebe5dc] bg-[#fffdfa] p-5 shadow-[0_6px_20px_rgba(17,24,39,0.03)]"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <IconBadge
                  icon={getBlockerIcon(item.blocker)}
                  tone={getBlockerTone(item.impact)}
                />
                <StatusBadge tone={getBlockerTone(item.impact)}>
                  {blockerImpactLabels[item.impact]}
                </StatusBadge>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                {item.blocker}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#b66a00]">
                <span className="font-semibold">Pattern:</span> {item.pattern}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#6d7768]">
                <span className="font-semibold text-slate-900">Suggestion:</span> {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#d6e9c9] bg-[linear-gradient(180deg,#f9fcf4_0%,#f1f8e6_100%)] p-6 shadow-[0_10px_30px_rgba(72,128,48,0.08)]">
        <div className="relative">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#dff0cf]/60 blur-2xl" />
          <div className="relative grid gap-5">
            <SectionHeading
              number={3}
              title="AI Productivity Diagnosis"
              description="A short summary designed to guide tomorrow, not judge today."
              icon={BrainCircuit}
              compact
            />
            <div className="grid gap-4 md:grid-cols-3">
              <InsightColumn
                title="Summary"
                icon={CheckCircle2}
                content={diagnosis.summary}
              />
              <InsightColumn
                title="Likely pattern"
                icon={Sparkles}
                content={diagnosis.likelyPattern}
              />
              <InsightColumn
                title="Encouraging reframe"
                icon={Leaf}
                content={diagnosis.encouragingReframe}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-[#e4e8df] bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.05)]">
        <div className="relative">
          <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-[#f1f7e8]" />
          <div className="relative grid gap-5">
            <SectionHeading
              number={4}
              title="Next Practical Plan"
              description="Small moves to make tomorrow feel more manageable."
            />
            <div className="rounded-[18px] border border-[#d9e8c7] bg-[#f6fbef] px-4 py-3 text-sm text-[#41663a]">
              <span className="font-semibold">Focus for tomorrow:</span>{' '}
              {nextPlan.focusForTomorrow}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.15fr,0.85fr]">
              <ChecklistCard
                title="Small actions"
                icon={ListChecks}
                tone="success"
                items={nextPlan.smallActions}
              />
              <ChecklistCard
                title="Avoid tomorrow"
                icon={AlertTriangle}
                tone="warning"
                items={nextPlan.avoidTomorrow}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({
  number,
  title,
  description,
  icon: Icon,
  compact = false,
}: {
  number: number
  title: string
  description: string
  icon?: LucideIcon
  compact?: boolean
}) {
  return (
    <div className={cn('flex items-start gap-3', compact ? 'mb-1' : 'mb-5')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4ea72e] text-sm font-bold text-white">
        {Icon ? <Icon className="size-4" /> : number}
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-[#6b7566]">{description}</p>
      </div>
    </div>
  )
}

function InsightColumn({
  title,
  content,
  icon: Icon,
}: {
  title: string
  content: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-[20px] border border-[#dceccd] bg-white/70 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2 text-[#3b8e20]">
        <Icon className="size-4" />
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-[#5f6b5a]">{content}</p>
    </div>
  )
}

function ChecklistCard({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string
  items: string[]
  icon: LucideIcon
  tone: 'success' | 'warning'
}) {
  const toneStyles = tone === 'success'
    ? {
        box: 'border-[#d9e8c7] bg-[#fbfdf8]',
        icon: 'bg-[#eef8e8] text-[#3b8e20]',
        bullet: 'bg-[#4ea72e]',
      }
    : {
        box: 'border-[#f0debc] bg-[#fffdfa]',
        icon: 'bg-[#fff7e8] text-[#b66a00]',
        bullet: 'bg-[#e89b2d]',
      }

  return (
    <div className={cn('rounded-[22px] border p-5', toneStyles.box)}>
      <div className="mb-4 flex items-center gap-3">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', toneStyles.icon)}>
          <Icon className="size-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#5f6b5a]">
            <span className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', toneStyles.bullet)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function IconBadge({
  icon: Icon,
  tone,
}: {
  icon: LucideIcon
  tone: 'success' | 'warning' | 'neutral' | 'info' | 'danger'
}) {
  const toneClasses = {
    success: 'bg-[#eef8e8] text-[#3b8e20]',
    warning: 'bg-[#fff7e8] text-[#b66a00]',
    neutral: 'bg-[#f4f6f2] text-[#798274]',
    info: 'bg-[#eff5ff] text-[#315ebd]',
    danger: 'bg-[#fff1f0] text-[#c0392b]',
  } satisfies Record<typeof tone, string>

  return (
    <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', toneClasses[tone])}>
      <Icon className="size-5" />
    </div>
  )
}

function StatusBadge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'success' | 'warning' | 'neutral' | 'info' | 'danger'
}) {
  const toneClasses = {
    success: 'border-[#bfe3ae] bg-[#eef8e8] text-[#2f721c]',
    warning: 'border-[#f4d39a] bg-[#fff7e8] text-[#b66a00]',
    neutral: 'border-[#d9ded3] bg-[#f4f6f2] text-[#5f6b5a]',
    info: 'border-[#b8ccf5] bg-[#eff5ff] text-[#315ebd]',
    danger: 'border-[#f0b5ae] bg-[#fff1f0] text-[#c0392b]',
  } satisfies Record<typeof tone, string>

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  )
}

function getControlFactorTone(category: ControlFactor['category']) {
  switch (category) {
    case 'within_control':
      return 'success' as const
    case 'partly_influenced':
      return 'warning' as const
    case 'outside_control':
      return 'neutral' as const
  }
}

function getBlockerTone(impact: BlockerAnalysis['impact']) {
  switch (impact) {
    case 'high':
      return 'danger' as const
    case 'medium':
      return 'warning' as const
    case 'low':
      return 'success' as const
  }
}

function getControlFactorIcon(
  category: ControlFactor['category'],
  label: string,
) {
  const normalized = label.toLowerCase()

  if (normalized.includes('message') || normalized.includes('notification')) {
    return BellRing
  }

  if (normalized.includes('meeting') || normalized.includes('schedule')) {
    return Users
  }

  if (category === 'within_control') {
    return ShieldCheck
  }

  if (category === 'partly_influenced') {
    return Scale
  }

  return Cloud
}

function getBlockerIcon(label: string) {
  const normalized = label.toLowerCase()

  if (normalized.includes('priority')) {
    return Target
  }

  if (normalized.includes('message') || normalized.includes('notification')) {
    return BellRing
  }

  if (normalized.includes('admin') || normalized.includes('task')) {
    return ListTodo
  }

  return AlertTriangle
}
