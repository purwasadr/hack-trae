import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ClipboardCheck, Sparkles, Target } from 'lucide-react'
import { toast } from 'sonner'

import { PageShell } from '@/components/coach/page-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import {
  buildReflectionQuestionSet,
  getDefaultReflectionValues,
  reflectionFormSchema,
  reflectionRatingOptions,
  reflectionMoodOptions,
} from '@/features/coach/reflection'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { useAppForm } from '@/lib/form/app-form'
import { createReflection } from '@/server/reflection.fn'

export const Route = createFileRoute('/reflection/new')({
  loader: async () => {
    await requireProfileOrRedirect()
    const { getCoachProfile } = await import('@/server/reflection.fn')
    const profile = await getCoachProfile()

    return {
      profile,
      questionSet: buildReflectionQuestionSet(profile),
    }
  },
  component: NewReflectionPage,
})

function NewReflectionPage() {
  const navigate = useNavigate()
  const { profile, questionSet } = Route.useLoaderData()

  const form = useAppForm({
    defaultValues: getDefaultReflectionValues(),
    validators: {
      onSubmit: reflectionFormSchema,
    },
    onSubmit: async ({ value }) => {
      const reflection = await toast
        .promise(createReflection({ data: value }), {
          loading: 'Saving your reflection...',
          success: 'Reflection saved. Starting analysis.',
          error: (error) => error.message || 'Failed to save your reflection.',
        })
        .unwrap()

      navigate({
        to: '/reflection/$reflectionId/processing',
        params: { reflectionId: reflection.id },
      })
    },
  })

  return (
    <PageShell
      eyebrow="Reflection"
      title="Capture today before the details fade"
      description="Pick the choices that fit today best. The coach will use them to build a practical analysis without making you type every detail."
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[#dbe7d4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf4_100%)]">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
              <ClipboardCheck className="size-5" />
            </div>
            <CardTitle>Guided daily reflection</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-[#6b7566]">
            Choose what fits today best. The coach works better with honest patterns than
            with perfect detail, so quick answers are enough.
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <Card className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef8e8] text-[#3b8e20]">
                <Target className="size-5" />
              </div>
              <CardTitle>Current goal</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[#6b7566]">
              {profile?.firstGoal ?? 'Your first goal will appear here after onboarding.'}
            </CardContent>
          </Card>
          <Card className="bg-[#fcfdf9]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6f7dc] text-[#b88b18]">
                <Sparkles className="size-5" />
              </div>
              <CardTitle>Reflection style</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-[#6b7566]">
              {profile
                ? `Questions are tailored to your ${profile.productivityStyle.replaceAll('_', ' ')} pattern.`
                : 'Questions stay short and practical so you can finish the check-in quickly.'}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-[#dbe7d4] bg-white">
        <CardHeader>
          <CardTitle>Daily reflection</CardTitle>
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
              <form.AppField name="date">
                {(field) => <field.InputField label="Date" type="date" />}
              </form.AppField>
              <form.AppField name="workContext">
                {(field) => (
                  <field.ChoiceField
                    label="Which day shape fits best?"
                    description={profile
                      ? `Choices are tailored to your ${profile.productivityStyle.replaceAll('_', ' ')} pattern and current goal.`
                      : 'Choose the option that feels closest to today.'}
                    options={questionSet.workContextOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="plannedTasks">
                {(field) => (
                  <field.MultiChoiceField
                    label="What were you trying to make happen?"
                    description="Pick the intentions that mattered most today."
                    options={questionSet.plannedTaskOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="completedTasks">
                {(field) => (
                  <field.MultiChoiceField
                    label="What actually moved forward?"
                    description="Pick the outcomes that felt true by the end of the day."
                    options={questionSet.completedTaskOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="unfinishedTasks">
                {(field) => (
                  <field.MultiChoiceField
                    label="What still felt open?"
                    description="Pick what you would still carry into tomorrow."
                    options={questionSet.unfinishedTaskOptions}
                  />
                )}
              </form.AppField>
              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField name="focusLevel">
                  {(field) => (
                    <field.SelectField
                      label="How steady was your focus?"
                      options={reflectionRatingOptions}
                    />
                  )}
                </form.AppField>
                <form.AppField name="energyLevel">
                  {(field) => (
                    <field.SelectField
                      label="How much energy did you have?"
                      options={reflectionRatingOptions}
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name="distractions">
                {(field) => (
                  <field.MultiChoiceField
                    label="What pulled your attention away?"
                    description="Optional. Pick any that showed up."
                    options={questionSet.distractionOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="blockers">
                {(field) => (
                  <field.MultiChoiceField
                    label="What got in the way?"
                    description="Optional. Pick the blockers that felt real."
                    options={questionSet.blockerOptions}
                  />
                )}
              </form.AppField>
              <form.AppField name="mood">
                {(field) => (
                  <field.SelectField
                    label="How did the day feel overall?"
                    options={reflectionMoodOptions.map((item) => ({
                      label: item.label,
                      value: item.value,
                    }))}
                  />
                )}
              </form.AppField>
              <form.AppField name="notes">
                {(field) => (
                  <field.TextAreaField
                    label="Anything else worth remembering?"
                    placeholder="Optional. Add detail only if the choices missed something important."
                    rows={3}
                  />
                )}
              </form.AppField>
              <form.AppForm>
                <form.SubscribeButton label="Analyze reflection" />
              </form.AppForm>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  )
}
