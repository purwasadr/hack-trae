import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { PageShell } from '@/components/coach/page-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import {
  getDefaultReflectionValues,
  reflectionFormSchema,
  reflectionMoodOptions,
} from '@/features/coach/reflection'
import { requireProfileOrRedirect } from '@/features/coach/route-helpers'
import { useAppForm } from '@/lib/form/app-form'
import { createReflection } from '@/server/reflection.fn'

export const Route = createFileRoute('/reflection/new')({
  beforeLoad: async () => {
    await requireProfileOrRedirect()
  },
  component: NewReflectionPage,
})

function NewReflectionPage() {
  const navigate = useNavigate()

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
      description="List what you planned, what happened, and what made the day easier or harder. The coach will turn this into a practical analysis."
    >
      <Card>
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
                  <field.TextAreaField
                    label="What kind of work or study day was this?"
                    placeholder="Example: Meetings in the morning, deep work window after lunch, and admin in the evening."
                    rows={3}
                  />
                )}
              </form.AppField>
              <form.AppField name="plannedTasks">
                {(field) => (
                  <field.TextAreaField
                    label="What did you plan to do?"
                    placeholder="One item per line"
                    rows={4}
                  />
                )}
              </form.AppField>
              <form.AppField name="completedTasks">
                {(field) => (
                  <field.TextAreaField
                    label="What did you complete?"
                    placeholder="One item per line"
                    rows={4}
                  />
                )}
              </form.AppField>
              <form.AppField name="unfinishedTasks">
                {(field) => (
                  <field.TextAreaField
                    label="What stayed unfinished?"
                    placeholder="One item per line"
                    rows={4}
                  />
                )}
              </form.AppField>
              <div className="grid gap-6 md:grid-cols-2">
                <form.AppField name="focusLevel">
                  {(field) => (
                    <field.InputField
                      label="Focus level from 1 to 10"
                      type="number"
                      min="1"
                      max="10"
                    />
                  )}
                </form.AppField>
                <form.AppField name="energyLevel">
                  {(field) => (
                    <field.InputField
                      label="Energy level from 1 to 10"
                      type="number"
                      min="1"
                      max="10"
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name="distractions">
                {(field) => (
                  <field.TextAreaField
                    label="What distracted you?"
                    placeholder="Optional. One item per line."
                    rows={3}
                  />
                )}
              </form.AppField>
              <form.AppField name="blockers">
                {(field) => (
                  <field.TextAreaField
                    label="What blocked progress?"
                    placeholder="Optional. One item per line."
                    rows={3}
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
                    placeholder="Optional notes, context, or observations."
                    rows={4}
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
