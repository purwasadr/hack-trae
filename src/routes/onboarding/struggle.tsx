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
      <section className="grid gap-4 md:grid-cols-2">
        {mainStruggleOptions.map((item) => (
          <Link
            key={item.value}
            to="/onboarding/scenario-quiz"
            search={{
              avatar: search.avatar,
              mainStruggle: item.value,
            }}
            className="block"
          >
            <Card
              className={search.mainStruggle === item.value ? 'border-primary bg-primary/5' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{item.label}</CardTitle>
                  {search.mainStruggle === item.value ? <Badge>Selected</Badge> : null}
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
