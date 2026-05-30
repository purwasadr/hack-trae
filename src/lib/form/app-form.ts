import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import {
  ChoiceField,
  MultiChoiceField,
} from './app-form-choice-components'
import {
  InputField,
  SelectField,
  SubscribeButton,
  TextAreaField,
} from './app-form-components'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    ChoiceField,
    InputField,
    MultiChoiceField,
    SelectField,
    TextAreaField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
