import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { PageShell } from '@/components/coach/page-shell'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import {
  productivityAvatarSchema,
  mainStruggleSchema,
  productivityStyleQuizSchema,
} from '@/features/coach/profile'
import { redirectIfProfileExists } from '@/features/coach/route-helpers'
import { useAppForm } from '@/lib/form/app-form'

const scenarioSearchSchema = z.object({
  avatar: productivityAvatarSchema,
  mainStruggle: mainStruggleSchema,
  planningPreference: productivityStyleQuizSchema.shape.planningPreference.optional(),
  focusDip: productivityStyleQuizSchema.shape.focusDip.optional(),
  blockedResponse: productivityStyleQuizSchema.shape.blockedResponse.optional(),
  wrapUpStyle: productivityStyleQuizSchema.shape.wrapUpStyle.optional(),
})

export const Route = createFileRoute('/onboarding/scenario-quiz')({
  validateSearch: (search) => scenarioSearchSchema.parse(search),
  beforeLoad: async () => {
    await redirectIfProfileExists()
  },
  component: OnboardingScenarioQuizPage,
})

function OnboardingScenarioQuizPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()

  const form = useAppForm({
    defaultValues: {
      blockedResponse: search.blockedResponse ?? 'pick_smaller_step',
      focusDip: search.focusDip ?? 'short_reset',
      planningPreference: search.planningPreference ?? 'time_blocks',
      wrapUpStyle: search.wrapUpStyle ?? 'review_and_plan',
    },
    validators: {
      onSubmit: productivityStyleQuizSchema,
    },
    onSubmit: async ({ value }) => {
      navigate({
        to: '/onboarding/style-result',
        search: {
          avatar: search.avatar,
          mainStruggle: search.mainStruggle,
          ...value,
        },
      })
    },
  })

  return (
    <PageShell
      eyebrow="Onboarding"
      title="Answer four quick scenarios"
      description="These questions help the coach suggest a productivity style that fits your current pattern."
      actions={(
        <Link
          to="/onboarding/struggle"
          search={{
            avatar: search.avatar,
            mainStruggle: search.mainStruggle,
          }}
          className={buttonVariants({ variant: 'ghost' })}
        >
          Back
        </Link>
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Productivity style quiz</CardTitle>
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
              <form.AppField name="planningPreference">
                {(field) => (
                  <field.SelectField
                    label="When you plan your day, what feels most natural?"
                    options={[
                      { value: 'time_blocks', label: 'Time blocks' },
                      { value: 'simple_list', label: 'Simple list' },
                      { value: 'start_fast', label: 'Start fast' },
                      { value: 'flexible_shuffle', label: 'Flexible shuffle' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="focusDip">
                {(field) => (
                  <field.SelectField
                    label="When focus drops, what do you usually do?"
                    options={[
                      { value: 'short_reset', label: 'Take a short reset' },
                      { value: 'push_through', label: 'Push through' },
                      { value: 'switch_tasks', label: 'Switch tasks' },
                      { value: 'quick_scroll', label: 'Quick scroll' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="blockedResponse">
                {(field) => (
                  <field.SelectField
                    label="When you get blocked, what happens next?"
                    options={[
                      { value: 'ask_for_clarity', label: 'Ask for clarity' },
                      { value: 'research_quietly', label: 'Research quietly' },
                      { value: 'pick_smaller_step', label: 'Pick a smaller step' },
                      { value: 'delay_until_later', label: 'Delay until later' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="wrapUpStyle">
                {(field) => (
                  <field.SelectField
                    label="How do you usually end the day?"
                    options={[
                      { value: 'review_and_plan', label: 'Review and plan' },
                      { value: 'stop_when_done', label: 'Stop when done' },
                      { value: 'squeeze_more', label: 'Squeeze in more' },
                      { value: 'lose_track_of_time', label: 'Lose track of time' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubscribeButton label="See my style" />
              </form.AppForm>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  )
}
