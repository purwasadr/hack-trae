import { createFileRoute, Link } from '@tanstack/react-router'
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
      <section className="grid gap-4 md:grid-cols-2">
        {productivityAvatarOptions.map((avatar) => {
          const isSelected = search.avatar === avatar.value

          return (
            <Link
              key={avatar.value}
              to="/onboarding/struggle"
              search={{ avatar: avatar.value }}
              className="block"
            >
              <Card className={isSelected ? 'border-primary bg-primary/5' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{avatar.label}</CardTitle>
                    {isSelected ? <Badge>Selected</Badge> : null}
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
