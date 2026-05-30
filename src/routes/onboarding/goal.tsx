import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Sparkles, Target } from 'lucide-react'
import { z } from 'zod'
import { toast } from 'sonner'

import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import {
  buildSuggestedFirstGoals,
  calculateProductivityStyle,
  mainStruggleSchema,
  productivityAvatarSchema,
  productivityStyleQuizSchema,
  saveOnboardingProfileSchema,
} from '@/features/coach/profile'
import { redirectIfProfileExists } from '@/features/coach/route-helpers'
import { useAppForm } from '@/lib/form/app-form'
import { saveOnboardingProfile } from '@/server/reflection.fn'

const goalSearchSchema = z.object({
  avatar: productivityAvatarSchema,
  mainStruggle: mainStruggleSchema,
  planningPreference: productivityStyleQuizSchema.shape.planningPreference,
  focusDip: productivityStyleQuizSchema.shape.focusDip,
  blockedResponse: productivityStyleQuizSchema.shape.blockedResponse,
  wrapUpStyle: productivityStyleQuizSchema.shape.wrapUpStyle,
})

const goalFormSchema = z.object({
  firstGoal: saveOnboardingProfileSchema.shape.firstGoal,
})

export const Route = createFileRoute('/onboarding/goal')({
  validateSearch: (search) => goalSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingGoalPage,
})

function OnboardingGoalPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const scenarioAnswers = {
    blockedResponse: search.blockedResponse,
    focusDip: search.focusDip,
    planningPreference: search.planningPreference,
    wrapUpStyle: search.wrapUpStyle,
  }
  const productivityStyle = calculateProductivityStyle(scenarioAnswers)
  const suggestedGoals = buildSuggestedFirstGoals({
    mainStruggle: search.mainStruggle,
    productivityStyle,
  })

  const form = useAppForm({
    defaultValues: {
      firstGoal: suggestedGoals[0],
    },
    validators: {
      onSubmit: goalFormSchema,
    },
    onSubmit: async ({ value }) => {
      await toast
        .promise(
          saveOnboardingProfile({
            data: {
              avatar: search.avatar,
              mainStruggle: search.mainStruggle,
              scenarioAnswers,
              productivityStyle,
              firstGoal: value.firstGoal,
            },
          }),
          {
            loading: 'Saving your coach profile...',
            success: 'Profile ready. Let’s do your first reflection.',
            error: (error) => error.message || 'Failed to save your onboarding.',
          },
        )
        .unwrap()

      navigate({ to: '/reflection/new' })
    },
  })

  return (
    <PageShell
      eyebrow="Onboarding"
      title="Set one realistic first goal"
      description="Keep this small and concrete. The dashboard and reflection analysis will use it as your first anchor."
      actions={(
        <Link
          to="/onboarding/style-result"
          search={search}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Back
        </Link>
      )}
    >
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <Target className="size-5" />
            </div>
            <CardTitle>Choose a goal you can actually keep</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-[#6b7566]">
            A smaller target is better here. The dashboard and reflection prompts will use
            this as your first anchor, so realism matters more than ambition.
          </CardContent>
        </Card>
        <Card className="bg-[#fcfdf9]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
              <Sparkles className="size-5" />
            </div>
            <CardTitle>Suggested from your pattern</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-[#6b7566]">
            These options are based on your quiz result and main struggle so your first
            step feels easier to follow through on.
          </CardContent>
        </Card>
      </section>

      <Card className="border-[#dbe7d4] bg-white">
        <CardHeader>
          <CardTitle>First goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.AppField name="firstGoal">
                {(field) => (
                  <field.ChoiceField
                    label="Which first goal feels most useful right now?"
                    description="Pick the suggestion that feels realistic enough to follow through."
                    options={suggestedGoals.map((goal) => ({
                      label: goal,
                      value: goal,
                    }))}
                  />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubscribeButton label="Save profile and continue" />
              </form.AppForm>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  )
}
