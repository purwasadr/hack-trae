import { createFileRoute, Link } from '@tanstack/react-router'
import { Compass, Target } from 'lucide-react'
import { z } from 'zod'

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
import {
  calculateProductivityStyle,
  mainStruggleSchema,
  productivityAvatarSchema,
  productivityStyleDetails,
  productivityStyleQuizSchema,
} from '@/features/coach/profile'
import { redirectIfProfileExists } from '@/features/coach/route-helpers'

const styleResultSearchSchema = z.object({
  avatar: productivityAvatarSchema,
  mainStruggle: mainStruggleSchema,
  planningPreference: productivityStyleQuizSchema.shape.planningPreference,
  focusDip: productivityStyleQuizSchema.shape.focusDip,
  blockedResponse: productivityStyleQuizSchema.shape.blockedResponse,
  wrapUpStyle: productivityStyleQuizSchema.shape.wrapUpStyle,
})

export const Route = createFileRoute('/onboarding/style-result')({
  validateSearch: (search) => styleResultSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingStyleResultPage,
})

function OnboardingStyleResultPage() {
  const search = Route.useSearch()
  const style = calculateProductivityStyle({
    blockedResponse: search.blockedResponse,
    focusDip: search.focusDip,
    planningPreference: search.planningPreference,
    wrapUpStyle: search.wrapUpStyle,
  })
  const styleDetails = productivityStyleDetails[style]
  const guidance = [
    {
      description: styleDetails.summary,
      icon: Compass,
      title: 'What this style suggests',
    },
    {
      description: styleDetails.nextFocus,
      icon: Target,
      title: 'Best next focus',
    },
  ] as const

  return (
    <PageShell
      eyebrow="Onboarding"
      title={styleDetails.title}
      description={styleDetails.summary}
      actions={(
        <Link
          to="/onboarding/goal"
          search={{
            avatar: search.avatar,
            mainStruggle: search.mainStruggle,
            blockedResponse: search.blockedResponse,
            focusDip: search.focusDip,
            planningPreference: search.planningPreference,
            wrapUpStyle: search.wrapUpStyle,
          }}
          className={buttonVariants({ size: 'lg' })}
        >
          Set first goal
        </Link>
      )}
    >
      <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#f8fbf4_0%,#eef6e6_100%)]">
        <CardHeader>
          <Badge className="w-fit bg-[#4ea72e] text-white">Suggested style</Badge>
          <CardTitle>{styleDetails.title}</CardTitle>
          <CardDescription>{styleDetails.summary}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm leading-6">
          <p>
            <span className="font-medium">Best next focus:</span> {styleDetails.nextFocus}
          </p>
          <p>
            This style is a starting point, not a fixed label. You can always refine it by
            continuing your reflections.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-6 md:grid-cols-2">
        {guidance.map((item) => (
          <Card key={item.title} className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
                <item.icon className="size-5" />
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <div className="flex justify-end">
        <Link
          to="/onboarding/scenario-quiz"
          search={search}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Back to quiz
        </Link>
      </div>
    </PageShell>
  )
}
