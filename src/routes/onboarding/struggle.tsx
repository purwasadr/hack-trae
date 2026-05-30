import { createFileRoute, Link } from '@tanstack/react-router'
import { Flag, Sparkles } from 'lucide-react'
import { z } from 'zod'

import { PageShell } from '@/components/coach/page-shell'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  mainStruggleOptions,
  mainStruggleSchema,
  productivityAvatarSchema,
} from '@/features/coach/profile'
import { redirectIfProfileExists } from '@/features/coach/route-helpers'

const struggleSearchSchema = z.object({
  avatar: productivityAvatarSchema,
  mainStruggle: mainStruggleSchema.optional(),
})

export const Route = createFileRoute('/onboarding/struggle')({
  validateSearch: (search) => struggleSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingStrugglePage,
})

function OnboardingStrugglePage() {
  const search = Route.useSearch()

  return (
    <PageShell
      eyebrow="Onboarding"
      title="What feels like the biggest friction right now?"
      description="Choose the challenge you want the coach to keep in view during your first reflections."
      actions={(
        <Link
          to="/onboarding/avatar"
          search={{ avatar: search.avatar }}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Back
        </Link>
      )}
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Flag className="size-5" />
            </div>
            <CardTitle>Choose one main friction point</CardTitle>
            <CardDescription>
              Keeping one clear struggle in view helps the coach avoid generic advice and
              stay close to what actually feels hard right now.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Supportive framing</CardTitle>
            <CardDescription>
              This is not about choosing a flaw. It is about giving your reflections one
              clear improvement theme.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {mainStruggleOptions.map((item) => (
          <Link
            key={item.value}
            to="/onboarding/scenario-quiz"
            search={{
              avatar: search.avatar,
              mainStruggle: item.value,
            }}
            className="group block"
          >
            <Card
              className={search.mainStruggle === item.value
                ? 'border-[#98c77a] bg-[linear-gradient(180deg,#f7fbf2_0%,#edf6e4_100%)]'
                : 'bg-[#fcfdf9] transition group-hover:-translate-y-0.5 group-hover:border-[#cfdcc6]'}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{item.label}</CardTitle>
                  {search.mainStruggle === item.value ? (
                    <Badge className="bg-[#4ea72e] text-white">Selected</Badge>
                  ) : null}
                </div>
                <CardDescription>
                  The coach will use this as the main theme for your early feedback.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </PageShell>
  )
}
