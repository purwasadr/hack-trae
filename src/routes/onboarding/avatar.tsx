import { createFileRoute, Link } from '@tanstack/react-router'
import { Compass, Sparkles } from 'lucide-react'
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
  productivityAvatarOptions,
  productivityAvatarSchema,
} from '@/features/coach/profile'
import { redirectIfProfileExists } from '@/features/coach/route-helpers'

export const Route = createFileRoute('/onboarding/avatar')({
  validateSearch: (search) =>
    z.object({
      avatar: productivityAvatarSchema.optional(),
    }).parse(search),
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingAvatarPage,
})

function OnboardingAvatarPage() {
  const search = Route.useSearch()

  return (
    <PageShell
      eyebrow="Onboarding"
      title="Pick the avatar that feels most like your current season"
      description="This is not a label you are stuck with. It just helps the coach start from the right tone."
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Compass className="size-5" />
            </div>
            <CardTitle>Choose the starting lens</CardTitle>
            <CardDescription>
              Pick the description that feels easiest to recognize. You can refine this
              later through your reflections.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Why this matters</CardTitle>
            <CardDescription>
              The coach uses your avatar to make the first prompts and guidance feel more
              relevant from the start.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {productivityAvatarOptions.map((avatar) => {
          const isSelected = search.avatar === avatar.value

          return (
            <Link
              key={avatar.value}
              to="/onboarding/struggle"
              search={{ avatar: avatar.value }}
              className="group block"
            >
              <Card
                className={isSelected
                  ? 'border-[#98c77a] bg-[linear-gradient(180deg,#f7fbf2_0%,#edf6e4_100%)]'
                  : 'bg-[#fcfdf9] transition group-hover:-translate-y-0.5 group-hover:border-[#cfdcc6]'}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{avatar.label}</CardTitle>
                    {isSelected ? <Badge className="bg-[#4ea72e] text-white">Selected</Badge> : null}
                  </div>
                  <CardDescription>{avatar.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </section>

      <div className="flex justify-end">
        <Link to="/onboarding" className={buttonVariants({ variant: 'ghost' })}>
          Back
        </Link>
      </div>
    </PageShell>
  )
}
