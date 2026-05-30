import { createFileRoute, Link } from '@tanstack/react-router'
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
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <Badge className="w-fit">Suggested style</Badge>
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
