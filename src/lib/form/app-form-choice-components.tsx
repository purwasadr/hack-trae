import { useId } from 'react'
import { useStore } from '@tanstack/react-form'

import { FieldError, FieldLegend, FieldSet } from '@/components/ui/field'
import { cn } from '@/lib/utils'

import { useFieldContext } from './app-form'

type ChoiceOption = {
  value: string
  label: string
  description?: string
}

export function ChoiceField({
  label,
  options,
  description,
}: {
  label: string
  options: ChoiceOption[]
  description?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const fieldId = useId()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLegend>{label}</FieldLegend>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = field.state.value === option.value

          return (
            <button
              key={option.value}
              id={`${fieldId}-${option.value}`}
              type="button"
              onBlur={field.handleBlur}
              onClick={() => field.handleChange(option.value)}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                'hover:border-primary/50 hover:bg-muted/40',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background',
              )}
            >
              <div className="text-sm font-medium text-foreground">
                {option.label}
              </div>
              {option.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
      {isInvalid ? <FieldError errors={errors} /> : null}
    </FieldSet>
  )
}

export function MultiChoiceField({
  label,
  options,
  description,
}: {
  label: string
  options: ChoiceOption[]
  description?: string
}) {
  const field = useFieldContext<string[]>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const fieldId = useId()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldSet data-invalid={isInvalid}>
      <FieldLegend>{label}</FieldLegend>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isSelected = field.state.value.includes(option.value)

          return (
            <button
              key={option.value}
              id={`${fieldId}-${option.value}`}
              type="button"
              onBlur={field.handleBlur}
              onClick={() => {
                const nextValue = isSelected
                  ? field.state.value.filter((item) => item !== option.value)
                  : [...field.state.value, option.value]

                field.handleChange(nextValue)
              }}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                'hover:border-primary/50 hover:bg-muted/40',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background',
              )}
            >
              <div className="text-sm font-medium text-foreground">
                {option.label}
              </div>
              {option.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              ) : null}
            </button>
          )
        })}
      </div>
      {isInvalid ? <FieldError errors={errors} /> : null}
    </FieldSet>
  )
}
